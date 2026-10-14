import type { Metadata, Viewport } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { Footer } from "@/components/footer";
import { ServiceWorkerRegister } from "@/components/pwa-register";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — Private image converter and compressor`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Convert and compress PNG, JPG, WebP, AVIF, GIF, BMP, TIFF, SVG, ICO, and HEIC images in your browser. Files never leave your device.",
  applicationName: siteConfig.name,
  keywords: ["image converter", "image compressor", "webp", "avif", "client-side", "privacy"],
  openGraph: {
    title: `${siteConfig.name} — Private image converter and compressor`,
    description: "Batch convert and compress images locally. Nothing is uploaded.",
    type: "website",
    url: "/",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Private image converter and compressor`,
    description: "Batch convert and compress images locally. Nothing is uploaded.",
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/icons/192", sizes: "192x192", type: "image/png" },
      { url: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "l-Eg4FCnrP-PNg8IeCEY_WV7oEQHL4I0Gsm8srj974w",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#101828" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
              Skip to content
            </a>
            <SiteHeader />
            <Analytics /> 
            <SpeedInsights />
            {children}
            <Footer />
            <Toaster />
            <ServiceWorkerRegister />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
