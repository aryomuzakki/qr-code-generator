"use client";

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const [curTheme, setCurTheme] = useState();
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setCurTheme(theme)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <>
            <SunIcon className={`h-[1.2rem] w-[1.2rem] ${curTheme === "light" ? "block" : "hidden"} `} />
            <MoonIcon className={`h-[1.2rem] w-[1.2rem] ${curTheme === "dark" ? "block" : "hidden"} `} />
            <SunMoonIcon className={`h-[1.2rem] w-[1.2rem] ${curTheme === "system" ? "block" : "hidden"} `} />
          </>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
