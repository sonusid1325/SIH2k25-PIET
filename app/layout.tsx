import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nullsafecode - AI-Powered Career & Education Advisor",
  description:
    "Navigate your educational journey with confidence. Get personalized guidance for subject selection, college choices, and career paths tailored specifically for Indian students.",
  keywords:
    "career guidance, education advisor, AI career counseling, college selection, subject combination, government colleges, scholarships, career outcomes",
  authors: [{ name: "nullsafecode Team" }],
  openGraph: {
    title: "nullsafecode - AI-Powered Career & Education Advisor",
    description:
      "Navigate your educational journey with confidence. Get personalized guidance for subject selection, college choices, and career paths tailored specifically for Indian students.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
