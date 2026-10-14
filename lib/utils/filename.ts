const ILLEGAL = /[\\/:*?"<>|\u0000-\u001f]/g;

function stripExtension(filename: string): string {
  const slash = Math.max(filename.lastIndexOf("/"), filename.lastIndexOf("\\"));
  const base = slash >= 0 ? filename.slice(slash + 1) : filename;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return base;
  return base.slice(0, dot);
}

export function sanitizeToken(value: string): string {
  return value.replace(ILLEGAL, "").trim();
}

export function outputBasename(filename: string): string {
  const stripped = sanitizeToken(stripExtension(filename)).trim();
  return stripped || "image";
}

export function allocateFilename(
  originalName: string,
  extension: string,
  prefix: string,
  suffix: string,
  used: Set<string>,
): string {
  const ext = extension.replace(/^\./, "").toLowerCase() || "bin";
  const root = `${sanitizeToken(prefix)}${outputBasename(originalName)}${sanitizeToken(suffix)}`;
  const safeRoot = root.trim() || "image";
  const claim = (name: string): string => {
    used.add(name.toLowerCase());
    return name;
  };
  const first = `${safeRoot}.${ext}`;
  if (!used.has(first.toLowerCase())) return claim(first);
  let index = 2;
  while (used.has(`${safeRoot}-${index}.${ext}`.toLowerCase())) index += 1;
  return claim(`${safeRoot}-${index}.${ext}`);
}
