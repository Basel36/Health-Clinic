"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, isAuthorized } from '@/lib/auth'
import Spinner from './Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push('/login')
    } else if (!isAuthorized(user, allowedRoles)) {
      router.push('/unauthorized')
    } else {
      setIsLoading(false)
    }
  }, [router, allowedRoles])

  if (isLoading) {
    return <div className="flex justify-center items-center  my-auto "><Spinner/></div> // Or a loading spinner
  }

  return <>{children}</>
}

export default ProtectedRoute