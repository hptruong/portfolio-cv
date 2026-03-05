"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsapSetup";

export default function ScrollTriggerRefresh() {
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
