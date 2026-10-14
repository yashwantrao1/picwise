import type { InputFormat, OutputFormat } from "@/types";

export interface ConversionLink {
  from: InputFormat;
  to: OutputFormat;
  title: string;
}

export interface Guide {
  id: string;
  title: string;
  from: InputFormat;
  to: OutputFormat;
  paragraphs: readonly string[];
}

export interface FormatFact {
  format: string;
  alpha: string;
  note: string;
}

export function conversionPath(from: InputFormat, to: OutputFormat): string {
  return `/convertor?from=${from}&to=${to}`;
}

const ARTICLE_SLUGS = new Set([
  "png-to-webp",
  "jpg-to-webp",
  "png-to-jpg",
  "webp-to-png",
  "webp-to-jpg",
  "jpg-to-png",
  "heic-to-jpg",
  "heic-to-webp",
  "avif-to-jpg",
  "gif-to-png",
]);

export function articlePath(from: InputFormat, to: OutputFormat): string {
  const slug = `${from}-to-${to}`;
  return ARTICLE_SLUGS.has(slug) ? `/${slug}` : conversionPath(from, to);
}

export const popularConversions: readonly ConversionLink[] = [
  { from: "png", to: "webp", title: "PNG to WebP convertor in bulk" },
  { from: "jpg", to: "webp", title: "JPG to WebP convertor in bulk" },
  { from: "png", to: "jpg", title: "PNG to JPG convertor in bulk" },
  { from: "webp", to: "png", title: "WebP to PNG convertor in bulk" },
  { from: "webp", to: "jpg", title: "WebP to JPG convertor in bulk" },
  { from: "jpg", to: "png", title: "JPG to PNG convertor in bulk" },
  { from: "heic", to: "jpg", title: "HEIC to JPG convertor in bulk" },
  { from: "heic", to: "webp", title: "HEIC to WebP convertor in bulk" },
  { from: "avif", to: "jpg", title: "AVIF to JPG convertor in bulk" },
  { from: "gif", to: "png", title: "GIF to PNG convertor in bulk" },
  { from: "tiff", to: "jpg", title: "TIFF to JPG convertor in bulk" },
  { from: "svg", to: "png", title: "SVG to PNG convertor in bulk" },
];

export const sourceNotes: Record<InputFormat, string> = {
  png: "Screenshots, logos, and UI. Transparency survives in WebP, AVIF, GIF, ICO, and PNG.",
  jpg: "Photographs. There is no alpha channel, so a folder of JPGs is mostly a size decision.",
  webp: "Files that already live on the web, headed for an editor or a tool that still wants PNG or JPG.",
  avif: "Small camera and CDN files. Convert the folder when the destination has not caught up.",
  gif: "The first frame is what gets converted. Useful for a still, not for retiming an animation.",
  bmp: "Uncompressed Windows bitmaps. The useful part of the batch is how much smaller the output is.",
  tiff: "Scans and print files. TIFF is an input here; pick a web format on the way out.",
  svg: "Vectors are rasterized, then encoded. Set a width if the default pixel size is wrong.",
  ico: "Favicons and old Windows icons, including a PNG packed inside the icon.",
  heic: "iPhone photos. A HEIC to JPG convertor in bulk is the job this page is asked for most often.",
};

