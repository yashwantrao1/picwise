"use client";

import { useEffect } from "react";
import { isInputFormat, isOutputFormat } from "@/lib/utils/formats";
import { hydrateConverter, useConverterStore } from "@/store/converter-store";

export function ApplyPreset({ from, to }: { from: string | null; to: string | null }) {
  const setRouteHint = useConverterStore((state) => state.setRouteHint);
  const updateSettings = useConverterStore((state) => state.updateSettings);

  useEffect(() => {
    let active = true;
    void hydrateConverter().then(() => {
      if (!active) return;
      const input = isInputFormat(from) ? from : null;
      const output = isOutputFormat(to) ? to : null;
      if (input && output) setRouteHint({ from: input, to: output });
      else setRouteHint(null);
      if (output) updateSettings({ outputFormat: output });
    });
    return () => {
      active = false;
    };
  }, [from, to, setRouteHint, updateSettings]);

  return null;
}
