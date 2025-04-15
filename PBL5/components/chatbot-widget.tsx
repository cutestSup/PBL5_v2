"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Minimize2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat with a welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      content: "Xin chào! Tôi là trợ lý ảo của Be Cool. Tôi có thể giúp gì cho bạn?",
      sender: "bot" as const,
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])
  }, [])

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)

      // Sample responses
      const responses = [
        "Bạn có thể tìm kiếm chuyến xe bằng cách nhập điểm đi và điểm đến trên trang chủ.",
        "Để đặt vé, bạn chọn chuyến xe phù hợp và làm theo hướng dẫn để hoàn tất thanh toán.",
        "Bạn có thể hủy vé trước 24 giờ để được hoàn tiền 70%.",
        "Chúng tôi có chính sách đổi vé trước 12 giờ khởi hành với phí 30.000đ.",
        "Bạn cần đọc kỹ các điều khoản và điều kiện trước khi đặt vé để tránh những rắc rối không đáng có.",
        "Hiện tại chúng tôi phục vụ hầu hết các tuyến đường chính tại Việt Nam.",
      ]

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] max-h-[80vh] flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Trợ giúp</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-t-lg rounded-bl-lg"
                        : "bg-gray-100 text-gray-800 rounded-t-lg rounded-br-lg"
                    } p-3 shadow-sm`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-t-lg rounded-br-lg p-3 shadow-sm max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex">
              <Input
                type="text"
                placeholder="Nhập tin nhắn của bạn..."
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 mr-2"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          className="bg-blue-600 hover:bg-blue-700 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
