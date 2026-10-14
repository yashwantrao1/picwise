import { Zip, ZipPassThrough } from "fflate";

export async function zipBlobs(entries: { name: string; blob: Blob }[]): Promise<Blob> {
  const chunks: Uint8Array[] = [];
  await new Promise<void>((resolve, reject) => {
    const zip = new Zip((error, data, final) => {
      if (error) {
        reject(error);
        return;
      }
      if (data.length > 0) chunks.push(data.slice());
      if (final) resolve();
    });
    void (async () => {
      try {
        for (const entry of entries) {
          const file = new ZipPassThrough(entry.name);
          zip.add(file);
          file.push(new Uint8Array(await entry.blob.arrayBuffer()), true);
        }
        zip.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Could not create the ZIP archive"));
      }
    })();
  });
  const parts: BlobPart[] = chunks.map((chunk) => {
    const copy = new Uint8Array(chunk.byteLength);
    copy.set(chunk);
    return copy;
  });
  return new Blob(parts, { type: "application/zip" });
}
