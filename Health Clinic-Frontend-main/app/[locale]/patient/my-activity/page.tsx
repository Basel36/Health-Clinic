import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import {  getMyDoctorsResrvations, getMyLabsResrvations, getMyPharmaciesResrvations } from '@/lib/patient/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DoctorAppointments from '@/components/patient/MyActivity/DoctorsAppointments'
import LabAppointments from '@/components/patient/MyActivity/LabAppointments'
import PharmacyOrders from '@/components/patient/MyActivity/PharmacyOrders'
import { useTranslations } from 'next-intl'

type activeTabOptions= "doctors"|"labs"|"pharmacies";

async function MyDoctorsResrvations({ page }: { page: number }) {
  const {data:doctors} = await getMyDoctorsResrvations(5,page);
  return (
   <DoctorAppointments
   currentPage={page}
   totalPages={doctors.paginationResult.numberOfPages}
   appointments={doctors.data}/>
  )
}


async function MyLabsResrvations({ page }: { page: number }) {
  const {data:labs} = await getMyLabsResrvations(5,page);
  return (
   <LabAppointments
   currentPage={page}
   totalPages={labs.paginationResult.numberOfPages}
   appointments={labs.data}/>
  )
}


async function MyPharmaciesResrvations({ page }: { page: number }) {
  const {data:pharmacies} = await getMyPharmaciesResrvations(5,page);
  return (
   <PharmacyOrders
   currentPage={page}
   totalPages={pharmacies.paginationResult.numberOfPages}
   orders={pharmacies.data}/>
  )
}


export default function MyActivityPage({ searchParams }: {searchParams:{doctorsPage?: string,labsPage?: string,pharmaciesPage?: string,activeTab?: activeTabOptions}}) {
  const doctorsPage = Number(searchParams.doctorsPage) || 1;
  const labsPage = Number(searchParams.labsPage) || 1;
  const pharmaciesPage = Number(searchParams.pharmaciesPage) || 1;
  const activeTab = searchParams.activeTab || "doctors";
  const t = useTranslations('patient.my_activity')


  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
      <main    className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" >
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t(`My_Medical_Activities`)}</h1>
      <Tabs defaultValue={activeTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 md:mb-5 mb-24 md:space-y-0 space-y-2 md:bg-muted bg-transparent ">
          <TabsTrigger className=" data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="doctors">{t(`Doctor_Appointments`)}</TabsTrigger>
          <TabsTrigger className=" data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="labs">{t(`Lab_Appointments`)}</TabsTrigger>
          <TabsTrigger  className=" data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="pharmacies">{t(`Pharmacy_Orders`)}</TabsTrigger>
        </TabsList>
        <TabsContent value="doctors">
      <MyDoctorsResrvations page={doctorsPage} />
        </TabsContent>
        <TabsContent value="labs">
      <MyLabsResrvations page={labsPage} />
      
        </TabsContent>
        <TabsContent value="pharmacies">
      <MyPharmaciesResrvations page={pharmaciesPage} />
        </TabsContent>
      </Tabs>
    </div>
    </main>
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <DoctorsData  page={page} activeTab={activeTab}/>
        </Suspense> */}
      </BlurFade>
    </ProtectedRoute>
  )
}