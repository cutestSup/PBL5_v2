"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Bus, LayoutDashboard, Users, Ticket, BarChart3, Settings, LogOut, Menu, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  isActive?: boolean
}

export function AdminNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = React.useState<string>("")
  const [userEmail, setUserEmail] = React.useState<string>("")
  const [userAvatar, setUserAvatar] = React.useState<string>("")

  // Get user info from localStorage
  React.useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin User"
    const email = localStorage.getItem("userEmail") || "admin@becool.com"
    const avatar = localStorage.getItem("userAvatar") || "/placeholder.svg?height=32&width=32&text=Admin"

    setUserName(name)
    setUserEmail(email)
    setUserAvatar(avatar)
  }, [])

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: pathname === "/admin/dashboard",
    },
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      isActive: pathname === "/admin/users",
    },
    {
      title: "Quản lý chuyến xe",
      href: "/admin/trips",
      icon: <Bus className="h-5 w-5" />,
      isActive: pathname === "/admin/trips",
    },
    {
      title: "Quản lý đặt vé",
      href: "/admin/bookings",
      icon: <Ticket className="h-5 w-5" />,
      isActive: pathname === "/admin/bookings",
    },
    {
      title: "Báo cáo & Thống kê",
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: pathname === "/admin/reports",
    },
    {
      title: "Cài đặt hệ thống",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname === "/admin/settings",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userAvatar")
    router.push("/auth/login")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Bus className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-white">Be Cool Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
              >
                <span className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex text-gray-300 border-gray-700 hover:bg-gray-800"
              onClick={() => router.push("/")}
            >
              <Bus className="mr-2 h-4 w-4" />
              Xem trang chính
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 flex items-center gap-2 text-gray-300 hover:bg-gray-800"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img
                      src={userAvatar || "/placeholder.svg"}
                      alt="Admin Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="hidden md:inline-block">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
                    <img
                      src={userAvatar || "/placeholder.svg"}
                      alt="Admin Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt tài khoản
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-300 hover:bg-gray-800">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-gray-900 border-l border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu quản trị</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            item.isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white",
                          )}
                        >
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.title}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
                          <img
                            src={userAvatar || "/placeholder.svg"}
                            alt="Admin Avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{userName}</p>
                          <p className="text-sm text-gray-400">{userEmail}</p>
                        </div>
                      </div>

                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-gray-300 border-gray-700 hover:bg-gray-800"
                          onClick={() => router.push("/")}
                        >
                          <Bus className="mr-2 h-4 w-4" />
                          Xem trang chính
                        </Button>
                      </SheetClose>

                      <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </Button>
                    </div>
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
