import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AnuVarnika Sarees | Twirl in Tradition",
  description: "Handpicked silk, cotton, bridal and designer sarees for every beautiful moment.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="bg-[#FFFDF8]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
