import Link from 'next/link'
import { ArrowLeft, ArrowRight,ShieldX } from 'lucide-react'
import { cookies } from 'next/headers'; // Import cookies function from Next.js
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Unauthorized() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user'); // Assuming the user info is stored in 'user' cookie

  // Extract the user name if the cookie exists
let user;
  if (userCookie) {
     user = JSON.parse(userCookie.value); // Parse cookie if it's stored as a JSON object
     // Get the name from the user object
  }
  return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Unauthorized Access</CardTitle>
          <CardDescription>
            Please sign in to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild variant="default">
            <Link href="/login">
              Sign In
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/${user.role}`} className="flex items-center gap-2">
         
              <ArrowLeft className="h-4 w-4 rtl:hidden" />
              <ArrowRight className="h-4 w-4 ltr:hidden" />
              Return Home
            </Link>
          </Button>
        </CardContent>
      </Card>
  )
}

