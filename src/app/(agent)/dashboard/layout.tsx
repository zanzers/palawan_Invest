import BottomNav from '@/components/dashboard/BottomNav'
import React from 'react'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-dvh bg-slate-50 pb-28">
        {children}
        <BottomNav />
    </div>
  )
}

