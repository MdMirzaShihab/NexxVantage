"use client";

import { useEffect, useState } from "react";
import MarkStatic from "@/components/mark/MarkStatic";
import { METHOD_PHASES } from "@/lib/method";

export default function PhaseDiagram() {
  const [active, setActive] = useState<(typeof METHOD_PHASES)[number]["layer"]>("ring");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const layer = (e.target as HTMLElement).dataset.layer as typeof active;
            if (layer) setActive(layer);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    document.querySelectorAll("[data-layer]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <MarkStatic variant="exploded" highlight={active} className="w-40 md:w-48" />;
}
