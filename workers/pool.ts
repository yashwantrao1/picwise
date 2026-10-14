import { errorMessage } from "@/lib/utils";
import { workerCount } from "@/lib/utils/memory";
import type { ConverterSettings, WorkerResponse } from "@/types";

export interface WorkerResult {
  buffer: ArrayBuffer;
  mime: string;
  extension: string;
  width: number;
  height: number;
  withinTarget: boolean;
}

interface Task {
  jobId: string;
  buffer: ArrayBuffer;
  name: string;
  mime: string;
  settings: ConverterSettings;
  onProgress: (progress: number) => void;
  resolve: (result: WorkerResult) => void;
  reject: (error: Error) => void;
}

interface Slot {
  worker: Worker;
  task: Task | null;
}

function cancelledError(): Error {
  const error = new Error("Cancelled");
  error.name = "CancelledError";
  return error;
}

export function createImageWorker(): Worker {
  return new Worker(new URL("./image.worker.ts", import.meta.url), { type: "module" });
}

export class WorkerPool {
  private slots: Slot[] = [];
  private queue: Task[] = [];
  private tasks = new Map<string, Task>();
  private closed = false;

  constructor(concurrency = workerCount(navigator.hardwareConcurrency)) {
    for (let index = 0; index < concurrency; index += 1) this.slots.push(this.spawn());
  }

  run(input: Omit<Task, "resolve" | "reject">): Promise<WorkerResult> {
    if (this.closed) return Promise.reject(new Error("Worker pool is closed"));
    return new Promise((resolve, reject) => {
      const task: Task = { ...input, resolve, reject };
      this.tasks.set(task.jobId, task);
      this.queue.push(task);
      this.pump();
    });
  }

  cancel(jobId: string): void {
    const index = this.queue.findIndex((task) => task.jobId === jobId);
    if (index >= 0) {
      const [task] = this.queue.splice(index, 1);
      this.tasks.delete(jobId);
      task?.reject(cancelledError());
      return;
    }
    const task = this.tasks.get(jobId);
    if (!task) return;
    this.tasks.delete(jobId);
    for (const slot of this.slots) slot.worker.postMessage({ type: "cancel", jobId });
    task.reject(cancelledError());
  }

  cancelAll(): void {
    const pending = [...this.queue];
    for (const slot of this.slots) {
      if (slot.task) pending.push(slot.task);
    }
    this.queue = [];
    this.tasks.clear();
    for (const task of pending) task.reject(cancelledError());
    this.slots.forEach((slot, index) => {
      slot.task = null;
      slot.worker.terminate();
      if (!this.closed) this.slots[index] = this.spawn();
    });
  }

  terminate(): void {
    this.closed = true;
    this.cancelAll();
    for (const slot of this.slots) slot.worker.terminate();
    this.slots = [];
  }

  private spawn(): Slot {
    const worker = createImageWorker();
    const slot: Slot = { worker, task: null };
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      const active = slot.task;
      if (active && active.jobId === message.jobId && !this.tasks.has(message.jobId)) {
        slot.task = null;
        this.pump();
        return;
      }
      const task = this.tasks.get(message.jobId);
      if (!task) return;
      if (message.type === "progress") {
        task.onProgress(message.progress);
        return;
      }
      this.tasks.delete(message.jobId);
      if (slot.task?.jobId === message.jobId) slot.task = null;
      if (message.type === "done") {
        task.resolve({
          buffer: message.buffer,
          mime: message.mime,
          extension: message.extension,
          width: message.width,
          height: message.height,
          withinTarget: message.withinTarget,
        });
      } else {
        task.reject(new Error(message.message));
      }
      this.pump();
    };
    worker.onerror = (event) => {
      event.preventDefault();
      const task = slot.task;
      slot.task = null;
      if (task && this.tasks.has(task.jobId)) {
        this.tasks.delete(task.jobId);
        task.reject(new Error(event.message || errorMessage(event.error)));
      }
      const index = this.slots.indexOf(slot);
      worker.terminate();
      if (!this.closed && index >= 0) this.slots[index] = this.spawn();
      this.pump();
    };
    return slot;
  }

  private pump(): void {
    if (this.closed) return;
    for (const slot of this.slots) {
      if (slot.task) continue;
      while (!slot.task) {
        const next = this.queue.shift();
        if (!next) return;
        if (!this.tasks.has(next.jobId)) continue;
        slot.task = next;
        const buffer = next.buffer;
        slot.worker.postMessage(
          {
            type: "process",
            jobId: next.jobId,
            buffer,
            name: next.name,
            mime: next.mime,
            settings: next.settings,
          },
          [buffer],
        );
      }
    }
  }
}
