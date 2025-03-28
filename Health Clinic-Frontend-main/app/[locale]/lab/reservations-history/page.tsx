import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import { getReservationsHistory } from '@/lib/lab/api'
import ReservationsHistoryTable from '@/components/lab/ReservationsHisotryTable'
import BlurFade from '@/components/ui/blur-fade'

async function ReservationsData({ page }: { page: number }) {
  const { data: reservations } = await getReservationsHistory(7,page);
  console.log(reservations)
  return (
    <ReservationsHistoryTable 
      reservations={reservations.data}
      currentPage={page}
      totalPages={reservations.paginationResult.numberOfPages}
  
    />
  )
}

export default function ReservationsHistory({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1

  return (
    <ProtectedRoute allowedRoles={['lab']}>

      <main className="flex flex-1 flex-col gap-2 p-2 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <ReservationsData page={page} />
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}