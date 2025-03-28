import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { ActorsHeader } from '@/components/new/actors-header'
import { getAllActorData,  getAllOrders } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { ActorsTable } from '@/components/new/actors-table'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from 'next-intl'

async function PharmaciesStats() {
  
  const [ {data:AcceptedPharmacies},{data:PendingPharmacies},{data:allReservations}] = await Promise.all([
    getAllActorData(500000,1,"pharmacy","true"),
    getAllActorData(500000,1,"pharmacy","false"),
    getAllOrders(50000,1)
  ])
  return (
    
    <StatisticsCards stats={[
      {title:"Total_Pharmacies",icon:"Hospital",value:(AcceptedPharmacies.data.length+PendingPharmacies.data.length),paragragph:"On_The_App"},
      {title:"Approved_Pharmacies",icon:"Hospital",value:AcceptedPharmacies.data.length,paragragph:"On_The_App"},
      {title:"Pending_Pharmacies",icon:"Hospital",value:PendingPharmacies.data.length,paragragph:"On_The_App"},
      {title:"Total_Orders",icon:"UserPlus",value:allReservations.data.length,paragragph:"On_The_App"},
  
  
  
  
  ]} />


  )
}

async function PendingPharmaciesData({ page }: { page: number }) {
  
  const {data:pharmacies}=await getAllActorData(5,page,"pharmacy","false")

  return (
    

   <ActorsTable
   currentPage={page}
   totalPages={pharmacies.paginationResult.numberOfPages}
   Actors={pharmacies.data}
   role='Pharmacie'
   state='false'
   />
  )
}

async function AcceptedPharmaciesData({ page }: { page: number }) {
  
  const {data:pharmacies}=await getAllActorData(5,page,"pharmacy","true")

  return (
    

   <ActorsTable
   currentPage={page}
   totalPages={pharmacies.paginationResult.numberOfPages}
   Actors={pharmacies.data}
   role='Pharmacie'
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
      <ActorsHeader role='Pharmacie'/>
      <PharmaciesStats />
      <Card>
      <CardHeader>
        <CardTitle>{t(`Pharmacies`)}</CardTitle>
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
           <AcceptedPharmaciesData page={Apage}/>
          </TabsContent>
          <TabsContent value="pending">
            <PendingPharmaciesData page={Ppage} />
          </TabsContent>
        </Tabs>
      </CardContent>
     
    </Card>
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <pharmaciesData page={page} />
        </Suspense>  */}
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}