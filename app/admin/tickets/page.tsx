"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Download } from "lucide-react"

const tickets = [
  {
    id: "VE001",
    customer: "Nguyễn Văn Thành",
    phone: "0901234567",
    route: "HCM → Đà Lạt",
    date: "2024-01-15",
    time: "08:00",
    seat: "A12",
    price: "450,000 VNĐ",
    status: "confirmed",
  },
  {
    id: "VE002",
    customer: "Lê Thị Hương",
    phone: "0912345678",
    route: "Hà Nội → Hải Phòng",
    date: "2024-01-16",
    time: "14:30",
    seat: "B05",
    price: "250,000 VNĐ",
    status: "pending",
  },
  {
    id: "VE003",
    customer: "Trần Minh Đức",
    phone: "0923456789",
    route: "Đà Nẵng → Huế",
    date: "2024-01-17",
    time: "09:15",
    seat: "C08",
    price: "180,000 VNĐ",
    status: "cancelled",
  },
  {
    id: "VE004",
    customer: "Phạm Thị Lan",
    phone: "0934567890",
    route: "Cần Thơ → HCM",
    date: "2024-01-18",
    time: "16:45",
    seat: "A03",
    price: "320,000 VNĐ",
    status: "confirmed",
  },
]

export default function TicketsPage() {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý vé</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách vé đã đặt</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm vé..." className="pl-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vé</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Tuyến</TableHead>
                  <TableHead>Ngày đi</TableHead>
                  <TableHead>Giờ đi</TableHead>
                  <TableHead>Ghế</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>{ticket.phone}</TableCell>
                    <TableCell>{ticket.route}</TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>{ticket.time}</TableCell>
                    <TableCell>{ticket.seat}</TableCell>
                    <TableCell>{ticket.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "confirmed"
                            ? "default"
                            : ticket.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {ticket.status === "confirmed"
                          ? "Đã xác nhận"
                          : ticket.status === "pending"
                            ? "Chờ xác nhận"
                            : "Đã hủy"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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
