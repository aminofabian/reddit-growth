import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Metadata
export const metadata: Metadata = {
  title: "Reddit Growth || Reddit Account Management",
  description: "Reddit Growth - Reddit Account Management",
};

// Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
