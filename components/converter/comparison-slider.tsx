"use client";

import { useEffect, useRef, useState } from "react";

interface ComparisonSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonSlider({ before, after, beforeLabel = "Before", afterLabel = "After" }: ComparisonSliderProps) {
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const update = () => setWidth(node.clientWidth);
    const observer = new ResizeObserver(update);
    observer.observe(node);
    const frameId = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-2">
      <div ref={frame} className="bg-muted relative aspect-[4/3] overflow-hidden rounded-lg">
        <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-contain" />
        <div className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white" style={{ width: `${position}%` }}>
          <img
            src={before}
            alt=""
            className="absolute top-0 left-0 h-full max-w-none object-contain"
            style={{ width: width || "100%" }}
          />
        </div>
        <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">{beforeLabel}</span>
        <span className="absolute top-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">{afterLabel}</span>
      </div>
      <label className="text-muted-foreground flex items-center gap-2 text-xs">
        <span className="sr-only">Before and after comparison</span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={position}
          aria-label="Drag to compare before and after"
          className="accent-primary w-full"
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
