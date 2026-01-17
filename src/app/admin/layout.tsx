import { AuthProvider } from '@/components/providers/AuthProvider'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'web网站管理系统',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
