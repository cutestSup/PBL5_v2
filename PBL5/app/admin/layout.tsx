import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import {AdminNavbar} from "@/components/admin-navbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <AdminNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
