'use server'

import { Logout } from '@/lib/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  await Logout()
  cookies().delete('user')
  cookies().delete('token')
  redirect(`/en/login`)
}