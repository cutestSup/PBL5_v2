"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Bus, Calendar, Menu, Search, Ticket } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationWidget } from "@/components/notification-widget"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userAvatar, setUserAvatar] = React.useState<string>("")
  const [userName, setUserName] = React.useState<string>("")
  const [userEmail, setUserEmail] = React.useState<string>("")
  const [userRole, setUserRole] = React.useState<string>("")

  // Check if user is logged in
  React.useEffect(() => {
    // Check login state
    const checkLogin = () => {
      const hasToken = localStorage.getItem("userToken")
      const avatar = localStorage.getItem("userAvatar") || "/placeholder.svg?height=32&width=32&text=BC"
      const name = localStorage.getItem("userName") || "User"
      const email = localStorage.getItem("userEmail") || "user@example.com"
      const role = localStorage.getItem("userRole") || "user"

      setIsLoggedIn(!!hasToken)
      setUserAvatar(avatar)
      setUserName(name)
      setUserEmail(email)
      setUserRole(role)
    }

    checkLogin()

    // Listen for storage events to update UI when localStorage changes
    const handleStorageChange = () => {
      checkLogin()
    }

    window.addEventListener("storage", handleStorageChange)

    // For demo purposes, let's add a way to toggle login state
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "l" && e.ctrlKey) {
        const newState = !isLoggedIn
        setIsLoggedIn(newState)
        if (newState) {
          localStorage.setItem("userToken", "demo-token")
          localStorage.setItem("userRole", "user")
          localStorage.setItem("userName", "Tạ Quang Hữu")
          localStorage.setItem("userEmail", "huutaquang23@gmail.com")
          localStorage.setItem("userAvatar", "/placeholder.svg?height=32&width=32&text=BC")
        } else {
          localStorage.removeItem("userToken")
          localStorage.removeItem("userRole")
          localStorage.removeItem("userName")
          localStorage.removeItem("userEmail")
          localStorage.removeItem("userAvatar")
        }
        checkLogin()
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [isLoggedIn])

  // Change navbar style on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Trang chủ",
      href: "/",
      isActive: pathname === "/",
    },
    {
      title: "Tìm chuyến xe",
      href: "/search",
      icon: <Search className="h-4 w-4 mr-1" />,
      isActive: pathname === "/search",
    },
    {
      title: "Vé của tôi",
      href: "/tickets",
      icon: <Ticket className="h-4 w-4 mr-1" />,
      isActive: pathname === "/tickets",
    },
    {
      title: "Lịch trình",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4 mr-1" />,
      isActive: pathname === "/schedule",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userAvatar")
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-md border-b shadow-sm"
          : "bg-gradient-to-r from-blue-600/70 to-indigo-600/70 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
            <div className="bg-white text-blue-600 p-1.5 rounded-md">
              <Bus className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-white">Be Cool</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/20 hover:text-white hover:scale-105 transform",
                  item.isActive ? "bg-white/20 text-white" : "text-white/90 hover:text-white",
                )}
              >
                <span className="flex items-center">
                  {item.icon}
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <LanguageSwitcher />

            <NotificationWidget />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:scale-110 transition-transform"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden">
                      <img
                        src={userAvatar || "/placeholder.svg"}
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden">
                      <img
                        src={userAvatar || "/placeholder.svg"}
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/tickets")}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    Vé của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    Cài đặt
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push("/admin/dashboard")}
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      >
                        Quản trị hệ thống
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <CTAButton variant="default" size="sm" onClick={() => router.push("/auth/login")}>
                Đăng nhập
              </CTAButton>
            )}

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden hover:scale-105 transition-transform">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:translate-x-1 transform",
                            item.isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          {item.icon}
                          {item.title}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t">
                    {!isLoggedIn && (
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <CTAButton className="w-full" onClick={() => router.push("/auth/login")}>
                            Đăng nhập
                          </CTAButton>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full hover:bg-accent hover:text-accent-foreground"
                            onClick={() => router.push("/auth/register")}
                          >
                            Đăng ký
                          </Button>
                        </SheetClose>
                      </div>
                    )}

                    {isLoggedIn && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                            <img
                              src={userAvatar || "/placeholder.svg"}
                              alt="User Avatar"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{userName}</p>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                          </div>
                        </div>

                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:translate-x-1 transform"
                            onClick={() => router.push("/profile")}
                          >
                            Thông tin cá nhân
                          </Button>
                        </SheetClose>

                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start hover:translate-x-1 transform"
                            onClick={() => router.push("/settings")}
                          >
                            Cài đặt
                          </Button>
                        </SheetClose>

                        <Button variant="destructive" className="w-full mt-4 hover:bg-red-600" onClick={handleLogout}>
                          Đăng xuất
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

