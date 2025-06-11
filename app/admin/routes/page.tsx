"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

const routes = [
  {
    id: 1,
    from: "TP. Hồ Chí Minh",
    to: "Đà Lạt",
    distance: "308 km",
    duration: "6h 30m",
    price: "450,000 VNĐ",
    status: "active",
  },
  {
    id: 2,
    from: "Hà Nội",
    to: "Hải Phòng",
    distance: "120 km",
    duration: "2h 30m",
    price: "250,000 VNĐ",
    status: "active",
  },
  {
    id: 3,
    from: "Đà Nẵng",
    to: "Huế",
    distance: "108 km",
    duration: "2h 15m",
    price: "180,000 VNĐ",
    status: "inactive",
  },
  {
    id: 4,
    from: "Cần Thơ",
    to: "TP. Hồ Chí Minh",
    distance: "169 km",
    duration: "3h 45m",
    price: "320,000 VNĐ",
    status: "active",
  },
  {
    id: 5,
    from: "Nha Trang",
    to: "TP. Hồ Chí Minh",
    distance: "448 km",
    duration: "8h 30m",
    price: "580,000 VNĐ",
    status: "active",
  },
]

export default function RoutesPage() {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý tuyến xe</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tuyến mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách tuyến xe</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm tuyến..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Điểm đi</TableHead>
                  <TableHead>Điểm đến</TableHead>
                  <TableHead>Khoảng cách</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Giá vé</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.id}</TableCell>
                    <TableCell>{route.from}</TableCell>
                    <TableCell>{route.to}</TableCell>
                    <TableCell>{route.distance}</TableCell>
                    <TableCell>{route.duration}</TableCell>
                    <TableCell>{route.price}</TableCell>
                    <TableCell>
                      <Badge variant={route.status === "active" ? "default" : "secondary"}>
                        {route.status === "active" ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
