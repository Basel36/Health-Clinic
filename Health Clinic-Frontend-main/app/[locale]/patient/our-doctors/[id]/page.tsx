import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import {  getOneDoctor } from '@/lib/patient/api'
import DoctorDetails from '@/components/patient/ourDoctors/DoctorDetails'


export default async function DoctorDetailsPage({ params }: { params: { locale:string,id: string } }) {
  const {data:{data:doctor}}=await getOneDoctor(params.id);

  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <DoctorDetails  Doctor={doctor} />
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}