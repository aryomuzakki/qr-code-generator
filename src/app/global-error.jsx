"use client"

import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WithNextTheme from "@/components/WithNextTheme";
import WithNProgress from "@/components/WithNProgress";
import localFont from "next/font/local";

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

const GlobalErrorPage = ({ error, reset }) => {
  console.log(error);

  return (
    <html>
      <head>
        <title>QR Code Generator | Error Page</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <WithNProgress />
        <WithNextTheme>
          <div className="min-h-dvh flex flex-col relative">
            <main className="flex-grow">
              <div className="p-8">
                <Card className="w-max max-w-full bg-destructive">
                  <CardHeader>
                    <CardTitle className="font-bold text-2xl">Something wrong</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="" onClick={() => reset()}>RESET Page</Button>
                        <p className="text-xs">or</p>
                        <Button onClick={() => window.location.reload()}>RELOAD Page</Button>
                        <p className="text-xs">or</p>
                        <Button onClick={(ev) => window.location.href = "/"}>Go to Home</Button>
                      </div>
                      {process.env.NODE_ENV === "development" && <p className="text-sm text-foreground/80 whitespace-pre-wrap">Global Error Message :<br />{error?.message}</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
            <Footer pkgVer={pkgVer} />
          </div>
        </WithNextTheme>
      </body>
    </html>
  )
}

export default GlobalErrorPage