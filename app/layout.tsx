import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { PAGE_TITLE, TOOL_DESCRIPTION, TOOL_NAME } from "@/lib/brand";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: TOOL_DESCRIPTION,
  applicationName: TOOL_NAME,
  openGraph: {
    title: PAGE_TITLE,
    description: TOOL_DESCRIPTION,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${inter.variable} font-sans bg-bg text-text antialiased min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