export const guides: readonly Guide[] = [
  {
    id: "png-to-webp",
    title: "PNG to WebP convertor in bulk",
    from: "png",
    to: "webp",
    paragraphs: [
      "PNG is the file you keep when the edge has to stay sharp: a screenshot, a logo, a diagram, a UI crop. It is also a clumsy file to publish a hundred times. WebP keeps the transparency and, at the quality you set, usually weighs less. The default is 80. Drop the quality if the folder is for a blog, leave it high if the pictures are product shots.",
      "Open the PNG to WebP convertor in bulk, drop the folder or paste from the clipboard, and the output is already WebP. Names stay put, with -compressed on the end. If two files would collide, the second gets a number instead of a silent overwrite. Save one result or a zip of the whole batch.",
      "A width, if you set one, is the only dimension you type. Height follows that image’s own aspect ratio, and nothing is enlarged unless you allow it. Phone photos that were re-saved as PNG are turned upright from EXIF before that data is stripped.",
    ],
  },
  {
    id: "jpg-to-webp",
    title: "JPG to WebP convertor in bulk",
    from: "jpg",
    to: "webp",
    paragraphs: [
      "A camera roll exported as JPG is already compressed. Converting it again will not invent detail, but WebP at a sensible quality is often the smaller file to put on a page. Treat this as a batch export, not a restoration. If a picture looks soft, raise the quality before you blame the format.",
      "JPG has no transparency, so the background color in the settings does nothing useful here. What does matter is the quality slider, an optional target file size, and the width. Target size hunts for a quality that lands near the kilobytes you asked for. It is a search, so a huge folder takes longer than a straight quality pass.",
    ],
  },
  {
    id: "png-to-jpg",
    title: "PNG to JPG convertor in bulk",
    from: "png",
    to: "jpg",
    paragraphs: [
      "JPG is what you want when the destination is a photo printer, an old CMS, or a form that rejects everything else. It cannot store transparency. Transparent pixels are filled with the background color, white unless you change it. A logo with a clear edge will come out on a rectangle. If that rectangle is the problem, use WebP or keep PNG.",
      "Screenshots of text survive the trip better at high quality. Photographs can go lower. The same width rule applies: you set the width, each picture keeps its own proportions, and the default is to refuse an upscale that would only invent pixels.",
    ],
  },
  {
    id: "webp-to-png",
    title: "WebP to PNG convertor in bulk",
    from: "webp",
    to: "png",
    paragraphs: [
      "WebP is common on the web and still awkward in older editors, slide tools, and print queues. PNG is the lossless way out, and it keeps transparency. The file often gets larger. That is the trade, not a failure. The result card shows the new size and marks it when the file grew.",
      "PNG can stay lossless, or you can quantize it to fewer colors when the picture is a flat graphic. Quantize is the wrong move for a photograph. Leave it off unless you know the image is a simple logo or icon.",
    ],
  },
  {
    id: "webp-to-jpg",
    title: "WebP to JPG convertor in bulk",
    from: "webp",
    to: "jpg",
    paragraphs: [
      "Use JPG when the next person in the chain has never heard of WebP and will not install anything. Transparency is flattened onto the background color. Check one image with a clear edge before you run two hundred of them, because the fill is the same for the whole batch.",
      "Quality is the lever. There is no reason to export at 100 if the WebP was already a small photo. Match the job: archive, page, or thumbnail.",
    ],
  },
  {
    id: "jpg-to-png",
    title: "JPG to PNG convertor in bulk",
    from: "jpg",
    to: "png",
    paragraphs: [
      "PNG will not make a JPG sharper, and it will usually make it heavier. The reason to do it is compatibility: a pipeline that only accepts PNG, or a later edit where you need a lossless container so the next save does not compress the photograph again.",
      "If the only goal is a smaller photo, WebP or AVIF is the more honest output. JPG to PNG is a handoff format, not a diet.",
    ],
  },
  {
    id: "heic-to-jpg",
    title: "HEIC to JPG convertor in bulk",
    from: "heic",
    to: "jpg",
    paragraphs: [
      "HEIC is what an iPhone saves when you have not asked it to stick to JPG. Most desktops, inboxes, and upload forms still want JPG. Drop the folder here. Decoding stays on this device: the browser’s own decoder when it has one, otherwise a local decoder. Nothing is uploaded.",
      "A file that this browser cannot decode is marked on its own card. The rest of the batch continues. Orientation is applied before EXIF is stripped, so portraits do not land on their side. The same convertor will also write WebP or PNG if JPG is not the format you actually need.",
    ],
  },
  {
    id: "avif-and-the-rest",
    title: "AVIF, GIF, TIFF, SVG, BMP, and ICO",
    from: "avif",
    to: "jpg",
    paragraphs: [
      "AVIF is the small one. Encoding it in the browser is slower than JPG, which you will feel on a large folder. It is worth that wait when the pictures are photographs and the page can serve AVIF. Going the other way — an AVIF to JPG convertor in bulk, or AVIF to WebP — is the escape hatch for tools that cannot open AVIF yet.",
      "GIF conversion uses the first frame. A looping animation does not come through as a looping animation. BMP is large and simple; any web format is a better archive. TIFF is accepted as an input for scans and is not an output. SVG is drawn to pixels, then encoded — set a width if the vector’s own size is vague. ICO output is capped at 256 pixels on the long edge, which is the right ceiling for a favicon and the wrong one for a poster.",
    ],
  },
];

