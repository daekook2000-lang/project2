import { DashboardContent } from '@/app/dashboard/_components/DashboardContent'
import { getFoodLogsByDate } from '@/app/dashboard/_lib/data'
import { requireAuth } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const user = await requireAuth()
    const initialFoodLogs = await getFoodLogsByDate(user.id, new Date())

    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <DashboardContent
            userId={user.id}
            initialFoodLogs={initialFoodLogs}
          />
        </div>
      </div>
    )
  } catch (error) {
    redirect('/login')
  }
}