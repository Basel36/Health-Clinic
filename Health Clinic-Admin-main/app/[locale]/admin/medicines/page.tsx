import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import {  getAllOrders, getAllProductData } from '@/lib/api'
import { StatisticsCards } from '@/components/new/statistics-cards'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductsTable } from '@/components/new/products-table'
import { ProductsHeader } from '@/components/new/products-header'
import { useTranslations } from 'next-intl'

async function MedicinesStats() {
  
  const [ {data:AcceptedMedicines},{data:PendingMedicines}
    // ,{data:allOrders}
  ] = await Promise.all([
    getAllProductData(500000,1,"medicines","true"),
    getAllProductData(500000,1,"medicines","false"),
    // getAllOrders(50000,1)
  ])
  return (
    
    <StatisticsCards stats={[
      {title:"Total_Medicines",icon:"Pill",value:(AcceptedMedicines.data.length+PendingMedicines.data.length),paragragph:"On_The_App"},
      {title:"Approved_Medicines",icon:"Pill",value:AcceptedMedicines.data.length,paragragph:"On_The_App"},
      {title:"Pending_Medicines",icon:"Pill",value:PendingMedicines.data.length,paragragph:"On_The_App"},
      // {title:"Total Orders",icon:"UserPlus",value:allOrders.data.length,paragragph:"On_The_App"},
  
  
  
  
  ]} />


  )
}

async function PendingMedicinesData({ page }: { page: number }) {
  
  const {data:medicines}=await getAllProductData(5,page,"medicines","false")

  return (
    
    <ProductsTable
    currentPage={page}
    totalPages={medicines.paginationResult.numberOfPages}
    Products={medicines.data}
    type='Medicine'
    state='false'
    />
  )
}

async function AcceptedMedicinesData({ page }: { page: number }) {
  
  const {data:medicines}=await getAllProductData(5,page,"medicines","true")


  console.log("asds",medicines.data)
  return (
    

   <ProductsTable
   currentPage={page}
   totalPages={medicines.paginationResult.numberOfPages}
   Products={medicines.data}
   type='Medicine'
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
      <ProductsHeader type='Medicine'/>
      <MedicinesStats />
      <Card>
      <CardHeader>
      <CardTitle>{t(`Medicines`)}</CardTitle>

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
           <AcceptedMedicinesData page={Apage}/>
          </TabsContent>
          <TabsContent value="pending">
            <PendingMedicinesData page={Ppage} />
          </TabsContent>
        </Tabs>
      </CardContent>
     
    </Card>
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <medicinesData page={page} />
        </Suspense>  */}
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}