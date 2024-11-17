import localFont from "next/font/local";
import "./globals.css";
import WithNProgress from "@/components/WithNProgress";
import WithNextTheme from "@/components/WithNextTheme";
import Footer from "@/components/Layout/Footer";

const pkgVer = process.env.npm_package_version || (await import("@/../package.json")).version;

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

export const metadata = {
  title: "QR Code Generator",
  description: "Create QR Code Easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="QR Code Generator" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <WithNProgress />
        <WithNextTheme>
          <div className="min-h-dvh flex flex-col relative">
            <main className="flex-grow">
              {children}
            </main>
            <Footer pkgVer={pkgVer} />
          </div>
        </WithNextTheme>
      </body>
    </html>
  );
}
