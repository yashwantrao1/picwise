import { Suspense, type ReactNode } from "react";
import { FORMAT_LABEL, isInputFormat, isOutputFormat } from "@/lib/utils/formats";
import type { InputFormat, OutputFormat } from "@/types";

type ConvertorSearch = Promise<{ from?: string | string[]; to?: string | string[] }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

const INPUTS = ["PNG", "JPG", "WebP", "AVIF", "GIF", "BMP", "TIFF", "SVG", "ICO", "HEIC"] as const;
const OUTPUTS = ["PNG", "JPG", "WebP", "AVIF", "GIF", "BMP", "ICO"] as const;

function Scene({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-44 overflow-hidden" aria-hidden="true">
      {children}
    </div>
  );
}

function Print({ className, label }: { className: string; label: string }) {
  return (
    <div className={`absolute overflow-hidden border border-black/30 shadow-[4px_5px_0_0_rgba(20,18,14,0.18)] ${className}`}>
      <div className="h-full w-full bg-[linear-gradient(165deg,#8ecfc8_0%,#1d646c_46%,#e4b15a_47%,#c46a32_100%)]" />
      <span className="absolute top-1.5 left-1.5 bg-black/75 px-1 py-0.5 font-mono text-[10px] tracking-wide text-white">{label}</span>
    </div>
  );
}

function DropScene({ source }: { source: string }) {
  return (
    <Scene>
      <div className="absolute inset-6 border border-dashed border-black/35" />
      <Print className="top-8 left-10 h-24 w-32 rotate-[-8deg] bg-[#e7a07a]" label={source} />
      <Print className="top-12 left-[38%] h-24 w-36 rotate-[4deg]" label={source} />
    </Scene>
  );
}

function ConvertScene() {
  return (
    <Scene>
      <div className="absolute top-10 left-[14%] h-24 w-36 border-2 border-[#2a2420]">
        <div className="h-full w-full bg-[linear-gradient(165deg,#8ecfc8_0%,#1d646c_46%,#e4b15a_47%,#c46a32_100%)]" />
        <span className="absolute -top-1.5 -left-1.5 size-3 border border-[#2a2420] bg-white" />
        <span className="absolute -top-1.5 -right-1.5 size-3 border border-[#2a2420] bg-white" />
        <span className="absolute -bottom-1.5 -left-1.5 size-3 border border-[#2a2420] bg-white" />
        <span className="absolute -right-1.5 -bottom-1.5 size-3 border border-[#2a2420] bg-white" />
      </div>
      <div className="absolute top-5 right-3 inline-flex items-center gap-1 border border-black/25 bg-[#f7f1e4] px-2.5 py-1.5 font-mono text-[11px] text-[#1c1915] shadow-[3px_3px_0_0_rgba(0,0,0,0.25)]">
        Convert
        <span aria-hidden="true">›</span>
      </div>
    </Scene>
  );
}

function DownloadScene({ output }: { output: string }) {
  return (
    <Scene>
      <div className="absolute top-10 left-[16%] h-24 w-36 border border-black/25 bg-[linear-gradient(165deg,#8ecfc8,#1d646c_55%,#e4b15a)]" />
      <div className="absolute top-4 right-3 border border-black/25 bg-[#f7f1e4] px-2.5 py-1.5 font-mono text-[11px] text-[#1c1915] shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]">↓ Download</div>
      <div className="absolute right-4 bottom-4 border border-black/20 bg-[#f7f1e4] px-2.5 py-2 font-mono text-[11px] text-[#1c1915] shadow-[3px_3px_0_0_rgba(0,0,0,0.18)]">
        <span className="block text-[9px] tracking-[0.14em] text-black/50">FILE</span>
        photo.{output.toLowerCase()}
      </div>
    </Scene>
  );
}

function CompareScene({ output }: { output: string }) {
  return (
    <Scene>
      <div className="absolute top-8 left-[14%] h-28 w-52 overflow-hidden border border-black/30">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,#8ecfc8_0%,#1d646c_46%,#e4b15a_47%,#c46a32_100%)]" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[#c8c2b6] mix-blend-multiply" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white" />
        <span className="absolute top-1.5 left-1.5 bg-black/75 px-1 py-0.5 font-mono text-[10px] text-white">Original</span>
        <span className="absolute top-1.5 right-1.5 bg-black/75 px-1 py-0.5 font-mono text-[10px] text-white">{output}</span>
      </div>
    </Scene>
  );
}

