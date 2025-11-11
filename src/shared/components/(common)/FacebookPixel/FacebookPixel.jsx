"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

import { FB_PIXEL_ID, pageview } from "@/utils/facebook-pixel";

const FacebookPixelContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.fbq) {
      // Trigger a page view on route change
      pageview();
    }
  }, [pathname, searchParams]);

  return null;
};

const FacebookPixel = () => {
  if (!FB_PIXEL_ID) return null;

  return (
    <>
      {/* Facebook Pixel Base Code */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
        id="facebook-pixel"
        strategy="afterInteractive"
      />
      {/* End Facebook Pixel Base Code */}

      {/* Facebook Pixel noscript fallback for when JavaScript is disabled */}
      <noscript>
        <img
          alt=""
          height="1"
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          style={{ display: "none" }}
          width="1"
        />
      </noscript>

      {/* Wrap the content that uses useSearchParams in Suspense */}
      <Suspense fallback={null}>
        <FacebookPixelContent />
      </Suspense>
    </>
  );
};

export default FacebookPixel;
