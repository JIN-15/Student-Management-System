"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (you can implement your own auth logic)
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </main>
  )
}