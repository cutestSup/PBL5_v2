"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bus, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { TripSuggestions } from "@/components/trip-suggestions"
import { LocationCombobox } from "@/components/location-combobox"
import { CTAButton } from "@/components/cta-button"
import { ZoomImage } from "@/components/zoom-image"
import { useLocation } from "@/hooks/use-location"
import { useScheduleSearch } from "@/hooks/use-schedules"
import { cn } from "@/lib/utils"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

interface ImageWithFallbackProps extends Omit<React.ComponentProps<typeof ZoomImage>, 'src'> {
  src: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  
  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    const img = new Image()
    img.src = src
    
    img.onload = () => {
      setImgSrc(src)
      setIsLoading(false)
    }
    
    img.onerror = () => {
      setImgSrc("/placeholder.svg")
      setIsLoading(false)
      setIsError(true)
      console.error(`Failed to load image: ${src}`)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <ZoomImage
        {...props}
        src={imgSrc}
        className={cn(
          props.className,
          isLoading && "opacity-0",
          "transition-opacity duration-200"
        )}
      />
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [departure, setDeparture] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")
  const { locations } = useLocation()

  // Popular destinations
  const popularDestinations = [
    { 
      name: "Đà Lạt",
      rating: 4.8,
      description: "Thành phố ngàn hoa",
      reviewCount: 156,
      tripCount: 48,
      image: "https://i.imgur.com/VuPqZ3E.jpg"
    },
    { 
      name: "Nha Trang",
      rating: 4.7,
      description: "Thiên đường biển",
      reviewCount: 142,
      tripCount: 35,
      image: "https://i.imgur.com/9fQD6Nc.jpg"
    },
    { 
      name: "Vũng Tàu",
      rating: 4.5,
      description: "Thành phố biển",
      reviewCount: 128,
      tripCount: 42,
      image: "https://i.imgur.com/kt1yVSl.jpg"
    },
    { 
      name: "Đà Nẵng",
      rating: 4.9,
      description: "Thành phố đáng sống",
      reviewCount: 189,
      tripCount: 56,
      image: "https://i.imgur.com/dHzHeno.jpg"
    }
  ]

  // Handle search
  const handleSearch = () => {
    if (!departure || !destination) {
      alert("Vui lòng chọn điểm đi và điểm đến")
      return
    }

    if (!date) {
      alert("Vui lòng chọn ngày đi")
      return
    }

    if (tripType === "round-trip" && !returnDate) {
      alert("Vui lòng chọn ngày về")
      return
    }

    // Format dates to ISO string
    const dateParam = date ? date.toISOString() : ""
    const returnDateParam = returnDate ? returnDate.toISOString() : ""

    // Redirect to search page with params
    const searchParams = new URLSearchParams({
      from: departure,
      to: destination,
      date: dateParam,
      type: tripType
    })

    if (tripType === "round-trip" && returnDateParam) {
      searchParams.append("returnDate", returnDateParam)
    }

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="relative bg-blue-600 dark:bg-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <ZoomImage
            src="/placeholder.svg?height=800&width=1600&text=Vietnam+Bus+Service"
            alt="Hero Background"
            fill
            className="object-cover opacity-20 dark:opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 whitespace-nowrap">
              Di chuyển dễ dàng khắp Việt Nam
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Tìm kiếm, đặt vé và trải nghiệm hành trình thoải mái với hệ thống đặt vé xe khách{" "}
              <span className="whitespace-nowrap">toàn quốc</span>
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto">
            <Card className="dark:bg-gray-800/60 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Trip type selection */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="one-way"
                      name="trip-type"
                      value="one-way"
                      checked={tripType === "one-way"}
                      onChange={() => setTripType("one-way")}
                      className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded-full"
                    />
                    <label htmlFor="one-way" className="ml-2 block text-gray-700 dark:text-gray-300">
                      Một chiều
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="round-trip"
                      name="trip-type"
                      value="round-trip"
                      checked={tripType === "round-trip"}
                      onChange={() => setTripType("round-trip")}
                      className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded-full"
                    />
                    <label htmlFor="round-trip" className="ml-2 block text-gray-700 dark:text-gray-300">
                      Khứ hồi
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-500 text-xs mb-1">Nơi xuất phát</label>
                    <LocationCombobox 
                      placeholder="Chọn điểm đi" 
                      value={departure} 
                      onChange={setDeparture}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm" 
                    />
                  </div>

                  <div className="flex items-center justify-center mt-6">
                    <button 
                      onClick={() => {
                        const temp = departure;
                        setDeparture(destination);
                        setDestination(temp);
                      }}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-transform hover:scale-110"
                      aria-label="Đổi địa điểm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 17h-7m0 0 3 3m-3-3 3-3M4 7h7m0 0-3 3m3-3L8 4" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-500 text-xs mb-1">Nơi đến</label>
                    <LocationCombobox 
                      placeholder="Chọn điểm đến" 
                      value={destination} 
                      onChange={setDestination}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm" 
                    />
                  </div>

                  <div className="min-w-[200px]">
                    <label className="block text-gray-500 text-xs mb-1">Ngày đi</label>
                    <DatePicker 
                      date={date} 
                      setDate={setDate} 
                      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm" />
                  </div>

                  {tripType === "round-trip" ? (
                    <div className="min-w-[200px]">
                      <label className="block text-gray-500 text-xs mb-1">Ngày về</label>
                      <DatePicker 
                        date={returnDate} 
                        setDate={setReturnDate} 
                        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm" 
                      />
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-center mt-6">
                  <CTAButton 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-8 py-2.5 shadow-lg" 
                    onClick={() => {
                      if (tripType === "round-trip" && returnDate && date) {
                        if (new Date(returnDate) <= new Date(date)) {
                          alert("Ngày về phải sau ngày đi");
                          return;
                        }
                      }
                      handleSearch();
                    }}
                  >
                    Tìm kiếm
                  </CTAButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <section className="mb-12">
            <motion.h2
              className="text-2xl font-bold mb-6 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Điểm đến phổ biến
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {popularDestinations.map((destination, index) => (
                <motion.div key={index} variants={cardVariant}>
                  <Card
                    className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 group"
                    onClick={() => {
                      console.log('Chọn tuyến:', destination.name);
                      setDestination(destination.name.toLowerCase())
                      console.log('Tìm kiếm chuyến xe từ:', departure, 'đến:', destination.name.toLowerCase());
                      // handleSearch()
                    }}
                  >
                    <div className="relative h-48 sm:h-56 md:h-64 group">
                      <ImageWithFallback
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="absolute bottom-0 p-4 text-white">
                          <h3 className="text-lg sm:text-xl font-semibold group-hover:text-yellow-400 transition-colors">
                            {destination.name}
                          </h3>
                          <p className="text-sm sm:text-base opacity-90">{destination.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 fill-current text-yellow-400" />
                            <span>{destination.rating}</span>
                            <span className="text-sm opacity-75">({destination.reviewCount} đánh giá)</span>
                          </div>
                          <div className="text-sm mt-1 opacity-75">
                            <span>{destination.tripCount} chuyến/tuần</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className="mb-12">
            <TripSuggestions />
          </section>

          <section className="mb-12">
            <motion.h2
              className="text-2xl font-bold mb-6 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Tại sao chọn Be Cool?
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={cardVariant}>
                <Card className="dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 dark:text-white">Đa dạng lựa chọn</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Hơn 500 tuyến đường trên toàn quốc với đa dạng loại xe và dịch vụ để bạn lựa chọn.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariant}>
                <Card className="dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 text-green-600 dark:text-green-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2 dark:text-white">Giá cả hợp lý</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Chúng tôi đảm bảo giá vé tốt nhất với nhiều chương trình khuyến mãi hấp dẫn.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariant}>
                <Card className="dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 text-orange-600 dark:text-orange-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2 dark:text-white">An toàn & Tin cậy</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Chúng tôi chỉ hợp tác với các nhà xe uy tín, đảm bảo an toàn cho hành khách.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </section>

          <section>
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Tải ứng dụng Be Cool ngay!</h2>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Đặt vé nhanh chóng, theo dõi lịch trình và nhận thông báo về chuyến đi của bạn mọi lúc, mọi nơi.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <CTAButton className="bg-black hover:bg-gray-800 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                    >
                      <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                      <path
                        fillRule="evenodd"
                        d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                        clipRule="evenodd"
                      />
                      <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                    </svg>
                    App Store
                  </CTAButton>
                  <CTAButton className="bg-black hover:bg-gray-800 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                    >
                      <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                      <path
                        fillRule="evenodd"
                        d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                        clipRule="evenodd"
                      />
                      <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                    </svg>
                    Google Play
                  </CTAButton>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  )
}
