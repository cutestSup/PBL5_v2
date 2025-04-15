export interface MockUser {
  id: string
  name: string
  email: string
  password: string
  phone: string
  role: "user" | "admin"
  avatar?: string
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Tạ Quang Hữu",
    email: "huutaquang23@gmail.com",
    password: "password123",
    phone: "0935629524",
    role: "user",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tlbz6O42Q2NeW29HWi9kfwRJTV9WTG.png",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@becool.com",
    password: "admin123",
    phone: "0901234567",
    role: "admin",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Y8c1cDr7oBJdVicBVga5U81iYLTja5.png",
  },
  {
    id: "3",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    password: "password123",
    phone: "0912345678",
    role: "user",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tlbz6O42Q2NeW29HWi9kfwRJTV9WTG.png",
  },
  {
    id: "4",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    password: "password123",
    phone: "0923456789",
    role: "user",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tlbz6O42Q2NeW29HWi9kfwRJTV9WTG.png",
  },
]

export function authenticateUser(email: string, password: string): MockUser | null {
  const user = mockUsers.find((user) => user.email === email && user.password === password)

  return user || null
}
