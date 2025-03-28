import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import { getAvaliableMedicines, getMyMedicines } from '@/lib/pharmacy/api'
import MedicineManagement from '@/components/pharmacy/MedicineManagement'

async function MedicinesData({ page }: { page: number }) {
  const {data:myMedicines} = await getMyMedicines(10,page);
  const {data:availableMedicines} = await getAvaliableMedicines();
  return (
    <MedicineManagement
      medicines={myMedicines.data}
      availableMedicines={availableMedicines.data}
      currentPage={page}
      totalPages={myMedicines.paginationResult.numberOfPages}
    />
  )
}

export default function Page({ searchParams }: { searchParams: { page?: string  } }) {
  const page = Number(searchParams.page) || 1;

  
  return (
    <ProtectedRoute allowedRoles={['pharmacy']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <MedicinesData page={page}/>
        {/* <TestManagement /> */}
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}