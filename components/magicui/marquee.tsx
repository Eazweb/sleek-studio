// components/magicui/marquee.tsx
"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

// Add global styles for the animations
const styles = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-100% - var(--gap))); }
  }
  
  @keyframes marquee-vertical {
    from { transform: translateY(0); }
    to { transform: translateY(calc(-100% - var(--gap))); }
  }
  
  .animate-marquee {
    animation: marquee var(--duration) linear infinite;
  }
  
  .animate-marquee-vertical {
    animation: marquee-vertical var(--duration) linear infinite;
  }
`;

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <>
      <style>{styles}</style>
      <div
        {...props}
        className={cn(
          "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
          },
          className
        )}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                "animate-marquee flex-row": !vertical,
                "animate-marquee-vertical flex-col": vertical,
                "group-hover:[animation-play-state:paused]": pauseOnHover,
                "[animation-direction:reverse]": reverse,
              })}
            >
              {children}
            </div>
          ))}
      </div>
    </>
  );
}