'use client'

import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, LogOut, Truck } from 'lucide-react'

export default function DashboardAsideNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 px-4 py-6 flex flex-col">
      <div className="flex items-center gap-2 px-2">
        <Truck className="h-6 w-6 text-gray-700" />
        <h1 className="text-lg font-semibold text-gray-900">Transport Solutions</h1>
      </div>

      <div className="mt-8 px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/avatar/user.jpg"
              alt={session?.user.name || 'User avatar'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h2 className="text-sm font-medium text-gray-900">{session?.user.name}</h2>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        <Link
          href="/dashboard/management"
          className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
            pathname === '/dashboard/management'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Car className="h-5 w-5" />
          <span>Vehículos</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 rounded-lg transition-colors hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  )
}