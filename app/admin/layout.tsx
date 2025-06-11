"use client"

import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import { AdminNavbar } from "@/components/admin-navbar"
import { Card } from "@/components/ui/card"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        <AdminNavbar />
        {/* Main content area */}
        <div className="flex-1 pt-16"> {/* pt-16 to account for fixed navbar height */}
          <div className="container mx-auto p-6">
            <Card className="border-none shadow-none bg-transparent">
              {children}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
