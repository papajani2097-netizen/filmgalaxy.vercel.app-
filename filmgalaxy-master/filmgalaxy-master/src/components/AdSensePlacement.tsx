"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? "";
const isConfigured =
  /^ca-pub-\d+$/.test(clientId) && /^\d+$/.test(slotId);

export default function AdSensePlacement() {
  const [loadError, setLoadError] = useState(false);

  return (
    <aside
      aria-label="Advertisement"
      className="mt-8 rounded-xl border border-white/10 bg-[#0b0f18] p-5"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
        Advertisement
      </p>
      {isConfigured ? (
        <>
          <ins
            className="adsbygoogle mt-3 block min-h-[100px] w-full overflow-hidden"
            style={{ display: "block" }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script
            id="adsense-script"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
            onReady={() => {
              window.adsbygoogle = window.adsbygoogle || [];
              window.adsbygoogle.push({});
            }}
            onError={() => setLoadError(true)}
          />
          {loadError && (
            <p role="status" className="mt-3 text-xs text-gray-400">
              Advertisement could not load. Movie information and watch links
              remain available.
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-xs leading-5 text-gray-500">
          AdSense is inactive. Configure your approved AdSense client and ad
          slot IDs to enable this placement.
        </p>
      )}
    </aside>
  );
}
