import { Suspense } from 'react'
import { format } from "date-fns"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import { getOrders } from '@/lib/pharmacy/api'
import OrdersTable from '@/components/pharmacy/OrdersTable'


async function ReservationsData({ page }: { page: number }) {

  const { data: orders } = await getOrders(7, page,"pending");
  

  return (
    <OrdersTable 
      orders={orders.data}
      currentPage={page}
      totalPages={orders.paginationResult.numberOfPages}
      
    />
  )
}

export default function PharmacyHomePage({ searchParams }: { searchParams: { page?: string, date?: string } }) {
  const page = Number(searchParams.page) || 1
  const date = searchParams.date 
    ? format(new Date(searchParams.date), 'yyyy-MM-dd') 
    : format(new Date(), 'yyyy-MM-dd')

  return (
    <ProtectedRoute allowedRoles={['pharmacy']}>  
      <BlurFade delay={0} inView>
        <div className="flex flex-1 flex-col gap-2 p-2 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
         
          <Suspense fallback={<Skeleton className="w-full h-[400px]" />}>
            <ReservationsData page={page} date={date} />
          </Suspense>
        </div>
      </BlurFade>
    </ProtectedRoute>
  )
}