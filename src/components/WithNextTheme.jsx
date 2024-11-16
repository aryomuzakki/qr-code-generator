"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "./ui/sonner";

const WithNextTheme = ({ children }) => {
  const [curTheme, setCurTheme] = useState();
  const { theme } = useTheme()

  useEffect(() => {
    setCurTheme(theme)
  }, [theme])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
      <Toaster
        theme={curTheme}
        visibleToasts={6}
        position="top-center"
        closeButton={true}
        offset="6rem"
        duration={6000}
        toastOptions={{
          classNames: {
            toast: "dark:bg-secondary text-foreground",
            success: "dark:bg-emerald-950 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400",
            closeButton: "border-destructive text-destructive",
            error: "bg-red-50 dark:bg-red-950 text-red-700 border-red-700 dark:text-red-300 dark:border-red-400"
          },
        }}
      />
    </ThemeProvider>
  )
}

export default WithNextTheme