import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NavbarWrapper from "@/components/navbar-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Bridge - AI-Powered Career & Education Platform",
  description:
    "Bridge the gap between education and career success. Get personalized guidance for subject selection, college choices, and career paths tailored specifically for Indian students.",
  keywords:
    "career guidance, education advisor, AI career counseling, college selection, subject combination, government colleges, scholarships, career outcomes, skill development, career bridge",
  authors: [{ name: "Skill Bridge Team" }],
  openGraph: {
    title: "Skill Bridge - AI-Powered Career & Education Platform",
    description:
      "Bridge the gap between education and career success. Get personalized guidance for subject selection, college choices, and career paths tailored specifically for Indian students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NavbarWrapper />
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
