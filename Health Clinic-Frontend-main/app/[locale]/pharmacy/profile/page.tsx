import { Suspense } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
import { Skeleton } from "@/components/ui/skeleton"
import BlurFade from '@/components/ui/blur-fade'
import UserProfile from '@/components/pharmacy/Profile'
import { cookies } from 'next/headers'; // Import cookies function from Next.js

async function ProfileData() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user'); // Assuming the user info is stored in 'user' cookie
  const  user = JSON.parse(userCookie.value); 
  return (
    <UserProfile 
      profile={user}
  
    />
  )
}

export default function Page() {
  
  return (
    <ProtectedRoute allowedRoles={['pharmacy']}>


      <main className="flex flex-1 flex-col gap-2 p-5 sm:gap-4 sm:p-4 md:gap-8 md:p-8">
      <BlurFade delay={0} inView>
        <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
          <ProfileData  />
        </Suspense>
      </BlurFade>
      </main>
    </ProtectedRoute>
  )
}