import { Header } from './Header'
import { BottomNavigation } from './BottomNavigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}
