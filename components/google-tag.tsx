import Script from "next/script";

const measurementId = "G-CL0PWG3LXZ";

export function GoogleTag() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="beforeInteractive" />
      <Script id="google-tag" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
