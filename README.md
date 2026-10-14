# Picwise

Private, in-browser image converter and compressor. Drop in a batch of images, pick one output format, and download the results — including a ZIP of the whole batch. Processing uses Web Workers and WASM codecs. Files are never uploaded.

## Architecture

```text
Browser UI (React, Zustand)
  │  thumbnails, settings, progress, ZIP
  ▼
Worker pool  (navigator.hardwareConcurrency - 1, capped at 4)
  │  one image per worker, queue the rest
  ▼
Decode  →  resize on OffscreenCanvas  →  encode
  createImageBitmap                         lazy @jsquash/* WASM
  HEIC: libheif    TIFF: UTIF               PNG then oxipng
  ICO / SVG / BMP fallbacks                 canvas.toBlob if WASM fails
```

| Path | Role |
| --- | --- |
| `app/` | App Router pages, metadata, manifest, icons |
| `components/` | shadcn/ui primitives and the converter UI |
| `hooks/` | File intake and the processing queue |
| `store/` | Zustand queue + settings persisted in `localStorage` |
| `lib/codecs/` | Detect, decode, resize-ready bitmaps, encode, trim |
| `lib/converters/` | Per-image pipeline used by the worker |
| `lib/utils/` | Resize math, filenames, target-size search, ZIP |
| `workers/` | `image.worker.ts` and the pool |
| `types/` | Shared types, no `any` |
| `tests/` | Vitest unit tests |

Codecs are dynamic `import()`s inside the worker, so the first page load does not download JPEG, PNG, WebP, AVIF, and OxiPNG until a conversion needs them. Object URLs are revoked when a file is removed or replaced, and `ImageBitmap.close()` runs after each decode.

Workers are capped at 4 even when the machine has more cores, so a large batch does not decode every photo at once. The UI still follows `hardwareConcurrency - 1` up to that cap.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm test` | Vitest (resize math, filenames, target-size search) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Deploy on Vercel

This app has no API routes and no server-side image processing. Vercel runs `npm run build` (`next build`) with no extra project settings.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, import the project. Leave the framework preset as Next.js.
3. Do not add environment variables. Nothing is required.
4. Deploy. The build output is a static-looking client app served by Next.js.

`next.config.ts` keeps Turbopack as the Next.js 16 default and also sets Webpack `asyncWebAssembly` plus a WASM output path. Next.js 16 ignores the Webpack block during `next build` unless you pass `--webpack`. Both bundlers rewrite `new URL('*.wasm', import.meta.url)`, which is how `@jsquash` loads codecs, into static files that Vercel can serve.

To build with Webpack explicitly:

```bash
npx next build --webpack
```

## Supported formats

| Format | Input | Output | Notes |
| --- | --- | --- | --- |
| PNG | Yes | Yes | Lossless encode, then OxiPNG. Optional palette size. |
| JPG / JPEG | Yes | Yes | MozJPEG quality 1–100. Optional EXIF keep for JPEG → JPEG. |
| WebP | Yes | Yes | Still images. Animation is not preserved. |
| AVIF | Yes | Yes | WASM encode. Slower than the other formats. |
| GIF | Yes | Yes | First frame only, in and out. Output is a single frame. |
| BMP | Yes | Yes | Uncompressed 24-bit output. Background fill replaces alpha. |
| TIFF | Yes | No | First page. Unusual compressions can fail. |
| SVG | Yes | No | Rasterized. External references can fail. |
| ICO | Yes | Yes | PNG inside an ICO. Longest edge capped at 256. |
| HEIC / HEIF | Yes | No | First image only. See limitations. |

One output format is used for the whole batch. Resize (dimensions or percentage) combines with quality. Target file size binary-searches quality for JPG, WebP, and AVIF, and palette size for PNG and GIF.

## Browser limitations

- **HEIC / HEIF.** Safari can often decode these natively. Chrome, Edge, and Firefox use `heic-decode` (libheif). Bursts and sequences keep the first image. Very large HEIC files are slow and memory-heavy because the decoder expands them to RGBA.
- **Animated GIF, animated WebP, and APNG.** Only the first frame is read. GIF output is one frame, not an animation.
- **AVIF encode** is the slowest path. The encoder speed is biased toward finishing a batch rather than the smallest possible file. Firefox may not encode AVIF with `canvas.toBlob` if the WASM codec fails to load.
- **TIFF.** Decoded with UTIF, first page only. JPEG-in-TIFF and some fax encodings are unsupported.
- **SVG.** Drawn to a canvas, so it becomes pixels. Scripts do not run. Missing width, height, and viewBox fall back to 1024×1024. SVGs that reference external images can taint the canvas and fail.
- **ICO output** is a single PNG-compressed icon, max 256×256. Classic multi-resolution ICO sets are not produced.
- **BMP output** is uncompressed 24-bit, so it is often larger than the source. A target size usually cannot be met without resizing.
- **EXIF and color.** Re-encoding strips metadata. Orientation is applied before that, using `createImageBitmap({ imageOrientation: "from-image" })`. Turning “Strip metadata” off copies the JPEG EXIF segment only when the output is also JPEG, and sets orientation to normal because the pixels are already rotated. XMP, IPTC, and ICC profiles are not preserved. Canvas conversion is sRGB.
- **Transparency.** JPG and BMP flatten onto the chosen background (white by default). PNG, WebP, AVIF, GIF, and ICO can keep alpha.
- **Memory.** Files over 50 MB show a warning. Files over 250 MB are skipped. Images over 120 megapixels are rejected. A batch whose decoded pixels would exceed about 1.5 GB shows a warning. The tab can still run out of memory on huge photos; convert those in smaller groups.
- **Browsers.** Current Chrome, Edge, Firefox, and Safari with Web Workers, `OffscreenCanvas`, `createImageBitmap`, and WebAssembly. There is no server fallback.
- **Service worker.** Registered in production only. It caches visited responses for a basic offline reload. WASM codecs still have to be fetched once before they can be cached.

## Privacy

All conversion, compression, and ZIP creation run in the browser. The app does not send image bytes to an API. Disconnect the network after the page and codecs have loaded and conversion still works for codecs that are already cached.
