"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

interface UserPreferences {
  name: string
  phone: string
  email: string
}

const COOKIE_NAME = "user_preferences"
const COOKIE_EXPIRES = 30 // 30 days

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: "",
    phone: "",
    email: "",
  })

  // Load preferences from cookies when component mounts
  useEffect(() => {
    const savedPreferences = Cookies.get(COOKIE_NAME)
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch (error) {
        console.error("Error parsing user preferences:", error)
      }
    }
  }, [])

  // Save preferences to cookies
  const savePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
    }
    
    // Save to cookies
    Cookies.set(COOKIE_NAME, JSON.stringify(updatedPreferences), {
      expires: COOKIE_EXPIRES,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    
    // Update state
    setPreferences(updatedPreferences)
  }

  return {
    preferences,
    savePreferences,
  }
}
