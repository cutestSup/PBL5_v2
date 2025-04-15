"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Download, Edit, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminUsers() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    isActive: true,
  })

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUsers = [
        {
          id: 1,
          name: "Tạ Quang Hữu",
          email: "huutaquang23@gmail.com",
          phone: "0935629524",
          role: "user",
          isActive: true,
          createdAt: "23/03/2024",
        },
        {
          id: 2,
          name: "Nguyễn Văn A",
          email: "nguyenvana@gmail.com",
          phone: "0901234567",
          role: "user",
          isActive: true,
          createdAt: "15/04/2024",
        },
        {
          id: 3,
          name: "Trần Thị B",
          email: "tranthib@gmail.com",
          phone: "0912345678",
          role: "user",
          isActive: false,
          createdAt: "10/05/2024",
        },
        {
          id: 4,
          name: "Lê Văn C",
          email: "levanc@gmail.com",
          phone: "0923456789",
          role: "user",
          isActive: true,
          createdAt: "05/06/2024",
        },
        {
          id: 5,
          name: "Admin User",
          email: "admin@becool.com",
          phone: "0989876543",
          role: "admin",
          isActive: true,
          createdAt: "01/01/2024",
        },
      ]

      setUsers(mockUsers)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery),
  )

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  // Handle edit user
  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    })
    setShowAddDialog(true)
  }

  // Handle add/edit user submit
  const handleSubmit = () => {
    if (selectedUser) {
      // Edit existing user
      const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, ...formData } : user))
      setUsers(updatedUsers)
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      }
      setUsers([...users, newUser])
    }

    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "user",
      isActive: true,
    })
    setSelectedUser(null)
    setShowAddDialog(false)
  }

  // Handle delete user
  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
      setUsers(updatedUsers)
      setSelectedUser(null)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-muted-foreground">Quản lý tài khoản người dùng trong hệ thống</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedUser(null)
              setFormData({
                name: "",
                email: "",
                phone: "",
                role: "user",
                isActive: true,
              })
              setShowAddDialog(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Tổng cộng {filteredUsers.length} người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border-b last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Người dùng"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <span className="flex items-center text-green-600 dark:text-green-400">
                              <Check className="mr-1 h-4 w-4" /> Hoạt động
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 dark:text-red-400">
                              <X className="mr-1 h-4 w-4" /> Bị khóa
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-lg font-medium">Không tìm thấy người dùng</p>
                          <p className="text-sm text-muted-foreground">
                            Không có người dùng nào phù hợp với tìm kiếm của bạn
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
            <DialogDescription>
              {selectedUser ? "Cập nhật thông tin người dùng trong hệ thống" : "Thêm người dùng mới vào hệ thống"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Người dùng</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isActive">Tài khoản đang hoạt động</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>{selectedUser ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Tên:</span>
                  <span>{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vai trò:</span>
                  <span>{selectedUser.role === "admin" ? "Admin" : "Người dùng"}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
