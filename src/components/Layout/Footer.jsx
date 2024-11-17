"use client"

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { version } from "@/../package.json";

const currentYear = new Date().getFullYear();

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-background border-t px-8 py-6 sm:py-4 mt-2 sm:mt-0 flex flex-wrap flex-col sm:flex-row gap-6 sm:gap-6 items-center justify-between text-sm text-muted-foreground">
      <div>
        <Button
          variant="link"
          className={`h-max py-0`}
          {...pathname === "/" ? { disabled: "disabled" } : {}}
        >
          <Link href="/">
            Generate QR
          </Link>
        </Button>
        <Button
          variant="link"
          className="h-max py-0"
          {...pathname === "/scan" ? { disabled: "disabled" } : {}}
        >
          <Link href="/scan">
            Scan QR
          </Link>
        </Button>
      </div>
      <div>
        <p>v{version} | Copyright &copy; 2024 {currentYear > 2024 ? `- ${currentYear}` : ""}</p>
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
  )
}

export default Footer