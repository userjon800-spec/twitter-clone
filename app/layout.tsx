import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutClient } from "./layout-client";
export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-vite-javohir.vercel.app/"),
  title: "Twitter X - Clone",
  description: "Twitter X is a Twitter clone built by Javohir",
  authors: [
    {
      name: "Javohir Xamdamboyev",
      url: "https://portfolio-vite-javohir.vercel.app/",
    },
  ],
  icons: { icon: "/images/x.svg" },
  openGraph: {
    title: "Twitter X",
    description: "Twitter X is a Twitter clone built by Javohir",
    type: "website",
    url: "https://portfolio-vite-javohir.vercel.app/",
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
        className={`antialiased`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}