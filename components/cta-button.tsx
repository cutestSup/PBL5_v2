import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CTAButtonProps extends ButtonProps {
  children: ReactNode
  showArrow?: boolean
  className?: string
}

export function CTAButton({ children, showArrow = true, className, ...props }: CTAButtonProps) {
  return (
    <Button
      className={cn(
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium",
        "transition-all duration-300 hover:scale-105 hover:shadow-md",
        "relative overflow-hidden group",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center">
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
    </Button>
  )
}
