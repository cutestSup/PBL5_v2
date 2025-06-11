"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SchedulesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý lịch trình</h1>
        <Button>Thêm lịch trình</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tuyến đường</TableHead>
              <TableHead>Xe</TableHead>
              <TableHead>Thời gian đi</TableHead>
              <TableHead>Thời gian đến</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Đà Nẵng - Hà Nội</TableCell>
              <TableCell>43A-12345</TableCell>
              <TableCell>07:00</TableCell>
              <TableCell>23:00</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Đang chạy
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Sửa</Button>
                <Button variant="destructive" size="sm">Xóa</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
