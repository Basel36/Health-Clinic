import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import PharmacyDetails from '@/components/patient/Pharmacies/PharmacyDetails'
import { getOnePharmacy, GetPharmacyMedicine } from '@/lib/patient/api'

async function PharmacyDetailsData({id,page}:{id:string,page:number}) {
  const {data:{data:pharmacy}}=await getOnePharmacy(id);
  const PharmacyMedicine=await GetPharmacyMedicine(id,page,8);
  return (
    
          <PharmacyDetails   Pharmacy={pharmacy} Medicines={PharmacyMedicine.data.data} currentPage={PharmacyMedicine.data.paginationResult.currentPage} totalPages={PharmacyMedicine.data.paginationResult.numberOfPages} />
       
  )
}

export default async function PharmacyDetailsPage({ params ,searchParams}: { params: { id: string },searchParams: { medicinePage?: string } }) {
  const page = Number(searchParams.medicinePage) || 1

  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
         <PharmacyDetailsData id={params.id} page={page} />
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}