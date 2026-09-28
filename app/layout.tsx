import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneContext | Native multimodal inference",
  description:
    "A developer demo for reasoning over text, images, and audio in one inference workflow.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
