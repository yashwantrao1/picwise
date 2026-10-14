export const INPUT_FORMATS = [
  "png",
  "jpg",
  "webp",
  "avif",
  "gif",
  "bmp",
  "tiff",
  "svg",
  "ico",
  "heic",
] as const;

export type InputFormat = (typeof INPUT_FORMATS)[number];

export const OUTPUT_FORMATS = [
  "png",
  "jpg",
  "webp",
  "avif",
  "bmp",
  "ico",
  "gif",
] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export const RESIZE_MODES = ["none", "dimensions", "percentage"] as const;
export type ResizeMode = (typeof RESIZE_MODES)[number];

export const FIT_MODES = ["contain", "cover", "exact"] as const;
export type FitMode = (typeof FIT_MODES)[number];

export const FILE_STATUSES = [
  "reading",
  "ready",
  "queued",
  "processing",
  "done",
  "error",
  "cancelled",
] as const;

export type FileStatus = (typeof FILE_STATUSES)[number];

export interface ConverterSettings {
  outputFormat: OutputFormat;
  quality: number;
  pngQuantize: boolean;
  pngColors: number;
  resizeMode: ResizeMode;
  width: number;
  height: number;
  lockAspect: boolean;
  fit: FitMode;
  allowUpscale: boolean;
  percentage: number;
  targetSizeEnabled: boolean;
  targetSizeKB: number;
  stripExif: boolean;
  backgroundColor: string;
  filenamePrefix: string;
  filenameSuffix: string;
}

export interface FileResult {
  url: string;
  size: number;
  width: number;
  height: number;
  filename: string;
  blob: Blob;
  withinTarget: boolean;
}

export interface SourceFile {
  id: string;
  file: File;
  name: string;
  size: number;
  format: InputFormat | null;
  width: number | null;
  height: number | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  status: FileStatus;
  progress: number;
  error: string | null;
  result: FileResult | null;
}

export interface DrawRect {
  canvasWidth: number;
  canvasHeight: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export interface ResizeInput {
  srcWidth: number;
  srcHeight: number;
  mode: ResizeMode;
  width: number;
  height: number;
  percentage: number;
  fit: FitMode;
  allowUpscale: boolean;
  lockAspect: boolean;
}

export interface ProcessOutput {
  bytes: Uint8Array;
  mime: string;
  extension: string;
  width: number;
  height: number;
  withinTarget: boolean;
}

export interface WorkerProcessRequest {
  type: "process";
  jobId: string;
  buffer: ArrayBuffer;
  name: string;
  mime: string;
  settings: ConverterSettings;
}

export interface WorkerCancelRequest {
  type: "cancel";
  jobId: string;
}

export type WorkerRequest = WorkerProcessRequest | WorkerCancelRequest;

export interface WorkerProgressMessage {
  type: "progress";
  jobId: string;
  progress: number;
}

export interface WorkerDoneMessage {
  type: "done";
  jobId: string;
  buffer: ArrayBuffer;
  mime: string;
  extension: string;
  width: number;
  height: number;
  withinTarget: boolean;
}

export interface WorkerErrorMessage {
  type: "error";
  jobId: string;
  message: string;
}

export type WorkerResponse =
  | WorkerProgressMessage
  | WorkerDoneMessage
  | WorkerErrorMessage;
