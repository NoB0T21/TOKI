import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/context/tankstack";  // ← add this

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: "Toki — Capture Time. Share Life.",
  description: "...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <Providers>        {/* ← wraps everything once */}
          {children}
        </Providers>
      </body>
    </html>
  );
}