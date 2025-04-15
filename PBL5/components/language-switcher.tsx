"use client"

import * as React from "react"
import { Check, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "vi", name: "Tiếng Việt" },
  { code: "en", name: "English" },
]

export function LanguageSwitcher() {
  const [language, setLanguage] = React.useState("vi")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent border-0">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Chuyển đổi ngôn ngữ</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between"
          >
            {lang.name}
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
