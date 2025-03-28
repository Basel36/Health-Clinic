import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import { getQuestions } from '@/lib/doctor/api'
import BlurFade from '@/components/ui/blur-fade'
import QuestionsList from '@/components/doctor/QuestionsList'

async function QuestionsData({ page }: { page: number }) {
  const {data:question} = await getQuestions(10,page);
  return (
    <QuestionsList 
      questions={question.data}
      currentPage={page}
      totalPages={question.paginationResult.numberOfPages}
    />
  )
}

export default function Page({ searchParams }: { searchParams: { page?: string  } }) {
  const page = Number(searchParams.page) || 1;

  
  return (
    <ProtectedRoute allowedRoles={['doctor']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <QuestionsData page={page} />
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}