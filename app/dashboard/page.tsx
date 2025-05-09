"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap, Calendar, Search } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Student Management System</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/search" className="block">
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Search className="h-6 w-6 text-blue-600" />
                  <span className="ml-2">Search Students</span>
                </div>
              </Card>
            </Link>
            {/* Add more quick action cards here */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Students</h2>
                <p className="text-2xl font-semibold text-gray-900">1,234</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Active Courses</h2>
                <p className="text-2xl font-semibold text-gray-900">42</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Graduates</h2>
                <p className="text-2xl font-semibold text-gray-900">789</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Events</h2>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium">New student registration</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Course schedule updated</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium">New assignment posted</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">15</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Mid-term Examinations</p>
                  <p className="text-xs text-gray-500">May 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">20</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Career Fair</p>
                  <p className="text-xs text-gray-500">May 20, 2024</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">25</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Graduation Ceremony</p>
                  <p className="text-xs text-gray-500">May 25, 2024</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
} 