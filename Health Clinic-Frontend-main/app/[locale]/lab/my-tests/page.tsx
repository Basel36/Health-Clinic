import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import TestManagement from '@/components/lab/TestManagement'
import { getAvaliableTests, getMyTests } from '@/lib/lab/api'

async function Testsdata({ page }: { page: number }) {
  const {data:myTests} = await getMyTests(10,page);
  const {data:availableTests} = await getAvaliableTests();
  return (
    <TestManagement 
    tests={myTests.data}
      availableTests={availableTests.data}
      currentPage={page}
      totalPages={myTests.paginationResult.numberOfPages}
    />
  )
}

export default function Page({ searchParams }: { searchParams: { page?: string  } }) {
  const page = Number(searchParams.page) || 1;

  
  return (
    <ProtectedRoute allowedRoles={['lab']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <Testsdata page={page}/>
        {/* <TestManagement /> */}
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}