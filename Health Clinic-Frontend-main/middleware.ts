import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['en', 'ar']
const publicPages = ['/login', '/signup','/unauthorized']
const loggedInRestrictedPages = ['/login', '/signup']

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
})

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en'
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  const response = intlMiddleware(request)

  const locale = pathname.split('/')[1]
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')

  const userCookie = request.cookies.get('user')

  // Check if user is logged in and trying to access login or signup pages
  if (userCookie && loggedInRestrictedPages.some(page => pathnameWithoutLocale.startsWith(page))) {
    switch (JSON.parse(userCookie.value).role) {
      case 'doctor':
        return NextResponse.redirect(new URL(`/${locale}/doctor`, request.url))
        break;
        case 'lab':
          return NextResponse.redirect(new URL(`/${locale}/lab`, request.url))
        break;
        case 'patient':
          return NextResponse.redirect(new URL(`/${locale}/patient`, request.url))
        break;
        case 'pharmacy':
          return NextResponse.redirect(new URL(`/${locale}/pharmacy`, request.url))
        break;
      default:
        break;
    }
  }

  if (publicPages.some(page => pathnameWithoutLocale.startsWith(page))) {
    return response
  }

  if (!userCookie) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  try {
    const userData = JSON.parse(userCookie.value)
    const roleAccess: { [key: string]: string[] } = {
      doctor: ['/doctor'],
      lab: ['/lab'],
      patient: ['/patient'],
      pharmacy: ['/pharmacy'],
      // Add other roles as needed
    }

    const allowedPaths = roleAccess[userData.role] || []

    if (!allowedPaths.some(allowedPath => pathnameWithoutLocale.startsWith(allowedPath))) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url))
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error)
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}