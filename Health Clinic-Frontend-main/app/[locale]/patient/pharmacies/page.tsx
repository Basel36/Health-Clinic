import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import PharmaciesList from '@/components/patient/Pharmacies/PharmaciesList'
import { getAllPharmacies } from '@/lib/patient/api'

async function PharmaciesData({ page }: { page: number }) {
  const {data:pharmacies} = await getAllPharmacies(10,page);
  return (
   <PharmaciesList
   currentPage={page}
   totalPages={pharmacies.paginationResult.numberOfPages}
   Pharmacies={pharmacies.data}/>
  )
}

export default function Pharmacies({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1

  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          {/* <LabDetails /> */}
          <PharmaciesData  page={page} />
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}