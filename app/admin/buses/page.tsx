"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BusPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý xe</h1>
        <Button>Thêm xe mới</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Biển số xe</TableHead>
              <TableHead>Loại xe</TableHead>
              <TableHead>Số ghế</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>43A-12345</TableCell>
              <TableCell>Giường nằm</TableCell>
              <TableCell>34</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Hoạt động
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