const PRINT_TONES = [
  "bg-[linear-gradient(165deg,#8ecfc8_0%,#1d646c_48%,#e4b15a_49%,#c46a32_100%)]",
  "bg-[linear-gradient(165deg,#f0c27a_0%,#c46a32_42%,#245e68_43%,#9fd4cc_100%)]",
  "bg-[linear-gradient(200deg,#e7b3a2_0%,#6e3d45_46%,#e4b15a_47%,#f4efe4_100%)]",
] as const;

function Fan({ marks }: { marks: readonly string[] }) {
  return (
    <div className="relative mx-auto h-72 w-full max-w-sm" aria-hidden="true">
      {marks.map((mark, index) => (
        <div
          key={`${mark}-${index}`}
          className="absolute top-8 left-8 h-44 w-52 overflow-hidden border border-white/30 shadow-[6px_8px_0_0_rgba(0,0,0,0.28)]"
          style={{ transform: `rotate(${index * 7 - 10}deg) translate(${index * 22}px, ${index * 12}px)` }}
        >
          <div className={`h-full w-full ${PRINT_TONES[index % PRINT_TONES.length]}`} />
          <span className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white">{mark}</span>
        </div>
      ))}
    </div>
  );
}

function Queue({ output }: { output: string }) {
  const extension = output === "FILE" ? "webp" : output.toLowerCase();
  const files = ["kitchen.png", "scan.tiff", "icon.svg", "photo.heic"] as const;

  return (
    <div className="border border-foreground/15" aria-hidden="true">
      <ul>
        {files.map((name) => (
          <li key={name} className="flex items-baseline justify-between gap-4 border-b border-foreground/10 px-3 py-2.5 font-mono text-xs">
            <span>{name}</span>
            <span className="text-muted-foreground">→ .{extension}</span>
          </li>
        ))}
      </ul>
      <p className="bg-[#f4efe4] px-3 py-2.5 font-mono text-xs text-[#1c1915]">batch.zip</p>
    </div>
  );
}

