import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "LIFE.EXE — Life didn't come with a manual.",
  description:
    "LIFE.EXE is an adaptive AI agent that helps you navigate real situations — decisions, conversations, relationships, and everyday dilemmas. Tell it what's going on.",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

const THEME_INIT_SCRIPT = `
try {
  var raw = localStorage.getItem('life-exe-store');
  var theme = 'cosmos';
  if (raw) {
    var parsed = JSON.parse(raw);
    if (parsed && parsed.state && parsed.state.theme) theme = parsed.state.theme;
  }
  document.documentElement.setAttribute('data-theme', theme);
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="cosmos"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <div className="life-scene grain" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
