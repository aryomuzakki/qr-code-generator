"use client"

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";

const currentYear = new Date().getFullYear();

const Footer = ({ pkgVer }) => {
  const pathname = usePathname();

  return (
    <footer className="bg-background border-t px-8 py-4 sm:py-2 mt-2 sm:mt-0 flex flex-wrap flex-col sm:flex-row gap-6 sm:gap-6 items-center justify-between text-sm text-muted-foreground">
      <div>
        <Button
          variant="link"
          className={`h-max hover:opacity-75 dark:hover:opacity-100 dark:hover:no-underline dark:text-primary-foreground dark:hover:text-primary ${pathname === "/" ? "pointer-events-none underline" : ""}`}
          asChild
        >
          <Link href="/">
            Generate QR
          </Link>
        </Button>
        <Button
          variant="link"
          className={`h-max hover:opacity-75 dark:hover:opacity-100 dark:hover:no-underline dark:text-primary-foreground dark:hover:text-primary ${pathname === "/scan" ? "pointer-events-none underline" : ""}`}
          asChild
        >
          <Link href="/scan">
            Scan QR
          </Link>
        </Button>
      </div>
      <div>
        <p>v{pkgVer} | Copyright &copy; 2024 {currentYear > 2024 ? `- ${currentYear}` : ""}</p>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <p>
          by
          <Button variant="link" className="hover:opacity-75 dark:hover:opacity-100 dark:hover:no-underline dark:text-primary-foreground dark:hover:text-primary px-1.5 h-max" asChild>
            <a href="https://muzakki.vercel.app" target="_blank">Aryo</a>
          </Button>
        </p>
        <p>|</p>
        <Button variant="link" className="hover:opacity-75 dark:hover:opacity-100 dark:hover:no-underline dark:text-primary-foreground dark:hover:text-primary px-1 h-max [&_svg]:size-5" asChild>
          <a href="https://github.com/aryomuzakki/qr-code-generator">
            <SiGithub />
          </a>
        </Button>
      </div>
    </footer>
  )
}

export default Footer