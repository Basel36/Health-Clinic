import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import {  GetLabTests, getOneLab } from '@/lib/patient/api'
import LabDetails from '@/components/patient/Labs/LabDetails'


 async function LabDetailsData({id,page}:{id:string,page:number}) {
  const {data:{data:lab}}=await getOneLab(id);
  const LabTests=await GetLabTests(id,page,8);

  return (
          <LabDetails  Lab={lab} Tests={LabTests.data.data} currentPage={LabTests.data.paginationResult.currentPage} totalPages={LabTests.data.paginationResult.numberOfPages} />
          
  )
}

export default async function LabDetailsPage({ params ,searchParams}: { params: { id: string },searchParams: { testPage?: string } }) {
  const page = Number(searchParams.testPage) || 1


  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
         <LabDetailsData id={params.id} page={page} />          
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}