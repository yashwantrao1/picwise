import { processImageBytes } from "@/lib/converters/process-image";
import { errorMessage } from "@/lib/utils";
import type { ConverterSettings, WorkerRequest, WorkerResponse } from "@/types";

interface WorkerScope {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (message: WorkerResponse, transfer?: Transferable[]) => void;
}

const cancelledJobs = new Set<string>();
const scope = self as unknown as WorkerScope;

function post(message: WorkerResponse, transfer?: Transferable[]): void {
  if (transfer) scope.postMessage(message, transfer);
  else scope.postMessage(message);
}

scope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === "cancel") {
    cancelledJobs.add(message.jobId);
    return;
  }
  void runJob(message.jobId, new Uint8Array(message.buffer), message.name, message.mime, message.settings);
};

async function runJob(
  jobId: string,
  bytes: Uint8Array,
  name: string,
  mime: string,
  settings: ConverterSettings,
): Promise<void> {
  try {
    const output = await processImageBytes(bytes, name, mime, settings, {
      onProgress: (progress) => {
        if (!cancelledJobs.has(jobId)) post({ type: "progress", jobId, progress });
      },
      isCancelled: () => cancelledJobs.has(jobId),
    });
    cancelledJobs.delete(jobId);
    const copy = output.bytes.slice().buffer;
    post(
      {
        type: "done",
        jobId,
        buffer: copy,
        mime: output.mime,
        extension: output.extension,
        width: output.width,
        height: output.height,
        withinTarget: output.withinTarget,
      },
      [copy],
    );
  } catch (error) {
    cancelledJobs.delete(jobId);
    const message = error instanceof Error && error.name === "CancelledError" ? "Cancelled" : errorMessage(error);
    post({ type: "error", jobId, message });
  }
}
