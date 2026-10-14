import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="border-primary bg-card focus-visible:ring-ring block size-4 rounded-full border shadow focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        aria-label={props["aria-label"]}
      />
    </SliderPrimitive.Root>
  );
}
