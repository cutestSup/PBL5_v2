"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Bus, Calendar, LogOut, Menu, Search, Settings, Ticket, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationWidget } from "@/components/notification-widget"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { CTAButton } from "@/components/cta-button"

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Scroll handler
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const mainNav = [
    {
      title: "Tìm chuyến xe",
      href: "/search",
      icon: <Search className="h-4 w-4" />,
      isActive: pathname === "/search",
    },
    {
      title: "Lịch trình",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />,
      isActive: pathname === "/schedule",
    },
    {
      title: "Vé của tôi",
      href: "/tickets",
      icon: <Ticket className="h-4 w-4" />,
      isActive: pathname === "/tickets",
    },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled && "shadow-sm"
      )}
    >
      <nav className="container flex h-16 items-center px-4">
        <Link href="/" className="hidden md:block">
          <div className="flex items-center">
            <img src="/logo_pbl5.png" alt="BeCool Logo" className="h-8 w-auto" />
            <span className="ml-2 text-lg font-bold">Be Cool</span>
          </div>
        </Link>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="px-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-6">
              {mainNav.map((item, index) => (
                <SheetClose key={index} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                      item.isActive && "bg-accent"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-6">
          {mainNav.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                item.isActive && "bg-accent"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <NotificationWidget />
          <ThemeToggle />
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Trang cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Đăng nhập
              </Button>
              <CTAButton onClick={() => router.push("/auth/register")}>
                Đăng ký
              </CTAButton>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

