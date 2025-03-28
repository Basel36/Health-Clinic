import { Accounts } from '@/schema/Essentials'
import Cookies from 'js-cookie'



export const getUser = (): Accounts | null => {
  const userCookie = Cookies.get('user')
  return userCookie ? JSON.parse(userCookie) : null
}

export const getToken = (): string | null => {
  const userToekn = Cookies.get('token')
  return userToekn ? JSON.parse(userToekn) : null
}

export const setUser = (user: Accounts,token: string) => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 }) // Expires in 7 days
  Cookies.set('token', JSON.stringify(token), { expires: 7 }) // Expires in 7 days
}


export const removeUser = () => {
  Cookies.remove('user');
  Cookies.remove('token');
}

export const isAuthorized = (user: Accounts | null, allowedRoles: string[]): boolean => {
  return user !== null && allowedRoles.includes(user.role)
}