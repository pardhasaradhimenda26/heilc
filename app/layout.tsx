import type { Metadata } from "next";
import "./globals.css";
import { PersonaProvider } from "@/components/features/PersonaContext";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";

export const metadata: Metadata = {
  title: "HEILC — AI & Digital Transformation Agency",
  description:
    "Where Human Intelligence Meets the Future. HEILC builds AI-powered products that prove capability, not just describe it.",
  keywords: ["AI agency", "digital transformation", "machine learning", "enterprise software"],
  openGraph: {
    title: "HEILC — AI & Digital Transformation Agency",
    description: "Where Human Intelligence Meets the Future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="grain">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PersonaProvider>
          <SmoothScroll>
            <LoadingScreen />
            <CustomCursor />
            {children}
          </SmoothScroll>
        </PersonaProvider>
      </body>
    </html>
  );
}