function Docket() {
  const rows = [
    ["Quality", "80"],
    ["Width", "1920"],
    ["Height", "auto"],
    ["Target size", "off"],
    ["Metadata", "strip"],
    ["Suffix", "-compressed"],
  ] as const;

  return (
    <div className="border border-black/20 bg-[#f4efe4] text-[#1c1915] dark:border-white/15 dark:bg-[#2c2822] dark:text-[#f6f1e6]" aria-hidden="true">
      <div className="flex items-baseline justify-between border-b border-current/15 px-4 py-2 font-mono text-[11px] tracking-[0.16em]">
        <span>JOB TICKET</span>
        <span>ONE BATCH</span>
      </div>
      <dl>
        {rows.map(([name, value]) => (
          <div key={name} className="flex items-baseline justify-between gap-8 border-b border-dashed border-current/15 px-4 py-2.5 font-mono text-sm last:border-b-0">
            <dt className="text-current/60">{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ConvertorGuideBody({ from, to }: { from: InputFormat | null; to: OutputFormat | null }) {
  const source = from ? FORMAT_LABEL[from] : "IMG";
  const output = to ? FORMAT_LABEL[to] : "FILE";
  const pair = from && to ? `${FORMAT_LABEL[from]} to ${FORMAT_LABEL[to]}` : null;

  const steps = [
    {
      paper: "bg-[#f6ebe4]",
      title: "Drop the folder",
      body: `Click Choose files, pick a directory, or drag the pictures into the dashed area. ${from ? FORMAT_LABEL[from] : "PNG, JPG, WebP, and the rest"} can sit in the same batch as other formats.`,
      scene: <DropScene source={source} />,
    },
    {
      paper: "bg-[#f7f3dc]",
      title: "Press Convert",
      body: "The output settings are the panel on the right. One format applies to every file. Convert runs in this tab, not on a server.",
      scene: <ConvertScene />,
    },
    {
      paper: "bg-[#e5f3ef]",
      title: "Save the batch",
      body: `Download one finished file from its card, or take the lot as a zip. Names keep the original stem, the suffix you set, and ${to ? `a .${FORMAT_LABEL[to].toLowerCase()} ending` : "the new extension"}.`,
      scene: <DownloadScene output={output} />,
    },
    {
      paper: "bg-[#ece7f4]",
      title: "Compare, then keep it",
      body: "On a finished card, drag the divider. The original and the result share one frame, so a soft export is obvious before you save it.",
      scene: <CompareScene output={output} />,
    },
  ] as const;

  return (
    <div className="border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section aria-labelledby="bench-steps" className="pt-14 pb-4">
        <p className="font-mono text-[11px] tracking-[0.18em] uppercase">{pair ?? "How a batch goes"}</p>
        <h2 id="bench-steps" className="mt-2 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Four moves, then the zip.
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-6">
          The convertor is the panel above. This is the same job, written out so the buttons mean something the first time.
        </p>
      </section>

      <div className="grid gap-4 pb-16 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <article key={step.title} className={`flex flex-col text-[#1c1915] shadow-[5px_5px_0_0_rgba(0,0,0,0.28)] ${step.paper}`}>
            <p className="px-4 pt-4 font-mono text-[11px] tracking-[0.16em]">0{index + 1}</p>
            {step.scene}
            <div className="mt-auto border-t border-black/10 bg-white px-4 py-5">
              <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#4c463f]">{step.body}</p>
            </div>
          </article>
        ))}
      </div>
      </div>

      <section className="bg-[#101828] text-[#f5f7ff]" aria-labelledby="local-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#f5f7ff]/50">01</p>
            <h2 id="local-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {pair ? `${pair}, still on this device` : "The folder never leaves this device"}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#c5cce0]">
              Decoding and encoding run in the browser. Closing the tab discards the batch. A file this browser cannot read is marked on its own card. It is not posted somewhere else to be retried.
            </p>
            <a href="#convert" className="mt-6 inline-block border-b border-[#3de0b0] pb-0.5 font-mono text-xs tracking-wide text-[#3de0b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3de0b0]">
              Back up to the files
            </a>
          </div>
          <Fan marks={from && to ? [FORMAT_LABEL[from], FORMAT_LABEL[from], FORMAT_LABEL[to]] : ["PNG", "JPG", "WEBP"]} />
        </div>
      </section>

      <section className="border-b" aria-labelledby="batch-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Queue output={output} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em]">02</p>
            <h2 id="batch-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              One press for the whole folder
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-7">
              You do not convert them one by one. Drop the lot, press Convert once, and the queue runs while the page stays usable. When it finishes, one zip holds the set. Mixed formats in a single drop are fine. They all come out as the format selected on the right.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#2f4bff] text-[#f5f7ff]" aria-labelledby="formats-heading">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#f5f7ff]/55">03</p>
            <h2 id="formats-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              The formats on this bench
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#dfe4ff]">
              GIF and animated WebP keep the first frame. SVG is drawn out to pixels. ICO output stops at 256 pixels on the long edge. TIFF, SVG, and HEIC come in. They do not go out.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-[#dfe4ff]">IN</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {INPUTS.map((name) => (
                  <li key={name} className="border border-white/25 px-2 py-1 font-mono text-xs">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-[#dfe4ff]">OUT</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {OUTPUTS.map((name) => (
                  <li key={name} className="bg-[#f5f7ff] px-2 py-1 font-mono text-xs text-[#101828]">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="settings-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Docket />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em]">04</p>
            <h2 id="settings-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              The settings that change the file
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-7">
              Quality applies to JPG, WebP, and AVIF. Type a width and each picture’s height follows its own aspect ratio. Nothing is enlarged unless you allow it. Target size hunts for a smaller file. The picture is turned upright from its orientation tag, then that metadata is stripped, unless a JPG is staying a JPG and you ask to keep it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

async function ConvertorGuideResolved({ searchParams }: { searchParams: ConvertorSearch }) {
  const params = await searchParams;
  const fromValue = firstParam(params.from);
  const toValue = firstParam(params.to);
  return (
    <ConvertorGuideBody
      from={isInputFormat(fromValue) ? fromValue : null}
      to={isOutputFormat(toValue) ? toValue : null}
    />
  );
}

export function ConvertorGuide({ searchParams }: { searchParams: ConvertorSearch }) {
  return (
    <Suspense fallback={<ConvertorGuideBody from={null} to={null} />}>
      <ConvertorGuideResolved searchParams={searchParams} />
    </Suspense>
  );
}
