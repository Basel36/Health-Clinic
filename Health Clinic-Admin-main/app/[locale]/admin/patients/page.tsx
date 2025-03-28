import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { ActorsHeader } from '@/components/new/actors-header'
import {  getAllPatientsData } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { ActorsTable } from '@/components/new/actors-table'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import { useTranslations } from 'next-intl'


async function PatientsStats() {
    
  const  {data:allPatients} = await getAllPatientsData(500000,1)
  return (
    <StatisticsCards stats={[
      {title:"Total_Patients",icon:"Users",value:allPatients.data.length,paragragph:"On_The_App"},
      // {title:"Approved Labs",icon:"UserCheck",value:allLabs.data.filter((d) => d.state === true).length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
      // {title:"Pending Labs",icon:"UserPlus",value:allLabs.data.filter((d) => d.state === false).length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
      // {title:"Total Reservations",icon:"UserPlus",value:allReservations.data.length,paragragph:(<p className="text-xs text-muted-foreground">On The App</p>)},
  
  
  
  
  ]} />


  )
}
async function PatientsData({ page }: { page: number }) {
    
  const {data:patients} = await getAllPatientsData(5,page)
  return (
 

   <ActorsTable
   currentPage={page}
   totalPages={patients.paginationResult.numberOfPages}
   Actors={patients.data}
   role='Patient'
   state='true'
   />
  )
}

export default function Page({ searchParams }: { searchParams: { page?: string  } }) {
  const page = Number(searchParams.page) || 1;
  const t = useTranslations('actors')
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>


<main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8 ">
<BlurFade delay={0} className='space-y-6' inView>
<ActorsHeader role='Patient'/>
<PatientsStats />
<Card>
<CardHeader>
<CardTitle>{t(`Patients`)}</CardTitle>
</CardHeader>
<CardContent className="p-0 sm:p-6">
  <Tabs  className="w-full">

     <PatientsData page={page}/>

  </Tabs>
</CardContent>

</Card>
  {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
    <doctorsData page={page} />
  </Suspense>  */}
</BlurFade>
</main>
</ProtectedRoute>
  )
}