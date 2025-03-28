"use client";

import Link from "next/link"
import { useSelectedLayoutSegment } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Home, History, CalendarCheck, Hospital, MessageCircleQuestion,ChartNoAxesCombined, FlaskConical, BriefcaseMedical } from 'lucide-react'
import Image from 'next/image'
import Logo from "@/public/Logo.png"
interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface IProps {
  navItems: NavItem[];
  role:string;
}

const iconMap = {
  Home,
  History,
  CalendarCheck,
  Hospital,
  MessageCircleQuestion,
  FlaskConical,
  BriefcaseMedical,
  ChartNoAxesCombined
};



export default function SideNavBar({navItems,role}: IProps) {
  const segment = useSelectedLayoutSegment()
  const t = useTranslations('nav')
  const locale = useLocale()

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-12 sm:h-14 items-center border-b px-2 sm:px-4 lg:h-[60px] lg:px-6">
        <div>
      <Link  href={`/${locale}/${role}`}  className="flex items-center ">
        <Image
          src={Logo}
          alt="Clinic Square Logo"
          width={150}
          height={40}
          className="h-11 w-auto"
        />
      </Link>
    </div>
          
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-xs sm:text-sm font-medium lg:px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = segment === item.href.split('/')[1] || (segment === null && item.href===`${role}`)
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <Link
                  key={item.href}
                  href={`/${locale}/${item.href}`}
                  className={`flex items-center gap-3 rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition-all
                    ${isActive 
                      ? 'bg-teal-400 text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)]' 
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t(`${item.label}`)}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

