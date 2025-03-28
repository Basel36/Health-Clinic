import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { ActorsHeader } from '@/components/new/actors-header'
import { getAllActorData, getAllReservations } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { ActorsTable } from '@/components/new/actors-table'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from 'next-intl'

async function LabsStats() {
  
  const [ {data:AcceptedLabs},{data:PendingLabs},{data:allReservations}] = await Promise.all([
    getAllActorData(500000,1,"lab","true"),
    getAllActorData(500000,1,"lab","false"),
    getAllReservations(50000,1,"lab")
  ])

  return (
    
    <StatisticsCards stats={[
      {title:"Total_Labs",icon:"Microscope",value:(AcceptedLabs.data.length+PendingLabs.data.length),paragragph:"On_The_App"},
      {title:"Approved_Labs",icon:"Microscope",value:AcceptedLabs.data.length,paragragph:"On_The_App"},
      {title:"Pending_Labs",icon:"Microscope",value:PendingLabs.data.length,paragragph:"On_The_App"},
      {title:"Total_Reservations",icon:"UserPlus",value:allReservations.data.length,paragragph:"On_The_App"},
  
  
  
  
  ]} />


  )
}

async function PendingLabsData({ page }: { page: number }) {
  
  const {data:labs}=await getAllActorData(5,page,"lab","false")

  return (
    

   <ActorsTable
   currentPage={page}
   totalPages={labs.paginationResult.numberOfPages}
   Actors={labs.data}
   role='Lab'
   state='false'
   />
  )
}

async function AcceptedLabsData({ page }: { page: number }) {
  
  const {data:labs}=await getAllActorData(5,page,"lab","true")

  return (
    

   <ActorsTable
   currentPage={page}
   totalPages={labs.paginationResult.numberOfPages}
   Actors={labs.data}
   role='Lab'
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
      <ActorsHeader role='Lab'/>
      <LabsStats />
      <Card>
      <CardHeader>
      <CardTitle>{t(`Labs`)}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <Tabs defaultValue="approved" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center  mb-4 p-4 sm:p-0">
            <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="approved">{tTable(`Approved`)}</TabsTrigger>
            <TabsTrigger value="pending">{tTable(`Pending`)}</TabsTrigger>
            </TabsList>
            {/* <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
            /> */}
          </div>
          <TabsContent value="approved">
           <AcceptedLabsData page={Apage}/>
          </TabsContent>
          <TabsContent value="pending">
            <PendingLabsData page={Ppage} />
          </TabsContent>
        </Tabs>
      </CardContent>
     
    </Card>
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <LabsData page={page} />
        </Suspense>  */}
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}