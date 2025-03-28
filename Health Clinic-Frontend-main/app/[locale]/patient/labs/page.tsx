import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import {  getAllLabs } from '@/lib/patient/api'
import LabsList from '@/components/patient/Labs/LabsList'

async function LabsData({ page }: { page: number }) {
  const {data:labs} = await getAllLabs(10,page);
  console.log(labs)
  return (
   <LabsList
   currentPage={page}
   totalPages={labs.paginationResult.numberOfPages}
   Labs={labs.data}/>
  )
}

export default function OurDoctors({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1

  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          {/* <LabDetails /> */}
          <LabsData  page={page} />
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}