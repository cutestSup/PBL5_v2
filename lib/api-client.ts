import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Thêm interceptor để tự động gửi token trong header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken")
    if (token) {
      // Kiểm tra xem token đã có prefix "Bearer " chưa
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`
      config.headers.Authorization = authToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Xử lý lỗi từ API
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Xóa token và chuyển hướng đến trang đăng nhập
      localStorage.removeItem("userToken")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userAvatar")

      // Chỉ chuyển hướng nếu đang ở client-side
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
