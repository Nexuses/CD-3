import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "CouponChrome — Best Coupons & Deals for Online Shopping",
    template: "%s | CouponChrome",
  },
  description:
    "Find verified coupons, promo codes, and deals for Amazon, Flipkart, Myntra, and more. Save money on every purchase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} min-h-screen flex flex-col antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
