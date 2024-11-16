import localFont from "next/font/local";
import "./globals.css";
import WithNProgress from "@/components/WithNProgress";
import WithNextTheme from "@/components/WithNextTheme";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";

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

const currentYear = new Date().getFullYear();

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
            <footer className="bg-background border-t px-8 py-6 sm:py-4 mt-2 sm:mt-0 flex flex-wrap flex-col sm:flex-row gap-6 sm:gap-6 items-center justify-between text-sm text-muted-foreground">
              <div>
                <Button variant="link" className="h-max py-0">
                  <Link href="/">
                    Generate QR
                  </Link>
                </Button>
                <Button variant="link" className="h-max py-0">
                  <Link href="/scan">
                    Scan QR
                  </Link>
                </Button>
              </div>
              <div>
                <p>Copyright &copy; 2024 {currentYear > 2024 ? `- ${currentYear}` : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <p>
                  by
                  <Button variant="link" className="px-1.5 py-0 h-max" asChild>
                    <a href="https://muzakki.vercel.app" target="_blank">Aryo</a>
                  </Button>
                </p>
                <p>|</p>
                <Button variant="link" className="px-1 py-0 h-max hover:opacity-75 [&_svg]:size-5" asChild>
                  <a href="https://github.com/aryomuzakki/qr-code-generator">
                    <SiGithub />
                  </a>
                </Button>
              </div>
            </footer>
          </div>
        </WithNextTheme>
      </body>
    </html>
  );
}
