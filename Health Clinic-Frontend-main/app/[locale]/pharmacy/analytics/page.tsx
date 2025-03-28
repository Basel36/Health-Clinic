import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import { DashboardCharts } from '@/components/ui/dashboard-charts'
import { getOrdersStat } from '@/lib/pharmacy/api'
import YearSelector from '@/components/year-selector'

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


async function StatData({year}:{year:string}) {
  const {data:stats}=await getOrdersStat(50000000,1);
console.log(stats)
  


const Revenues = monthNames.map((key, index) => {
  const found = stats.data.find(st => Number(st._id.month) === index + 1&&st._id.year==parseInt(year));
  return {
      key,
      revenue: found ? found.totalCost : 0
  };
});

const TotalRevnue=stats.data.reduce((sum,obj)=>obj._id.year==parseInt(year)? sum+ obj.totalCost:0,0);


const Reservations = monthNames.map((key, index) => {
  const found = stats.data.find(st => Number(st._id.month) === index + 1&&st._id.year==parseInt(year));
  return {
      key,
      reservations: found ? found.count : 0
  };
});
  return (

  <DashboardCharts chartsData={[Reservations,Revenues,[{pendingActors:TotalRevnue}]]} titles={['Orders',"REM"]} descriptions={[`Jan-Dec`,`Jan-Dec`,["Total_Revenue",`in`]]} role='Pharmacie'  year={parseInt(year)} />

  )
}
export default function PharmacyStats({ searchParams }: { searchParams: { year?: string } }) {
  const year = searchParams.year ||`${new Date().getFullYear()}`
  return (
    <ProtectedRoute allowedRoles={['pharmacy']}>

      <main className="flex flex-1 flex-col gap-2 p-2 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <div className="mb-4 mt-4 sm:mt-0 flex justify-end">

        <YearSelector selectedYear={year} />
        </div>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <StatData year={year} />

        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}