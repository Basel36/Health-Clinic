import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import { getOrdersHistory } from '@/lib/pharmacy/api'
import OrdersHistoryTable from '@/components/pharmacy/OrderHistoryTable'

async function OrdersData({ page }: { page: number }) {
  const { data: orders } = await getOrdersHistory(7,page);
  console.log(orders)
  return (
    <OrdersHistoryTable 
      orders={orders.data}
      currentPage={page}
      totalPages={orders.paginationResult.numberOfPages}
  
    />
  )
}

export default function OrdersHistory({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1

  return (
    <ProtectedRoute allowedRoles={['pharmacy']}>

      <main className="flex flex-1 flex-col gap-2 p-3 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <OrdersData page={page} />
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}