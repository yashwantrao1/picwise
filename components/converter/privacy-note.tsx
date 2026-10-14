import { ShieldCheck } from "lucide-react";

export function PrivacyNote() {
  return (
    <p className="text-muted-foreground flex items-start gap-2 text-sm">
      <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
      <span>Your files never leave your device. Conversion, compression, and ZIP creation all happen locally in this browser.</span>
    </p>
  );
}
