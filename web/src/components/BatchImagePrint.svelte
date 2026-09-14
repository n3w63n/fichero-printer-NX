<script lang="ts">
  import { derived } from "svelte/store";
  import { appConfig, connectionState, printerClient, printerMeta, refreshRfidInfo } from "$/stores";
  import { ImageEncoder, LabelType, type PrintProgressEvent } from "$/lib/fichero";
  import type { LabelProps } from "$/types";
  import { atkinson, bayer, invert, threshold } from "$/utils/post_process";
  import AppModal from "$/components/basic/AppModal.svelte";
  import MdIcon from "$/components/basic/MdIcon.svelte";

  interface Props {
    labelProps: LabelProps;
    show: boolean;
  }

  type FitMode = "contain" | "cover" | "stretch";
  type PostProcess = "threshold" | "dither" | "bayer";

  let { labelProps, show = $bindable() }: Props = $props();

  let files = $state<File[]>([]);
  let printState = $state<"idle" | "sending" | "printing">("idle");
  let currentIndex = $state<number>(0);
  let printProgress = $state<number>(0);
  let error = $state<string>("");

  let density = $state<number>($printerMeta?.densityDefault ?? 2);
  let quantity = $state<number>(1);
  let labelType = $state<LabelType>(LabelType.WithGaps);
  let fitMode = $state<FitMode>("contain");
  let postProcess = $state<PostProcess>("threshold");
  let thresholdValue = $state<number>(140);
  let invertImage = $state<boolean>(false);

  const disconnected = derived(connectionState, ($connectionState) => $connectionState !== "connected");

  const onFilesChanged = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const selected = Array.from(input.files ?? []).filter((file) => file.type.startsWith("image/"));
    files = selected;
    currentIndex = 0;
    printProgress = 0;
    error = "";
  };

  const clearFiles = () => {
    if (printState !== "idle") return;
    files = [];
    currentIndex = 0;
    printProgress = 0;
    error = "";
  };

  const removeFile = (index: number) => {
    if (printState !== "idle") return;
    files = files.filter((_, i) => i !== index);
    currentIndex = Math.min(currentIndex, Math.max(0, files.length - 1));
  };

  const loadImage = async (file: File): Promise<HTMLImageElement> => {
    const url = URL.createObjectURL(file);
    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not decode ${file.name}`));
        image.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const renderImage = async (file: File): Promise<HTMLCanvasElement> => {
    const image = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = labelProps.size.width;
    canvas.height = labelProps.size.height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;

    if (fitMode === "stretch") {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      const scale = fitMode === "contain"
        ? Math.min(canvas.width / image.width, canvas.height / image.height)
        : Math.max(canvas.width / image.width, canvas.height / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;
      ctx.drawImage(image, x, y, width, height);
    }

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (postProcess === "dither") {
      imageData = atkinson(imageData, thresholdValue);
    } else if (postProcess === "bayer") {
      imageData = bayer(imageData, thresholdValue);
    } else {
      imageData = threshold(imageData, thresholdValue);
    }
    if (invertImage) {
      imageData = invert(imageData);
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };

  const onPrint = async () => {
    if ($disconnected || files.length === 0 || printState !== "idle") return;

    printState = "sending";
    error = "";
    printProgress = 0;
    currentIndex = 0;

    const copiesPerImage = Math.max(1, quantity);
    const totalUnits = files.length * copiesPerImage;
    const printTaskName = $printerClient.getPrintTaskType() ?? "B1";

    $printerClient.stopHeartbeat();

    try {
      for (let index = 0; index < files.length; index++) {
        currentIndex = index;
        const canvas = await renderImage(files[index]);
        const encoded = ImageEncoder.encodeCanvas(canvas, labelProps.printDirection);
        const task = $printerClient.abstraction.newPrintTask(printTaskName, {
          totalPages: copiesPerImage,
          density,
          speed: 1,
          labelType,
          statusPollIntervalMs: 100,
          statusTimeoutMs: 8_000,
        });

        const listener = (event: PrintProgressEvent) => {
          const copyFraction = (event.pagePrintProgress + event.pageFeedProgress) / 200;
          const completed = index * copiesPerImage + Math.max(0, event.page - 1) + copyFraction;
          printProgress = Math.min(100, Math.floor((completed / totalUnits) * 100));
        };

        $printerClient.on("printprogress", listener);
        try {
          await task.printInit();
          printState = "printing";
          await task.printPage(encoded, copiesPerImage);
          await task.waitForFinished();
        } finally {
          $printerClient.off("printprogress", listener);
          try {
            await task.printEnd();
          } catch (cleanupError) {
            console.warn("Batch image print cleanup failed", cleanupError);
          }
        }

        if (
          $appConfig.pageDelay !== undefined &&
          $appConfig.pageDelay > 0 &&
          index < files.length - 1
        ) {
          await new Promise<void>((resolve) => setTimeout(resolve, $appConfig.pageDelay));
        }
      }

      printProgress = 100;
    } catch (e) {
      error = `${e}`;
      console.error(e);
    } finally {
      refreshRfidInfo();
      $printerClient.startHeartbeat();
      printState = "idle";
    }
  };

  const onClose = () => {
    if (printState !== "idle") {
      error = "Wait for the current image to finish before closing this window.";
    }
  };
</script>

<AppModal title="Batch image printing" bind:show onClose={onClose}>
  <div class="mb-3">
    <label class="form-label" for="batch-images">Images</label>
    <input
      id="batch-images"
      class="form-control form-control-sm"
      type="file"
      accept="image/*"
      multiple
      disabled={printState !== "idle"}
      onchange={onFilesChanged} />
    <div class="form-text">All selected images are printed in order without disconnecting Bluetooth.</div>
  </div>

  {#if files.length > 0}
    <div class="batch-list border rounded p-2 mb-3">
      {#each files as file, index (`${file.name}-${file.size}-${file.lastModified}`)}
        <div class="d-flex align-items-center gap-2 py-1 border-bottom last-item">
          <span class="badge text-bg-secondary">{index + 1}</span>
          <span class="text-truncate flex-grow-1" title={file.name}>{file.name}</span>
          <button
            class="btn btn-sm btn-outline-danger"
            type="button"
            title="Remove image"
            disabled={printState !== "idle"}
            onclick={() => removeFile(index)}>
            <MdIcon icon="delete" />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <div class="row g-2 mb-2">
    <div class="col-sm-6">
      <label class="form-label" for="batch-fit">Fit</label>
      <select id="batch-fit" class="form-select form-select-sm" bind:value={fitMode} disabled={printState !== "idle"}>
        <option value="contain">Contain — keep whole image</option>
        <option value="cover">Cover — fill label, crop edges</option>
        <option value="stretch">Stretch — fill label</option>
      </select>
    </div>
    <div class="col-sm-6">
      <label class="form-label" for="batch-process">Black/white conversion</label>
      <select id="batch-process" class="form-select form-select-sm" bind:value={postProcess} disabled={printState !== "idle"}>
        <option value="threshold">Threshold</option>
        <option value="dither">Atkinson dither</option>
        <option value="bayer">Bayer dither</option>
      </select>
    </div>
  </div>

  <div class="row g-2 mb-2">
    <div class="col-sm-4">
      <label class="form-label" for="batch-copies">Copies per image</label>
      <input id="batch-copies" class="form-control form-control-sm" type="number" min="1" max="99" bind:value={quantity} disabled={printState !== "idle"} />
    </div>
    <div class="col-sm-4">
      <label class="form-label" for="batch-density">Density</label>
      <input
        id="batch-density"
        class="form-control form-control-sm"
        type="number"
        min={$printerMeta?.densityMin ?? 0}
        max={$printerMeta?.densityMax ?? 2}
        bind:value={density}
        disabled={printState !== "idle"} />
    </div>
    <div class="col-sm-4">
      <label class="form-label" for="batch-paper">Paper</label>
      <select id="batch-paper" class="form-select form-select-sm" bind:value={labelType} disabled={printState !== "idle"}>
        <option value={LabelType.WithGaps}>Labels with gaps</option>
        <option value={LabelType.Black}>Black mark</option>
        <option value={LabelType.Continuous}>Continuous</option>
      </select>
    </div>
  </div>

  <div class="row g-2 align-items-end mb-3">
    <div class="col">
      <label class="form-label" for="batch-threshold">Threshold</label>
      <input id="batch-threshold" class="form-range" type="range" min="1" max="255" bind:value={thresholdValue} disabled={printState !== "idle"} />
    </div>
    <div class="col-auto pb-1">{thresholdValue}</div>
    <div class="col-auto pb-1">
      <div class="form-check">
        <input id="batch-invert" class="form-check-input" type="checkbox" bind:checked={invertImage} disabled={printState !== "idle"} />
        <label class="form-check-label" for="batch-invert">Invert</label>
      </div>
    </div>
  </div>

  {#if files.length > 0}
    <div class="small text-secondary mb-2">
      Target label: {labelProps.size.width} × {labelProps.size.height}px · {labelProps.printDirection} feed
    </div>
  {/if}

  {#if printState !== "idle"}
    <div class="mb-2">
      <div class="small mb-1">Printing {Math.min(currentIndex + 1, files.length)} / {files.length}</div>
      <div class="progress" role="progressbar" aria-valuenow={printProgress} aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" style="width: {printProgress}%">{printProgress}%</div>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="alert alert-danger py-2" role="alert">{error}</div>
  {/if}

  {#snippet footer()}
    <button type="button" class="btn btn-outline-secondary" disabled={printState !== "idle" || files.length === 0} onclick={clearFiles}>
      Clear
    </button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" disabled={printState !== "idle"}>Close</button>
    <button
      type="button"
      class="btn btn-primary"
      disabled={$disconnected || printState !== "idle" || files.length === 0}
      onclick={onPrint}>
      <MdIcon icon="print" />
      {#if $disconnected}Not connected{:else}Print {files.length || ""} image{files.length === 1 ? "" : "s"}{/if}
    </button>
  {/snippet}
</AppModal>

<style>
  .batch-list {
    max-height: 14rem;
    overflow: auto;
  }
  .batch-list .last-item:last-child {
    border-bottom: 0 !important;
  }
  .progress-bar {
    transition: none;
  }
</style>
