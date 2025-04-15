"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, MapPin, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/date-picker"
import { LocationCombobox } from "@/components/location-combobox"
import SearchResultCard from "@/components/search-result-card"
import { tripService, type Trip, type TripSearchParams } from "@/services/trip-service"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [trips, setTrips] = useState<Trip[]>([])
  const [totalTrips, setTotalTrips] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [searchCriteria, setSearchCriteria] = useState<TripSearchParams>({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
    price_min: 0,
    price_max: 2000000,
    page: 1,
    limit: 10,
  })

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    searchTrips()
  }, [searchCriteria.page])

  useEffect(() => {
    // Khởi tạo tìm kiếm từ URL params
    if (searchParams.get("from") && searchParams.get("to")) {
      searchTrips()
    }
  }, [])

  const searchTrips = async () => {
    setIsLoading(true)
    try {
      const response = await tripService.searchTrips(searchCriteria)
      if (response.success) {
        setTrips(response.data.trips)
        setTotalTrips(response.data.pagination.total)
        setCurrentPage(response.data.pagination.page)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error searching trips:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setSearchCriteria((prev) => ({ ...prev, page: 1 }))
    searchTrips()
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const applyFilters = () => {
    setSearchCriteria((prev) => ({
      ...prev,
      price_min: priceRange[0],
      price_max: priceRange[1],
      page: 1,
    }))
    setIsFilterOpen(false)
    searchTrips()
  }

  const handlePageChange = (page: number) => {
    setSearchCriteria((prev) => ({ ...prev, page }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tìm kiếm chuyến xe</h1>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="from">Điểm đi</Label>
              <div className="relative mt-1">
                <LocationCombobox
                  value={searchCriteria.from || ""}
                  onChange={(value) => setSearchCriteria((prev) => ({ ...prev, from: value }))}
                  placeholder="Chọn điểm đi"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="to">Điểm đến</Label>
              <div className="relative mt-1">
                <LocationCombobox
                  value={searchCriteria.to || ""}
                  onChange={(value) => setSearchCriteria((prev) => ({ ...prev, to: value }))}
                  placeholder="Chọn điểm đến"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Ngày đi</Label>
              <div className="relative mt-1">
                <DatePicker
                  value={searchCriteria.date ? new Date(searchCriteria.date) : undefined}
                  onChange={(date) =>
                    setSearchCriteria((prev) => ({
                      ...prev,
                      date: date ? date.toISOString().split("T")[0] : "",
                    }))
                  }
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full h-10">
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Bộ lọc</h2>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <Filter className="h-5 w-5 mr-2" />
                  {isFilterOpen ? "Đóng" : "Mở"}
                </Button>
              </div>

              <div className={`space-y-6 ${isFilterOpen || "hidden lg:block"}`}>
                <div>
                  <Label className="mb-2 block">Khoảng giá</Label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 2000000]}
                      max={2000000}
                      step={50000}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Loại xe</Label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="limousine"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) =>
                          setSearchCriteria((prev) => ({
                            ...prev,
                            bus_type: e.target.checked ? "Limousine" : undefined,
                          }))
                        }
                      />
                      <label htmlFor="limousine" className="ml-2 text-sm text-gray-700">
                        Limousine
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sleeper"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) =>
                          setSearchCriteria((prev) => ({
                            ...prev,
                            bus_type: e.target.checked ? "Sleeper" : undefined,
                          }))
                        }
                      />
                      <label htmlFor="sleeper" className="ml-2 text-sm text-gray-700">
                        Giường nằm
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="seater"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) =>
                          setSearchCriteria((prev) => ({
                            ...prev,
                            bus_type: e.target.checked ? "Seater" : undefined,
                          }))
                        }
                      />
                      <label htmlFor="seater" className="ml-2 text-sm text-gray-700">
                        Ghế ngồi
                      </label>
                    </div>
                  </div>
                </div>

                <Button onClick={applyFilters} className="w-full">
                  Áp dụng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{isLoading ? "Đang tìm kiếm..." : `Kết quả (${totalTrips})`}</h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trips.length > 0 ? (
            <div className="space-y-4">
              {trips.map((trip) => (
                <SearchResultCard key={trip.id} trip={trip} />
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Không tìm thấy chuyến xe nào phù hợp.</p>
                <p className="text-gray-500 mt-2">Vui lòng thử lại với tiêu chí khác.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
