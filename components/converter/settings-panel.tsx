"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { estimateOutputBytes } from "@/lib/utils/estimate";
import { formatBytes } from "@/lib/utils/bytes";
import {
  FORMAT_LABEL,
  outputSupportsAlpha,
  outputSupportsTargetSize,
  outputUsesQuality,
} from "@/lib/utils/formats";
import { useConverterStore } from "@/store/converter-store";
import type { OutputFormat, ResizeMode } from "@/types";

const OUTPUTS: OutputFormat[] = ["webp", "avif", "jpg", "png", "gif", "bmp", "ico"];

function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

export function SettingsPanel() {
  const settings = useConverterStore((state) => state.settings);
  const updateSettings = useConverterStore((state) => state.updateSettings);
  const resetSettings = useConverterStore((state) => state.resetSettings);
  const files = useConverterStore((state) => state.files);
  const running = useConverterStore((state) => state.running);
  const lossy = outputUsesQuality(settings.outputFormat);
  const showBackground = !outputSupportsAlpha(settings.outputFormat);
  const showColors = settings.outputFormat === "png" || settings.outputFormat === "gif";
  const estimated = files.reduce((total, file) => {
    if (!file.width || !file.height || file.status === "reading") return total;
    return total + estimateOutputBytes({ srcWidth: file.width, srcHeight: file.height, srcBytes: file.size, settings });
  }, 0);

  const autoHeights = files.flatMap((file) => {
    if (!file.width || !file.height || settings.width <= 0) return [];
    const targetWidth = settings.allowUpscale ? settings.width : Math.min(settings.width, file.width);
    return [Math.max(1, Math.round(targetWidth * (file.height / file.width)))];
  });
  const uniqueHeights = [...new Set(autoHeights)];
  const autoHeightLabel = uniqueHeights.length === 1 ? String(uniqueHeights[0]) : "Auto";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Output settings</CardTitle>
        <CardDescription>
          {files.length > 0 ? `Estimated output about ${formatBytes(estimated)} before encoding.` : "Settings apply to the whole batch."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <fieldset disabled={running} className="space-y-5">
          <Field label="Format" htmlFor="output-format">
            <select
              id="output-format"
              className="border-input bg-card focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              value={settings.outputFormat}
              onChange={(event) => updateSettings({ outputFormat: event.target.value as OutputFormat })}
            >
              {OUTPUTS.map((format) => (
                <option key={format} value={format}>
                  {FORMAT_LABEL[format]}
                </option>
              ))}
            </select>
          </Field>

          {lossy && (
            <Field
              label={settings.targetSizeEnabled ? `Max quality ${settings.quality}` : `Quality ${settings.quality}`}
              htmlFor="quality"
              hint={settings.outputFormat === "avif" ? "AVIF is slower, especially on large images." : undefined}
            >
              <Slider
                id="quality"
                aria-label="Quality"
                min={1}
                max={100}
                step={1}
                value={[settings.quality]}
                onValueChange={(value) => updateSettings({ quality: value[0] ?? settings.quality })}
              />
            </Field>
          )}

          {showColors && (
            <div className="space-y-3">
              {settings.outputFormat === "png" && (
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="png-quantize">Palette quantization</Label>
                  <Switch
                    id="png-quantize"
                    checked={settings.pngQuantize}
                    onCheckedChange={(pngQuantize) => updateSettings({ pngQuantize })}
                    aria-label="Palette quantization"
                  />
                </div>
              )}
              {(settings.outputFormat === "gif" || settings.pngQuantize || settings.targetSizeEnabled) && (
                <Field label={`Colors ${settings.pngColors}`} htmlFor="png-colors" hint="Fewer colors make a smaller PNG or GIF. PNG stays lossless when this is off.">
                  <Slider
                    id="png-colors"
                    aria-label="Color count"
                    min={2}
                    max={256}
                    step={1}
                    value={[settings.pngColors]}
                    onValueChange={(value) => updateSettings({ pngColors: value[0] ?? settings.pngColors })}
                  />
                </Field>
              )}
            </div>
          )}

          {showBackground && (
            <Field label="Background" htmlFor="background" hint="JPG and BMP cannot keep transparency.">
              <div className="flex items-center gap-3">
                <input
                  id="background"
                  type="color"
                  value={settings.backgroundColor}
                  aria-label="Background fill color"
                  className="border-input bg-card size-10 cursor-pointer rounded-md border p-1"
                  onChange={(event) => updateSettings({ backgroundColor: event.target.value })}
                />
                <Input
                  aria-label="Background color hex"
                  value={settings.backgroundColor}
                  onChange={(event) => updateSettings({ backgroundColor: event.target.value })}
                />
              </div>
            </Field>
          )}

          <Separator />

          <Field label="Resize" htmlFor="resize-mode">
            <select
              id="resize-mode"
              className="border-input bg-card focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              value={settings.resizeMode}
              onChange={(event) => updateSettings({ resizeMode: event.target.value as ResizeMode })}
            >
              <option value="none">Keep original dimensions</option>
              <option value="dimensions">Width and height</option>
              <option value="percentage">Percentage</option>
            </select>
          </Field>

          {settings.resizeMode === "dimensions" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Width" htmlFor="resize-width">
                <Input
                  id="resize-width"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={settings.width}
                  onChange={(event) => updateSettings({ width: Math.max(1, Number(event.target.value) || 1) })}
                />
              </Field>
              <Field label="Height" htmlFor="resize-height" hint="Calculated from each image's aspect ratio.">
                <Input id="resize-height" value={autoHeightLabel} readOnly aria-readonly="true" className="bg-muted" />
              </Field>
            </div>
          )}

          {settings.resizeMode === "percentage" && (
            <Field label={`Scale ${settings.percentage}%`} htmlFor="scale">
              <Slider
                id="scale"
                aria-label="Scale percentage"
                min={1}
                max={100}
                step={1}
                value={[settings.percentage]}
                onValueChange={(value) => updateSettings({ percentage: value[0] ?? settings.percentage })}
              />
            </Field>
          )}

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="allow-upscale">Allow upscaling</Label>
            <Switch
              id="allow-upscale"
              checked={settings.allowUpscale}
              onCheckedChange={(allowUpscale) => updateSettings({ allowUpscale })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="target-size">Target file size</Label>
            <Switch
              id="target-size"
              checked={settings.targetSizeEnabled}
              onCheckedChange={(targetSizeEnabled) => updateSettings({ targetSizeEnabled })}
            />
          </div>
          {settings.targetSizeEnabled && (
            <Field
              label="Maximum KB"
              htmlFor="target-kb"
              hint={
                outputSupportsTargetSize(settings.outputFormat)
                  ? "Searches quality, or palette size for PNG and GIF, and stays under this limit when it can."
                  : "BMP and ICO have little size control. Resize them if you need a smaller file."
              }
            >
              <Input
                id="target-kb"
                type="number"
                min={1}
                inputMode="numeric"
                value={settings.targetSizeKB}
                onChange={(event) => updateSettings({ targetSizeKB: Math.max(1, Number(event.target.value) || 1) })}
              />
            </Field>
          )}

          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="strip-exif">Strip metadata</Label>
              <p className="text-muted-foreground mt-1 text-xs">Orientation is applied first. JPEG metadata can be kept only when the output is also JPEG.</p>
            </div>
            <Switch id="strip-exif" checked={settings.stripExif} onCheckedChange={(stripExif) => updateSettings({ stripExif })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prefix" htmlFor="prefix">
              <Input
                id="prefix"
                value={settings.filenamePrefix}
                maxLength={40}
                onChange={(event) => updateSettings({ filenamePrefix: event.target.value })}
              />
            </Field>
            <Field label="Suffix" htmlFor="suffix">
              <Input
                id="suffix"
                value={settings.filenameSuffix}
                maxLength={40}
                onChange={(event) => updateSettings({ filenameSuffix: event.target.value })}
              />
            </Field>
          </div>
        </fieldset>
        <Button variant="ghost" className="w-full" onClick={resetSettings} disabled={running}>
          Reset settings
        </Button>
      </CardContent>
    </Card>
  );
}
