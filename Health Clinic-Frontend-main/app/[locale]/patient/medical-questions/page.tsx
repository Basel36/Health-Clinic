

import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import { getQuestions } from '@/lib/api'
import BlurFade from '@/components/ui/blur-fade'
import QuestionsList from '@/components/patient/MedicalQuestions/QuestionsList'

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
    <ProtectedRoute allowedRoles={['patient']}>


      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
     
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <QuestionsData page={page} />
        </Suspense>
      </BlurFade>
    </ProtectedRoute>
  )
}