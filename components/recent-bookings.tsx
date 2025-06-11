import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentBookings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>NT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nguyễn Văn Thành</p>
          <p className="text-sm text-muted-foreground">HCM → Đà Lạt</p>
        </div>
        <div className="ml-auto font-medium">+450,000 VNĐ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>LH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Lê Thị Hương</p>
          <p className="text-sm text-muted-foreground">Hà Nội → Hải Phòng</p>
        </div>
        <div className="ml-auto font-medium">+250,000 VNĐ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>TD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Trần Minh Đức</p>
          <p className="text-sm text-muted-foreground">Đà Nẵng → Huế</p>
        </div>
        <div className="ml-auto font-medium">+180,000 VNĐ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>PL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Phạm Thị Lan</p>
          <p className="text-sm text-muted-foreground">Cần Thơ → HCM</p>
        </div>
        <div className="ml-auto font-medium">+320,000 VNĐ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>VK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Vũ Minh Khang</p>
          <p className="text-sm text-muted-foreground">Nha Trang → HCM</p>
        </div>
        <div className="ml-auto font-medium">+280,000 VNĐ</div>
      </div>
    </div>
  )
}
