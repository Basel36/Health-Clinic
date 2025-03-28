"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CircleUserRound, LogOut, Menu } from 'lucide-react'
import { ModeToggle } from '../ui/ModeToggle'
import { getUser } from '@/lib/auth'
import LanguageSwitcherIcon from '../LanguageSwitcherIcon'
import { logout } from '@/actions/logout'
import { CartIcon } from '../CartIcon'
import Logo from "@/public/Logo.png"
import { shortName } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useTranslations } from 'next-intl'

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState({})
  const t = useTranslations('nav')
  const pathname = usePathname()
  
  useEffect(() => {
    setUser(getUser());
  }, [])
  
  const menuItems = [
    { href: "/patient", label: "Home" },
    { href: "/patient/our-doctors", label: "Doctors" },
    { href: "/patient/labs", label: "Labs" },
    { href: "/patient/pharmacies", label: "Pharmacies" },
    { href: "/patient/medical-questions", label: "Medical Questions" },
    { href: "/patient/my-activity", label: "My Activity" },
  ]

  const isActive = (href: string) => {
    // For home route, only match exact /en/patient or /ar/patient
    if (href === '/patient') {
      return pathname === '/en/patient' || pathname === '/ar/patient'
    }
    // For other routes, check if the current path includes the full href path
    return pathname.includes(href) && pathname !== '/en/patient' && pathname !== '/ar/patient'
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background shadow-sm">
      <div>
        <Link href="/patient" className="flex items-center">
          <Image
            src={Logo}
            alt="Clinic Square Logo"
            width={150}
            height={40}
            className="h-12 w-auto"
          />
        </Link>
      </div>
      <div className="flex items-center">
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? "text-teal-400"
                  : "text-foreground hover:text-teal-300"
              }`}
            >
              {t(`${item.label}`)}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4">
          <div className="hidden md:flex items-center">
            <CartIcon />
            <LanguageSwitcherIcon />
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full p-0">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={user.profilePic?user.profilePic:""} alt={shortName(user.name?user.name:"patient")} />
                  <AvatarFallback>{shortName(user.name?user.name:"patient")}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div className="flex items-center">
                  <CircleUserRound className="h-4 w-4" />
                  <Link href="/patient/profile" className="px-1">Profile</Link>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form action={logout} className="flex items-center">
                  <LogOut className="h-4 w-4" />                  
                  <Button variant="ghost" className="h-5 px-1" type="submit">
                    Logout
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden rtl:ml-1 ltr:mr-2 ">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4">
              <div className="flex items-center justify-start mt-4">
                <CartIcon />
                <LanguageSwitcherIcon />
                <ModeToggle />
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors px-3 py-2 ${
                    isActive(item.href)
                      ? "text-teal-400"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`${item.label}`)}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

