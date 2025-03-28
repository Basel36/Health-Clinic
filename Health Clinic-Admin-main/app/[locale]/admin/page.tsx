import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from '@/components/ui/blur-fade'
import { DashboardCharts } from '@/components/new/dashboard-charts'
import { getAllActorData, getAllActorStats, getAllOrdersStats, getAllPatientsData, getAllReservationsStats, getPatientStats } from '@/lib/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import YearSelector from "@/components/year-selector"
import { useTranslations } from 'next-intl'

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
async function PatientsStatData({year}:{year:string}) {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllPatientsData(500000,1),
    getAllReservationsStats(50000,1,"doctor"),
     getPatientStats(500000,1)
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st => Number(st._id.month) === index + 1 &&st._id.year==parseInt(year) );
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st =>  Number(st._id.month) === index + 1 &&st._id.year==parseInt(year));
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts year={parseInt(year)} chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length}]]} titles={['Patients',"All_Reservations"]} descriptions={[`Jan-Dec`,`Jan-Dec`,["Total_Patients","Patients"]]} role='Patient'/>

  )
}


async function LabsStatData({year}:{year:string}) {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllActorData(500000,1,"lab","false"),
    getAllReservationsStats(50000,1,"lab"),
     getAllActorStats(500000,1,"lab")
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st =>  Number(st._id.month) === index + 1  && st._id.state === true&&st._id.year==parseInt(year));
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st =>  Number(st._id.month) === index + 1 &&st._id.year==parseInt(year));
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts year={parseInt(year)} chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length}]]} titles={['Labs',"All_Reservations"]} descriptions={[`Jan-Dec`,`Jan-Dec`,["Pending_Labs","Labs"]]} role='Lab'/>

  )
}

async function DoctorsStatData({year}:{year:string}) {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllActorData(500000,1,"doctor","false"),
    getAllReservationsStats(50000,1,"doctor"),
     getAllActorStats(500000,1,"doctor")
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st =>Number(st._id.month) === index + 1 &&st._id.year==parseInt(year) && st._id.state === true);
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st => Number(st._id.month) === index + 1 &&st._id.year==parseInt(year));
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts year={parseInt(year)} chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length,}]]} titles={['Doctors',"All_Reservations"]} descriptions={[`Jan-Dec`,`Jan-Dec`,["Pending_Doctors","Doctors"]]} role='Doctor'/>

  )
}


async function PharmaciesStatData({year}:{year:string}) {
  const [ {data:pendingActors},{data:allReservations},{data:stat}] = await Promise.all([
    getAllActorData(500000,1,"pharmacy","false"),
    getAllOrdersStats(50000,1),
     getAllActorStats(500000,1,"pharmacy")
  ])
  

const Actors = monthNames.map((key, index) => {
  const found = stat.data.find(st => Number(st._id.month) === index + 1 && st._id.state === true&&st._id.year==parseInt(year));
  return {
      key,
      actors: found ? found.count : 0
  };
});
const Reservations = monthNames.map((key, index) => {
  const found = allReservations.data.find(st => Number(st._id.month) === index + 1 &&st._id.year==parseInt(year));
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts year={parseInt(year)} chartsData={[Actors,Reservations,[{pendingActors:pendingActors.data.length,}]]} titles={['Pharmacies',"All_Orders"]} descriptions={[`Jan-Dec`,`Jan-Dec`,["Pending_Pharmacies","Pharmacies"]]} role='Pharmacie'/>

  )
}



export default function HomePage({ searchParams }: { searchParams: { year?: string } }) {
  const year = searchParams.year ||`${new Date().getFullYear()}`
   const t = useTranslations('actors')
 
  return (
    <ProtectedRoute allowedRoles={['admin']}>  
     
     <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8 ">
      <BlurFade delay={0} className='space-y-6' inView>
 
        <Tabs defaultValue="Patients" className="w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center space-x-4 mb-6 sm:mb-4 p-4 sm:p-0">

            <TabsList className="grid  grid-cols-1 md:grid-cols-4 mb-20 md:mb-4 md:space-y-0 space-y-2 md:bg-muted bg-transparent mr-0">
              <TabsTrigger className="data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="Patients">{t(`Patients`)}</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="Doctors">{t(`Doctors`)}</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="Labs">{t(`Labs`)}</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground" value="Pharmacies">{t(`Pharmacies`)}</TabsTrigger>
            </TabsList>
            </div>
            <div className="flex justify-end">
              
            <YearSelector selectedYear={year} />
            </div>
            {/* <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
              /> */}
          <TabsContent value="Doctors" >
           <DoctorsStatData year={year} />
          </TabsContent>
          <TabsContent value="Patients">
          <PatientsStatData year={year} />
          </TabsContent>
          <TabsContent value="Labs">
           <LabsStatData  year={year}/>
          </TabsContent>
          <TabsContent value="Pharmacies">
          <PharmaciesStatData year={year} />
          </TabsContent>
        </Tabs>
 
        {/* <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <pharmaciesData page={page} />
        </Suspense>  */}
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}