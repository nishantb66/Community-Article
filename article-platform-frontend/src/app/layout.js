import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

// Import Geist and Geist Mono fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the app
export const metadata = {
  title: "SimpleArticle",
  description: "A platform to write, read and share",
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body
        className={`bg-gray-100 text-gray-800 ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className="min-h-screen flex flex-col">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