export const homeHeadline = "A folder in.";
export const homeHeadlineRest = "One format out.";
export const homeLede =
  "Picwise is a private bulk image convertor. A png to webp convertor in bulk, a heic to jpg convertor in bulk, and every other pair on this page are the same tool: the files stay on this device, and you download a zip when the folder is done.";
export const formatIndexIntro =
  "Each button opens the convertor with that output already selected. Point at a pair if you want to see the trip before you commit the folder.";
export const batchNote =
  "Workers do the encoding so the page stays usable. Quality applies to JPG, WebP, and AVIF. PNG can stay lossless. EXIF is used to turn the picture upright, then dropped, unless you ask to keep it on a JPG that is staying a JPG.";

export const steps: readonly { title: string; body: string }[] = [
  {
    title: "Bring the folder",
    body: "Drag it in, pick files, pick a directory, or paste images from the clipboard. Mixed formats in one batch are fine.",
  },
  {
    title: "One output for all of them",
    body: "PNG, JPG, WebP, AVIF, GIF, BMP, or ICO. The buttons on this page preselect that format so you are not hunting for it.",
  },
  {
    title: "Width if you need it",
    body: "Type a width and each picture’s height follows its own aspect ratio. Upscaling stays off unless you turn it on.",
  },
  {
    title: "Save the batch",
    body: "Download one file or a zip. Names keep the original stem, a suffix you can edit, and the new extension.",
  },
];

export const formatFacts: readonly FormatFact[] = [
  { format: "PNG", alpha: "Yes", note: "Screenshots, logos, UI, hard edges. Optional color reduction for flat graphics." },
  { format: "JPG", alpha: "No", note: "Photographs. Transparent pixels are painted with the background color, white by default." },
  { format: "WebP", alpha: "Yes", note: "The practical replacement when a folder of PNGs or JPGs needs to go on a page." },
  { format: "AVIF", alpha: "Yes", note: "Smaller photographs. Encoding takes longer in the browser than JPG or WebP." },
  { format: "GIF", alpha: "Yes", note: "Still images. An animated GIF contributes its first frame." },
  { format: "BMP", alpha: "No", note: "Legacy Windows bitmaps. Convert them when the size is the whole problem." },
  { format: "ICO", alpha: "Yes", note: "Favicons. The long edge is limited to 256 pixels." },
  { format: "TIFF", alpha: "Input", note: "Scans and print files. Choose a web format as the output." },
  { format: "SVG", alpha: "Input", note: "Logos and icons. Rasterized, then encoded like any other picture." },
  { format: "HEIC", alpha: "Input", note: "iPhone photos. JPG and WebP are the usual batch outputs." },
];

export const faqs: readonly { question: string; answer: string }[] = [
  {
    question: "Do the images get uploaded?",
    answer:
      "No. Decoding, resizing, and encoding run in this browser, in workers on your machine. Closing the tab discards the files. There is no account and no library of your pictures on a server.",
  },
  {
    question: "Can I convert a whole folder at once?",
    answer:
      "Yes. That is the point of a png to webp convertor in bulk, and of every other pair on this page. Add a folder, a multi-select, or a paste. You get a progress line per file and one zip at the end. Very large files are called out, and a file the browser cannot decode fails alone instead of taking the batch down.",
  },
  {
    question: "What happens to transparency?",
    answer:
      "PNG, WebP, AVIF, GIF, and ICO can keep it. JPG and BMP cannot. For those, transparent pixels are filled with the background color before encoding. Change that color if white would show up as a box around a logo.",
  },
  {
    question: "Will an animated GIF stay animated?",
    answer:
      "No. The first frame is converted. If you need the motion, keep the original GIF.",
  },
  {
    question: "Can I resize while I convert?",
    answer:
      "Yes. In width-and-height mode you enter the width. Height is calculated from each image, so a landscape photo and a portrait screenshot in the same folder do not get forced into one box. You can also scale by a percentage, or aim at a target file size.",
  },
  {
    question: "Which browsers can run it?",
    answer:
      "A current Chrome, Edge, Firefox, or Safari. HEIC and some AVIF files depend on what that browser can decode. If one file fails, retry it or convert it somewhere else; the rest of the folder is unaffected.",
  },
];
