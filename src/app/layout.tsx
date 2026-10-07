import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import PWARegister from "@/components/PWARegister";

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "AI Website Builder | Prompt to App",
  description:
    "Sirf ek prompt se poora website banao — AI powered website generator with live preview.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AIWebBuilder",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "AI Website Builder",
    description: "Prompt se website banao instantly",
    siteName: "AI Website Builder",
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    shortcut: "/icons/icon-96x96.svg",
    apple: "/icons/icon-152x152.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="AI Website Builder" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AIWebBuilder" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.svg" />

        {/* Splash screens for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#090a0f] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-purple-500 selection:text-white">
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <PWARegister />
      </body>
    </html>
  );
}
