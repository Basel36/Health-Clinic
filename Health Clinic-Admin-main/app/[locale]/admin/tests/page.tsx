import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import {  getAllProductData, getAllReservations } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsTable } from '@/components/new/products-table'
import { ProductsHeader } from '@/components/new/products-header'
import { useTranslations } from 'next-intl'

async function TestsStats() {
  
  const [ {data:AcceptedTests},{data:tests}] = await Promise.all([
    getAllProductData(500000,1,"tests","true"),
    getAllProductData(500000,1,"tests","false"),
    // getAllReservations(50000,1,"lab")
  ])
  return (
    
    <StatisticsCards stats={[
      {title:"Total_Tests",icon:"FlaskConical",value:(AcceptedTests.data.length+tests.data.length),paragragph:"On_The_App"},
      {title:"Approved_Tests",icon:"FlaskConical",value:AcceptedTests.data.length,paragragph:"On_The_App"},
      {title:"Pending_Tests",icon:"FlaskConical",value:tests.data.length,paragragph:"On_The_App"},
      // {title:"Total Reservations",icon:"UserPlus",value:allReservations.data.length,paragragph:"On_The_App"},
  
  
  
  
  ]} />


  )
}

async function PendingTestTData({ page }: { page: number }) {
  
  const {data:tests}=await getAllProductData(5,page,"tests","false")

  console.log("asds",tests.data)
  return (
    
    <ProductsTable
    currentPage={page}
    totalPages={tests.paginationResult.numberOfPages}
    Products={tests.data}
    type='Test'
    state='false'
    />
  )
}

async function AcceptedTestTData({ page }: { page: number }) {
  
  const {data:tests}=await getAllProductData(5,page,"tests","true")


  console.log("asds",tests.data)
  return (
    

   <ProductsTable
   currentPage={page}
   totalPages={tests.paginationResult.numberOfPages}
   Products={tests.data}
   type='Test'
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
      <ProductsHeader type='Test'/>
      <TestsStats />
      <Card>
      <CardHeader>
      <CardTitle>{t(`Tests`)}</CardTitle>
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
           <AcceptedTestTData page={Apage}/>
          </TabsContent>
          <TabsContent value="pending">
            <PendingTestTData page={Ppage} />
          </TabsContent>
        </Tabs>
      </CardContent>
     
    </Card>
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <testsData page={page} />
        </Suspense>  */}
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}