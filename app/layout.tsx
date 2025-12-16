import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RootLayoutClient } from "./layout-client";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://project-javohir.netlify.app/"),
  title: "Twitter X - Clone",
  description: "Twitter X is a Twitter clone built by Javohir",
  authors: [
    {
      name: "Javohir Xamdamboyev",
      url: "https://project-javohir.netlify.app/",
    },
  ],
  icons: { icon: "/images/x.svg" },
  openGraph: {
    title: "Twitter X",
    description: "Twitter X is a Twitter clone built by Javohir",
    type: "website",
    url: "https://project-javohir.netlify.app/",
    locale: "uz_UZ",
    images: "https://media.graphassets.com/3XlUA3OBSjaQcMNFYnVv",
    countryName: "Uzbekistan",
    siteName: "Twitter X - Clone",
    emails: "userjon800@gmail.com",
  },
  keywords:
    "Twitter, Twitter web, twitter clone, twitter web application, Ilon, Ilon Mask, Javohir Xamdamboyev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
// 27:30
