import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import DoctorsList from '@/components/patient/ourDoctors/DoctorsList'
import { getAllDoctors } from '@/lib/patient/api'
import { SearchForActor } from '@/lib/patient/api'

async function DoctorsData({ page,name,specialization,resultsPage }: {resultsPage:number, page: number,name:string,specialization:string }) {
  const {data:doctors} = await getAllDoctors(10,page);
  let searchResults=null
  if(name.length>0&&specialization.length>0){

    const {data} = await SearchForActor(`${name},${specialization}`,'doctor',resultsPage);
    searchResults=data
  }
  else if(name.length>0){

    const {data} = await SearchForActor(`${name}`,'doctor',resultsPage);
    searchResults=data
  }
  else if(specialization.length>0){

    const {data} = await SearchForActor(`${specialization}`,'doctor',resultsPage);
    searchResults=data
  }
  return (
    <DoctorsList
    searchResult={searchResults?{currentPage:resultsPage,totalPages:searchResults.paginationResult.numberOfPages,Doctors:searchResults.data}:searchResults}
    searchParams={{name,spec:specialization}}
    currentPage={page}
    totalPages={doctors.paginationResult.numberOfPages}
    Doctors={doctors.data}/>
   )
}

export default function OurDoctors({ searchParams }: { searchParams: {resultsPage?:string, page?: string,name?:string,specialization?:string } }) {
  const page = Number(searchParams.page) || 1
  const resultsPage = Number(searchParams.resultsPage) || 1
  const name =  searchParams.name|| ''
  const specialization = searchParams.specialization || ''
  return (
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <DoctorsData resultsPage={resultsPage} page={page} name={name} specialization={specialization} />
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}