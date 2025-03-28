import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { ActorsHeader } from '@/components/new/actors-header'
import { getAllActorData,  getAllReservations } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { ActorsTable } from '@/components/new/actors-table'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from 'next-intl'

async function DoctorsStats() {
  
  const [ {data:AcceptedDoctors},{data:PendingDoctors},{data:allReservations}] = await Promise.all([
    getAllActorData(500000,1,"doctor","true"),
    getAllActorData(500000,1,"doctor","false"),
    getAllReservations(50000,1,"doctor")
  ])
  return (
    
    <StatisticsCards stats={[
      {title:"Total_Doctors",icon:"Users",value:(AcceptedDoctors.data.length+PendingDoctors.data.length),paragragph:"On_The_App"},
      {title:"Approved_Doctors",icon:"UserCheck",value:AcceptedDoctors.data.length,paragragph:"On_The_App"},
      {title:"Pending_Doctors",icon:"UserPlus",value:PendingDoctors.data.length,paragragph:"On_The_App"},
      {title:"Total_Reservations",icon:"UserPlus",value:allReservations.data.length,paragragph:"On_The_App"},
  
  
  
  
  ]} />


  )
}

async function PendingDoctorsData({ page }: { page: number }) {
  
  const {data:doctors}=await getAllActorData(5,page,"doctor","false")

  return (
    

   <ActorsTable
   currentPage={page}
   totalPages={doctors.paginationResult.numberOfPages}
   Actors={doctors.data}
   role='Doctor'
   state='false'
   />
  )
}

async function AcceptedDoctorsData({ page }: { page: number }) {
  
  const {data:doctors}=await getAllActorData(5,page,"doctor","true")

  return (
    

   <ActorsTable
   currentPage={page}
   totalPages={doctors.paginationResult.numberOfPages}
   Actors={doctors.data}
   role='Doctor'
   state='true'
   />
  )
}

export default function Page({ searchParams }: { searchParams: { Apage?: string,Ppage?: string  } }) {
  const Apage = Number(searchParams.Apage) || 1;
  const Ppage = Number(searchParams.Ppage) || 1;
  const t = useTranslations('actors')
  const tTable = useTranslations('table')

  
  return (
    <ProtectedRoute allowedRoles={['admin']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8 ">
      <BlurFade delay={0} className='space-y-6' inView>
      <ActorsHeader role='Doctor'/>
      <DoctorsStats  />
      <Card>
      <CardHeader>
      <CardTitle>{t(`Doctors`)}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <Tabs defaultValue="approved" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center  mb-4 p-4 sm:p-0">
            <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="approved">{tTable(`Approved`)}</TabsTrigger>
            <TabsTrigger value="pending">{tTable(`Pending`)}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="approved">
           <AcceptedDoctorsData page={Apage}/>
          </TabsContent>
          <TabsContent value="pending">
            <PendingDoctorsData page={Ppage} />
          </TabsContent>
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