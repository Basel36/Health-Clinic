import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import {getSchedule } from '@/lib/lab/api'
import BlurFade from '@/components/ui/blur-fade'
import Schedule from '@/components/lab/Schedule'

async function ScheduleData() {
  const { data: {data:{schedule}} } = await getSchedule();
  return (
    <Schedule 
      days={schedule.days}
      cost={schedule.cost}
  
    />
  )
}

export default function Page() {
  
  return (
    <ProtectedRoute allowedRoles={['lab']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <ScheduleData  />
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}