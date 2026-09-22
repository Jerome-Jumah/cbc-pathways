"use client";

import Script from "next/script";
import type { UmamiConfig } from "@/lib/config";
import { markUmamiFailed, markUmamiReady } from "@/lib/analytics";

export function UmamiScript({ config }: { config: UmamiConfig }) {
  if (!config.enabled) return null;

  return (
    <Script
      src={config.scriptUrl}
      data-website-id={config.websiteId}
      strategy="afterInteractive"
      onLoad={markUmamiReady}
      onError={markUmamiFailed}
    />
  );
}
