import QuestionDetail from '@/components/doctor/QuestionDetail'
import ProtectedRoute from '@/components/ProtectedRoute'
import BlurFade from '@/components/ui/blur-fade'
import { Skeleton } from '@/components/ui/skeleton'
import { getOneQuestion } from '@/lib/doctor/api'
import { Suspense } from 'react'

 
export default async function Page({ params }: { params: { locale:string,id: string } }) {
  const question=await getOneQuestion(params.id);

  return (
      <ProtectedRoute allowedRoles={['doctor']}>
  
  
        <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
        <BlurFade delay={0} inView>
          <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
            <QuestionDetail question={question.data.data} />
          </Suspense>
        </BlurFade>
        </main>
      </ProtectedRoute>
  )
  // ...
}