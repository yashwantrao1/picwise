import type { Metadata } from "next";
import type { InputFormat, OutputFormat } from "@/types";
import { conversionPath } from "@/lib/seo/conversions";

export interface SeoSection {
  heading: string;
  paragraphs: readonly string[];
}

export interface SeoStep {
  name: string;
  text: string;
}

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoPage {
  slug: string;
  from: InputFormat;
  to: OutputFormat;
  h1: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: readonly string[];
  lede: string;
  sections: readonly SeoSection[];
  steps: readonly SeoStep[];
  faqs: readonly SeoFaq[];
  related: readonly string[];
}

export const seoPages: readonly SeoPage[] = [
  {
    slug: "png-to-webp",
    from: "png",
    to: "webp",
    h1: "PNG to WebP convertor",
    title: "PNG to WebP Convertor in Bulk · Picwise",
    description:
      "Free PNG to WebP convertor for whole folders. Keeps transparency, runs in your browser, and downloads a zip. Files are never uploaded.",
    ogTitle: "PNG to WebP convertor in bulk",
    ogDescription: "Convert a folder of PNGs to WebP privately. Transparency stays. Nothing is uploaded.",
    keywords: ["png to webp convertor", "png to webp converter", "png to webp convertor in bulk", "convert png to webp", "bulk png to webp"],
    lede: "A PNG to WebP convertor is what you want when screenshots, logos, and UI crops are too heavy to publish, and you still need the transparent edge. Picwise does the whole folder in the browser.",
    sections: [
      {
        heading: "When a PNG should become WebP",
        paragraphs: [
          "PNG is the right master for a logo, a diagram, a screenshot of an interface, or any picture with a hard edge and a clear background. It is a poor file to ship a hundred times. WebP keeps that transparency and, at quality 80, is usually the smaller file a page should load.",
          "Leave the PNG alone if you still need a lossless archive. Convert a copy for the website. If the picture is a photograph that was only saved as PNG by accident, WebP is still fine, but JPG to WebP is the more ordinary path for camera photos.",
        ],
      },
      {
        heading: "What this PNG to WebP convertor keeps",
        paragraphs: [
          "Transparency stays. You do not get a white box around a logo unless you later convert that WebP into JPG. Quality applies to the WebP. The default is 80. Drop it for a blog, leave it high for product shots.",
          "You type a width only if you want one. Height follows each image, so a wide banner and a square icon in the same folder are not forced into one frame. Nothing is enlarged unless you allow it. EXIF is read so a picture turns the right way up, then stripped.",
        ],
      },
      {
        heading: "A folder, not one file at a time",
        paragraphs: [
          "Drop the directory, pick many files, or paste from the clipboard. Mixed names are fine. Each result keeps the original name with -compressed on the end and a .webp extension. Two files that would collide get a number instead of a silent overwrite.",
          "Download one WebP or a zip of the batch. Encoding runs on this device. Closing the tab clears the pictures. There is no account and no upload step in this PNG to WebP convertor.",
        ],
      },
    ],
    steps: [
      { name: "Open the PNG to WebP convertor", text: "Use the button on this page. The output format is already WebP." },
      { name: "Add the PNGs", text: "Drop a folder, choose files, or paste images. A batch can mix screenshots and logos." },
      { name: "Set quality or width", text: "Quality 80 is the default. Set a width only when the published size should be smaller than the file." },
      { name: "Download the WebP files", text: "Save one image or a zip. Original PNGs are not modified." },
    ],
    faqs: [
      {
        question: "Does a PNG to WebP convertor keep transparency?",
        answer: "Yes. WebP can store an alpha channel, and this convertor keeps it. A logo with a clear edge stays clear. JPG would paint that edge white.",
      },
      {
        question: "Can I convert many PNGs to WebP at once?",
        answer: "Yes. Add a folder or a multi-select. Each file is converted to WebP and you can download them together as a zip.",
      },
      {
        question: "Will the WebP be smaller than the PNG?",
        answer: "Usually, at quality 80. A tiny flat icon can occasionally grow or barely change. The result shows the new size so you can see it before you keep the file.",
      },
      {
        question: "Are my PNGs uploaded?",
        answer: "No. The PNG to WebP conversion runs in your browser. The files are not sent to a server.",
      },
      {
        question: "What quality should I use?",
        answer: "80 is a sound default for screenshots and interface art. Use 90 or above when the picture is a product photo. Use lower when the folder is decorative and weight matters more than fine detail.",
      },
    ],
    related: ["jpg-to-webp", "webp-to-png", "png-to-jpg"],
  },
  {
    slug: "jpg-to-webp",
    from: "jpg",
    to: "webp",
    h1: "JPG to WebP convertor",
    title: "JPG to WebP Convertor in Bulk · Picwise",
    description:
      "Convert JPG and JPEG photos to WebP in bulk. Free browser convertor with quality control and zip download. Your photos never leave the device.",
    ogTitle: "JPG to WebP convertor in bulk",
    ogDescription: "Turn a folder of JPG photos into WebP without uploading them.",
    keywords: ["jpg to webp convertor", "jpeg to webp converter", "jpg to webp convertor in bulk", "convert jpg to webp", "bulk jpeg to webp"],
    lede: "A JPG to WebP convertor takes photographs you already have and writes a WebP the page can load faster. It will not invent detail the JPG lost. It will usually write a smaller file.",
    sections: [
      {
        heading: "JPG is already compressed",
        paragraphs: [
          "A camera roll exported as JPG has been through one lossy save. Converting it to WebP is a second save. Treat that as an export for the web, not as a restoration. If a picture looks soft, raise the WebP quality before you blame the format.",
          "JPEG and JPG are the same kind of file here. Drop either extension into the same batch. The output is WebP for all of them.",
        ],
      },
      {
        heading: "Quality, size, and width",
        paragraphs: [
          "JPG has no transparency, so the background color does nothing useful on this path. The controls that matter are quality, an optional target file size, and width. Target size searches for a quality near the kilobytes you asked for, which takes longer than a straight quality pass on a large folder.",
          "Width is optional. If you set 1600, a 4000-pixel photo scales down and a 900-pixel photo stays 900 unless you allow upscaling. Height follows that photo’s own shape.",
        ],
      },
      {
        heading: "Batch export for a site",
        paragraphs: [
          "This is the job when a client sends a folder of JPGs and the site wants WebP. One output format applies to the whole batch. Names keep their stem, gain -compressed, and end in .webp.",
          "The work stays on the computer you are using. A shared machine does not upload the camera roll anywhere as part of this convertor. Download the zip and the originals remain where you left them.",
        ],
      },
    ],
    steps: [
      { name: "Open the JPG to WebP convertor", text: "The output is preset to WebP." },
      { name: "Add the photographs", text: "Drop the folder of JPG or JPEG files." },
      { name: "Choose quality", text: "Start at 80 for pages. Use the target size only when you have a kilobyte budget per image." },
      { name: "Save the WebPs", text: "Download the zip. Check one photo at full size before you publish the set." },
    ],
    faqs: [
      {
        question: "Is JPEG to WebP the same as JPG to WebP?",
        answer: "Yes. Both extensions are the same photo format in this convertor. The output is WebP either way.",
      },
      {
        question: "Will WebP look better than my JPG?",
        answer: "No. Detail the JPG already discarded cannot come back. WebP is for a smaller or more compatible web file, not a sharper photograph.",
      },
      {
        question: "Can I convert a whole camera export at once?",
        answer: "Yes. Add the folder. Each JPG becomes a WebP and the batch downloads as a zip.",
      },
      {
        question: "Do you upload the photos?",
        answer: "No. JPG to WebP encoding happens in the browser on your device.",
      },
      {
        question: "Should I strip the location data?",
        answer: "EXIF is removed by default after the picture has been turned upright. Leave that on if the photos came from a phone and you do not want GPS stored in the WebP.",
      },
    ],
    related: ["png-to-webp", "heic-to-webp", "webp-to-jpg"],
  },
  {
    slug: "png-to-jpg",
    from: "png",
    to: "jpg",
    h1: "PNG to JPG convertor",
    title: "PNG to JPG Convertor in Bulk · Picwise",
    description:
      "Convert PNG to JPG in bulk, including screenshots and transparent logos. Set the background fill and quality. Private browser convertor, no upload.",
    ogTitle: "PNG to JPG convertor in bulk",
    ogDescription: "Turn a folder of PNGs into JPG. Transparent pixels use the background color you set.",
    keywords: ["png to jpg convertor", "png to jpeg converter", "png to jpg convertor in bulk", "convert png to jpg", "png to jpg online"],
    lede: "A PNG to JPG convertor is the handoff into a printer, an old form, or a CMS that still refuses everything except JPG. JPG cannot store transparency, so the clear parts of the PNG become a color.",
    sections: [
      {
        heading: "The background is the whole decision",
        paragraphs: [
          "Transparent pixels are filled before the JPG is written. The default fill is white. A logo that looked like it floated on the page will sit on a white rectangle. Change the background color if the destination page is not white, and check one file before you run two hundred.",
          "If that rectangle is the problem, do not use JPG. A PNG to WebP convertor keeps the clear edge. Use JPG when the next person in the chain can only open JPG.",
        ],
      },
      {
        heading: "Quality for screenshots and for photos",
        paragraphs: [
          "Screenshots of text survive better at a high quality. Soft photographs can go lower. There is no single number that is right for a folder of both. If the folder is mixed, split it, or stay high and accept a larger JPG.",
          "You can also set a width. Height is calculated per image. A portrait screenshot and a landscape diagram do not get stretched into the same box.",
        ],
      },
      {
        heading: "Bulk PNG to JPG without an upload",
        paragraphs: [
          "Add the folder. The output format is JPG for every file. Names keep the original stem and change extension. Download a zip when the batch finishes.",
          "The PNGs are read on this device and the JPGs are written on this device. Nothing in the conversion is uploaded.",
        ],
      },
    ],
    steps: [
      { name: "Open the PNG to JPG convertor", text: "Output is preset to JPG." },
      { name: "Set the background", text: "White is the default. Change it if transparent logos would otherwise show a white box." },
      { name: "Add the PNGs", text: "Drop the folder. Look at one result before you trust the rest." },
      { name: "Download the JPGs", text: "Save the zip. The original PNGs stay where they were." },
    ],
    faqs: [
      {
        question: "Why does my logo get a white box?",
        answer: "JPG has no transparency. Clear pixels are painted with the background color, which starts as white. Change that color, or convert to WebP if the edge must stay clear.",
      },
      {
        question: "Can I convert PNG to JPEG as well as JPG?",
        answer: "The file this convertor writes is a JPEG, with a .jpg extension. Programs that ask for JPEG can open it.",
      },
      {
        question: "Is bulk PNG to JPG private?",
        answer: "Yes. The folder is processed in your browser. The images are not uploaded.",
      },
      {
        question: "Will text in a screenshot stay sharp?",
        answer: "Use a high quality, and avoid shrinking the width more than you need. JPG is a weak format for small text. PNG or WebP is kinder to UI screenshots.",
      },
      {
        question: "Can I resize while converting PNG to JPG?",
        answer: "Yes. Enter a width. Each PNG keeps its own aspect ratio, and images are not enlarged unless you turn that on.",
      },
    ],
    related: ["png-to-webp", "jpg-to-png", "webp-to-jpg"],
  },
  {
    slug: "webp-to-png",
    from: "webp",
    to: "png",
    h1: "WebP to PNG convertor",
    title: "WebP to PNG Convertor in Bulk · Picwise",
    description:
      "Convert WebP to PNG in bulk for editors and print tools that cannot open WebP. Transparency is kept. The convertor runs in your browser.",
    ogTitle: "WebP to PNG convertor in bulk",
    ogDescription: "Turn a folder of WebP files into PNG without uploading them. Transparency stays.",
    keywords: ["webp to png convertor", "webp to png converter", "webp to png convertor in bulk", "convert webp to png", "open webp as png"],
    lede: "A WebP to PNG convertor is how you get a file into an editor, a slide deck, or a print queue that still cannot open WebP. PNG is the lossless way out, and it keeps transparency.",
    sections: [
      {
        heading: "The file will often get larger",
        paragraphs: [
          "WebP was probably smaller on purpose. PNG does not throw away more detail, so the new file is often heavier. That is the trade for compatibility, not a failed conversion. The result shows the new size.",
          "Use this path when the next tool rejects WebP. If you only wanted a smaller photo, stay on WebP or go to JPG. PNG is the handoff format.",
        ],
      },
      {
        heading: "Transparency and color reduction",
        paragraphs: [
          "A WebP with a clear background becomes a PNG with a clear background. You do not have to flatten it. Flattening is what happens on the way to JPG, not here.",
          "PNG can stay lossless, which is what you want for a photograph or a screenshot. Color reduction is only useful for a flat logo with few colors. Leave it off unless you know the picture is simple.",
        ],
      },
      {
        heading: "Convert a folder of WebP files",
        paragraphs: [
          "People collect WebP from downloads and then need PNG for one stubborn program. Drop that folder here. Every file is written as PNG. Names stay recognizable, with a new extension.",
          "Decoding and encoding stay in the browser. A WebP you do not want on a server never has to be on one for this conversion.",
        ],
      },
    ],
    steps: [
      { name: "Open the WebP to PNG convertor", text: "Output is preset to PNG." },
      { name: "Add the WebP files", text: "Drop the folder or select the downloads you need as PNG." },
      { name: "Leave PNG lossless", text: "Turn on color reduction only for simple logos." },
      { name: "Download the PNGs", text: "Save one file or a zip of the batch." },
    ],
    faqs: [
      {
        question: "Why is the PNG bigger than the WebP?",
        answer: "PNG is keeping the picture without WebP’s extra compression. A larger file is normal. Use it when another program cannot open WebP.",
      },
      {
        question: "Does WebP to PNG keep transparency?",
        answer: "Yes. A clear background stays clear in the PNG.",
      },
      {
        question: "Can I convert many WebP files at once?",
        answer: "Yes. Add the folder. Each WebP becomes a PNG and you can download a zip.",
      },
      {
        question: "Is the conversion uploaded?",
        answer: "No. WebP to PNG runs locally in the browser.",
      },
      {
        question: "Will this fix a blurry WebP?",
        answer: "No. PNG will not restore detail the WebP never had. It only changes the container so other software can open the picture.",
      },
    ],
    related: ["webp-to-jpg", "png-to-webp", "jpg-to-png"],
  },
  {
    slug: "webp-to-jpg",
    from: "webp",
    to: "jpg",
    h1: "WebP to JPG convertor",
    title: "WebP to JPG Convertor in Bulk · Picwise",
    description:
      "Convert WebP to JPG in bulk when the next tool only accepts JPEG. Set quality and the fill for transparent pixels. No upload.",
    ogTitle: "WebP to JPG convertor in bulk",
    ogDescription: "Export a folder of WebP images as JPG. Transparent areas use your background color.",
    keywords: ["webp to jpg convertor", "webp to jpeg converter", "webp to jpg convertor in bulk", "convert webp to jpg", "webp to jpeg online"],
    lede: "A WebP to JPG convertor is for the person who has never heard of WebP and will not install anything. JPG is the file they can open. Transparency, if the WebP had it, becomes a solid color.",
    sections: [
      {
        heading: "Flatten first, then judge the quality",
        paragraphs: [
          "Check one image that has a clear edge before you convert the folder. The fill color is the same for the whole batch. White is the default. A sticker on a transparent WebP will sit on that color in the JPG.",
          "Quality is the other lever. A WebP that was already a small photo does not need to be exported at 100. Match the job: an archive, a page, or a thumbnail.",
        ],
      },
      {
        heading: "Photographs versus graphics",
        paragraphs: [
          "Camera-style WebPs convert cleanly to JPG because they never needed transparency. Flat graphics and screenshots are the ones that show the fill and the JPEG blur. If the folder is screenshots, WebP to PNG is the kinder conversion.",
          "Width still works the same way. Set it when the JPG should be smaller on the long side. Each picture keeps its own proportions.",
        ],
      },
      {
        heading: "Private bulk export",
        paragraphs: [
          "Drop the WebP folder. The output is JPG for every file. Download the zip when the batch finishes. The originals are not overwritten.",
          "The convertor does not upload the WebPs to make the JPGs. The browser does the work.",
        ],
      },
    ],
    steps: [
      { name: "Open the WebP to JPG convertor", text: "JPG is already selected." },
      { name: "Set the background if anything is transparent", text: "Skip this for ordinary photos. Change it for logos and stickers." },
      { name: "Add the folder", text: "Convert one representative file in your head by looking at the first result." },
      { name: "Download the JPGs", text: "Take the zip. Send that, not the WebPs, if the recipient cannot open WebP." },
    ],
    faqs: [
      {
        question: "Can every WebP become a JPG?",
        answer: "Still WebP files can. Animated WebP is not reconstructed as a video or a multi-frame JPG. You get a still image.",
      },
      {
        question: "What happens to a transparent WebP?",
        answer: "The clear pixels are filled with the background color, then the JPG is written. JPG cannot store transparency.",
      },
      {
        question: "Is WebP to JPEG different from WebP to JPG?",
        answer: "No. The file is a JPEG saved with a .jpg extension.",
      },
      {
        question: "Can I convert a folder of WebP downloads?",
        answer: "Yes. Drop the folder and download a zip of JPGs.",
      },
      {
        question: "Are the files uploaded?",
        answer: "No. Conversion stays in the browser.",
      },
    ],
    related: ["webp-to-png", "png-to-jpg", "jpg-to-webp"],
  },
  {
    slug: "jpg-to-png",
    from: "jpg",
    to: "png",
    h1: "JPG to PNG convertor",
    title: "JPG to PNG Convertor in Bulk · Picwise",
    description:
      "Convert JPG to PNG in bulk when a pipeline only accepts PNG. Expect a larger file, not a sharper photo. Private browser convertor.",
    ogTitle: "JPG to PNG convertor in bulk",
    ogDescription: "Turn a folder of JPGs into PNG for tools that require it. Photos are not magically sharpened.",
    keywords: ["jpg to png convertor", "jpeg to png converter", "jpg to png convertor in bulk", "convert jpg to png", "jpeg to png online"],
    lede: "A JPG to PNG convertor does not make a photograph sharper. It puts the picture in a container that a pipeline, a game tool, or a printer profile will accept. The PNG is often heavier than the JPG.",
    sections: [
      {
        heading: "Use it as a handoff, not a diet",
        paragraphs: [
          "PNG will not recover texture the JPG already compressed away. The reason to convert is compatibility: the next step only accepts PNG, or you want a lossless container so later edits do not compress the photograph again.",
          "If the goal is a smaller file for a web page, this is the wrong direction. JPG to WebP is the conversion that can reduce weight. JPG to PNG is the conversion that satisfies a format rule.",
        ],
      },
      {
        heading: "What you can still change",
        paragraphs: [
          "You can set a width so the PNG is not a full-resolution export of a camera JPG. Height follows each photo. Upscaling stays off unless you ask for it, because stretching a JPG does not add real detail.",
          "EXIF orientation is applied and the metadata is stripped by default. A phone photo that was stored on its side comes out upright.",
        ],
      },
      {
        heading: "Folders of JPG into PNG",
        paragraphs: [
          "Drop the folder. Every file is written as PNG with the same name stem. Download one PNG or a zip. The JPGs you started with are left in place.",
          "The batch runs in the browser. A client folder does not need to be uploaded to become PNG.",
        ],
      },
    ],
    steps: [
      { name: "Open the JPG to PNG convertor", text: "PNG is already the output." },
      { name: "Add the JPG folder", text: "JPEG files are included. There is no separate mode." },
      { name: "Set a width only if the export should be smaller", text: "Leave resize off to keep the current pixel size." },
      { name: "Download the PNGs", text: "Expect larger files. That is the cost of the format the next tool demanded." },
    ],
    faqs: [
      {
        question: "Will JPG to PNG improve quality?",
        answer: "No. The PNG holds the same picture. It stops further JPEG damage if you edit and save again, but it does not sharpen what is already soft.",
      },
      {
        question: "Why is the PNG so much bigger?",
        answer: "JPG was compressed. PNG stores the pixels without that compression. A bigger file is expected.",
      },
      {
        question: "Does it accept JPEG as well as JPG?",
        answer: "Yes. Both are the same format here.",
      },
      {
        question: "Can I convert hundreds of JPGs?",
        answer: "Add them as a folder. Very large files are warned about. A file that fails does not cancel the rest.",
      },
      {
        question: "Is it private?",
        answer: "Yes. JPG to PNG is done on your device. The photos are not uploaded.",
      },
    ],
    related: ["png-to-jpg", "webp-to-png", "jpg-to-webp"],
  },
  {
    slug: "heic-to-jpg",
    from: "heic",
    to: "jpg",
    h1: "HEIC to JPG convertor",
    title: "HEIC to JPG Convertor in Bulk · Picwise",
    description:
      "Convert iPhone HEIC photos to JPG in bulk. Orientation is fixed, the folder stays on your device, and you download a zip.",
    ogTitle: "HEIC to JPG convertor in bulk",
    ogDescription: "Turn an iPhone HEIC folder into JPG without uploading the photos.",
    keywords: ["heic to jpg convertor", "heic to jpeg converter", "heic to jpg convertor in bulk", "convert heic to jpg", "iphone heic to jpg"],
    lede: "A HEIC to JPG convertor is how an iPhone camera roll becomes files that email, Windows, and upload forms will open. HEIC is what the phone saves until you ask it to stick to JPG.",
    sections: [
      {
        heading: "The iPhone folder",
        paragraphs: [
          "AirDrop or a cable copy often lands as a pile of .heic files. Most desktops still want JPG. Drop that pile here. The output is JPG for the whole batch, with a zip at the end.",
          "HEIC and HEIF are both accepted as input. The written file uses a .jpg extension. Live Photo motion is not copied. You get the still photograph.",
        ],
      },
      {
        heading: "Decoded on this device",
        paragraphs: [
          "The browser’s own HEIC decoder is used when it has one. Otherwise a decoder runs locally in the page. Either way the photos are not uploaded to be converted.",
          "A file this browser cannot decode is marked on its own card. The rest of the folder continues. Retry that one file, or convert it on the phone by asking Photos to export JPG, and leave the successful ones in the zip.",
        ],
      },
      {
        heading: "Upright photos, without the GPS",
        paragraphs: [
          "Phone photos store rotation in EXIF. The convertor turns the picture upright first, then strips that metadata by default, so the JPG is not sideways and does not carry the location tag.",
          "Set a width if you do not need the full camera resolution in the JPG. Height follows each photo, including portraits.",
        ],
      },
    ],
    steps: [
      { name: "Open the HEIC to JPG convertor", text: "JPG is already selected." },
      { name: "Drop the HEIC folder", text: "Include HEIF files in the same batch if you have them." },
      { name: "Watch for a file that fails", text: "One unreadable HEIC does not stop the others." },
      { name: "Download the JPG zip", text: "Originals stay in the folder you dropped. The zip is the copy you can send." },
    ],
    faqs: [
      {
        question: "Can I convert a whole iPhone album to JPG?",
        answer: "Yes, if you can get the HEIC files onto this computer. Drop the folder and download a zip of JPGs.",
      },
      {
        question: "Are the photos uploaded?",
        answer: "No. HEIC to JPG runs in the browser. The camera roll is not sent to a server.",
      },
      {
        question: "Why did one HEIC fail?",
        answer: "Some HEIC files need a decoder this browser does not have. That file is marked. The rest of the batch still finishes.",
      },
      {
        question: "Will portraits stay upright?",
        answer: "Yes. Orientation is applied before EXIF is removed, so a sideways HEIC should come out as an upright JPG.",
      },
      {
        question: "Does this keep Live Photos?",
        answer: "No. You get the still image as a JPG. The motion from a Live Photo is not exported.",
      },
    ],
    related: ["heic-to-webp", "jpg-to-webp", "jpg-to-png"],
  },
  {
    slug: "heic-to-webp",
    from: "heic",
    to: "webp",
    h1: "HEIC to WebP convertor",
    title: "HEIC to WebP Convertor in Bulk · Picwise",
    description:
      "Convert iPhone HEIC photos straight to WebP in bulk. Skip a JPG in the middle. Private browser convertor with quality control and zip download.",
    ogTitle: "HEIC to WebP convertor in bulk",
    ogDescription: "Export an iPhone HEIC folder as WebP for the web, without uploading the photos.",
    keywords: ["heic to webp convertor", "heic to webp converter", "heic to webp convertor in bulk", "convert heic to webp", "iphone photos to webp"],
    lede: "A HEIC to WebP convertor skips the extra JPG. iPhone photos become the files a website should serve, in one batch, on the computer you are already using.",
    sections: [
      {
        heading: "Skip the middle JPEG",
        paragraphs: [
          "The usual habit is HEIC to JPG, then JPG to WebP. That is two lossy saves. This page goes from HEIC to WebP once. You still choose a quality. You do not recompress a JPEG you only made to throw away.",
          "Use JPG instead when the photos are going to email or to a person on an old computer. Use WebP when they are going on a page.",
        ],
      },
      {
        heading: "Same private decode",
        paragraphs: [
          "HEIC is decoded in the browser, natively when the browser can, and with a local decoder otherwise. The photos are not uploaded. A file that cannot be decoded fails alone.",
          "These are photographs, so transparency is rarely the point. Quality and width are. Start at 80. Set a width when the site does not need a 12-megapixel image.",
        ],
      },
      {
        heading: "A folder of phone photos",
        paragraphs: [
          "Drop the HEIC directory. Every successful file is written as WebP, named from the original, and packed in a zip if you want the set together.",
          "Orientation is corrected before metadata is stripped. Portraits should not land on their side, and the location tag should not ride along in the WebP.",
        ],
      },
    ],
    steps: [
      { name: "Open the HEIC to WebP convertor", text: "WebP is already the output." },
      { name: "Add the iPhone photos", text: "Drop the HEIC or HEIF folder." },
      { name: "Set quality for the web", text: "80 is a practical start. Raise it for hero images." },
      { name: "Download the WebP zip", text: "Publish those files. Keep the HEICs as the masters." },
    ],
    faqs: [
      {
        question: "Why convert HEIC to WebP instead of JPG?",
        answer: "WebP is the better file for a website. JPG is the better file for someone who cannot open anything else. This page is the website path.",
      },
      {
        question: "Can I convert the whole camera roll?",
        answer: "Add every HEIC you copied to the computer. The batch becomes WebP and downloads as a zip.",
      },
      {
        question: "Do the photos get uploaded?",
        answer: "No. Decoding and encoding stay in the browser.",
      },
      {
        question: "What if a HEIC will not open?",
        answer: "That card shows an error. The other photos still convert. Export the stubborn one from the phone as a still image and add it again.",
      },
      {
        question: "Will the WebP include the GPS location?",
        answer: "EXIF is stripped by default after the photo is rotated upright. The location tag is not kept.",
      },
    ],
    related: ["heic-to-jpg", "jpg-to-webp", "png-to-webp"],
  },
  {
    slug: "avif-to-jpg",
    from: "avif",
    to: "jpg",
    h1: "AVIF to JPG convertor",
    title: "AVIF to JPG Convertor in Bulk · Picwise",
    description:
      "Convert AVIF to JPG in bulk when a tool or teammate cannot open AVIF. Free browser convertor. Files stay on your device.",
    ogTitle: "AVIF to JPG convertor in bulk",
    ogDescription: "Turn a folder of AVIF images into JPG without uploading them.",
    keywords: ["avif to jpg convertor", "avif to jpeg converter", "avif to jpg convertor in bulk", "convert avif to jpg", "open avif as jpg"],
    lede: "An AVIF to JPG convertor is the escape hatch. AVIF is a small, modern photo file. A lot of desktop software still cannot open it. JPG can.",
    sections: [
      {
        heading: "Compatibility, not a smaller file",
        paragraphs: [
          "AVIF was already the small one. JPG will often be larger, and it will not look better than the AVIF. Convert when a teammate, a printer, or an old editor rejects the AVIF. Keep the AVIF if the only goal was weight.",
          "Decoding AVIF in the browser can be slower than opening a JPG. A large folder will feel that. Let the batch run. One file that this browser cannot decode fails by itself.",
        ],
      },
      {
        heading: "Quality after a modern codec",
        paragraphs: [
          "You are re-encoding. Quality 85 or 90 is a reasonable export when the AVIF was a photograph you care about. Lower it for thumbnails. There is no transparency in a typical photo AVIF. If one graphic has a clear edge, the JPG fill color covers it.",
          "Set a width if the AVIF is far larger than the JPG needs to be. Height follows the picture. Upscaling stays off.",
        ],
      },
      {
        heading: "A private way out of AVIF",
        paragraphs: [
          "Drop the folder of .avif files. The output is JPG, in a zip if you want every file together. Names follow the originals.",
          "The images are not uploaded to be converted. That matters when the AVIFs are client work or unreleased product shots.",
        ],
      },
    ],
    steps: [
      { name: "Open the AVIF to JPG convertor", text: "JPG is preset." },
      { name: "Add the AVIF files", text: "Drop the folder. Expect the first files to take a moment to decode." },
      { name: "Pick a high quality for photographs", text: "You are leaving a newer codec. Do not crush the JPG on the way out." },
      { name: "Download the JPGs", text: "Send the zip to the person who could not open AVIF." },
    ],
    faqs: [
      {
        question: "Why convert AVIF to JPG at all?",
        answer: "Because the next program cannot open AVIF. JPG is the file it will accept. The JPG is not a quality upgrade.",
      },
      {
        question: "Will the folder be slow?",
        answer: "AVIF decode and JPG encode both happen locally, and AVIF is the slower half. A large folder takes longer than the same number of PNGs.",
      },
      {
        question: "Can I convert many AVIF files at once?",
        answer: "Yes. Add the folder and download a zip of JPGs.",
      },
      {
        question: "Are AVIF files uploaded?",
        answer: "No. The AVIF to JPG convertor runs in the browser.",
      },
      {
        question: "What if one AVIF fails?",
        answer: "That file is marked. The rest of the batch continues. Some AVIFs need a decoder your browser does not have.",
      },
    ],
    related: ["jpg-to-webp", "webp-to-jpg", "heic-to-jpg"],
  },
  {
    slug: "gif-to-png",
    from: "gif",
    to: "png",
    h1: "GIF to PNG convertor",
    title: "GIF to PNG Convertor in Bulk · Picwise",
    description:
      "Convert GIF to PNG in bulk using the first frame. Transparency can stay. Animation does not. Private browser convertor, no upload.",
    ogTitle: "GIF to PNG convertor in bulk",
    ogDescription: "Export the first frame of each GIF as a PNG. Motion is not preserved.",
    keywords: ["gif to png convertor", "gif to png converter", "gif to png convertor in bulk", "convert gif to png", "gif first frame to png"],
    lede: "A GIF to PNG convertor here takes the first frame and writes a PNG. That is the right tool for a sticker, an icon, or a thumbnail. It is the wrong tool if you need the animation.",
    sections: [
      {
        heading: "The first frame is the picture",
        paragraphs: [
          "An animated GIF contributes its first frame. The loop, the later frames, and the timing are not rebuilt as an animated PNG. If the motion is the point, keep the GIF.",
          "A still GIF, the kind used as a simple graphic, converts straight across. PNG is a sharper home for a flat icon than another pass through GIF’s limited colors, as long as you leave PNG lossless.",
        ],
      },
      {
        heading: "Transparency on icons and stickers",
        paragraphs: [
          "GIF transparency can be kept in the PNG. You do not have to flatten the sticker onto white. Flattening is the JPG path, not this one.",
          "If the GIF is a one-color UI glyph, you can reduce PNG colors afterward. For anything with a gradient or a photo in the first frame, leave the PNG lossless.",
        ],
      },
      {
        heading: "Many GIFs, one zip",
        paragraphs: [
          "Drop a folder of reaction images, emoji, or old banner GIFs when what you need is a still PNG of each. Every file uses the same rule: frame one, PNG, original name.",
          "The GIFs are read locally. They are not uploaded to extract a frame.",
        ],
      },
    ],
    steps: [
      { name: "Open the GIF to PNG convertor", text: "PNG is already selected." },
      { name: "Add the GIFs", text: "Drop the folder. Remember that only the first frame is used." },
      { name: "Keep PNG lossless for photos and gradients", text: "Color reduction is only for flat icons." },
      { name: "Download the PNGs", text: "Save the zip of stills. Keep the original GIFs if you still need them to move." },
    ],
    faqs: [
      {
        question: "Will an animated GIF stay animated?",
        answer: "No. The PNG is the first frame. Keep the GIF if you need the loop.",
      },
      {
        question: "Does GIF transparency survive?",
        answer: "Yes, in the PNG. Clear pixels stay clear. They would be filled only if you converted to JPG.",
      },
      {
        question: "Can I convert a folder of GIFs?",
        answer: "Yes. Each GIF becomes one PNG, and you can download them as a zip.",
      },
      {
        question: "Are the GIFs uploaded?",
        answer: "No. The first frame is read in your browser.",
      },
      {
        question: "Can I turn the PNG back into a GIF later?",
        answer: "You can encode a still GIF from the PNG, but the frames this conversion dropped are gone. The original GIF is the only copy of the animation.",
      },
    ],
    related: ["png-to-webp", "webp-to-png", "png-to-jpg"],
  },
];

const pagesBySlug = new Map(seoPages.map((page) => [page.slug, page]));

export function getSeoPage(slug: string): SeoPage | undefined {
  return pagesBySlug.get(slug);
}

export function conversionMetadata(page: SeoPage): Metadata {
  const path = `/${page.slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: [...page.keywords],
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      url: path,
      type: "article",
      siteName: "Picwise",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description: page.ogDescription,
    },
  };
}

export function conversionJsonLd(page: SeoPage, siteUrl: string) {
  const url = `${siteUrl}/${page.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Picwise", url: siteUrl },
        about: {
          "@type": "WebApplication",
          name: "Picwise",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          url: `${siteUrl}/convertor`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: page.h1, item: url },
        ],
      },
      {
        "@type": "HowTo",
        name: page.h1,
        description: page.description,
        tool: { "@type": "HowToTool", name: "Picwise" },
        step: page.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.name,
          text: step.text,
          url: `${url}#step-${index + 1}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function converterHref(page: SeoPage): string {
  return conversionPath(page.from, page.to);
}
