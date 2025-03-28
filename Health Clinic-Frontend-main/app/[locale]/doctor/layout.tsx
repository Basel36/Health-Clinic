import BlurFade from "@/components/ui/blur-fade"
import TopNavBar from "@/components/TopNavBar"
import SideNavBar from "@/components/SideNavBar"
import { setRequestLocale } from 'next-intl/server'



const navItems = [
  { href: 'doctor', icon: 'Home', label: "Home" },
  { href: 'doctor/reservations-history', icon: 'History', label: "Reservations History" },
  { href: 'doctor/my-schedule', icon: 'CalendarCheck', label: "My Schedule" },
  { href: 'doctor/medical-questions', icon: 'MessageCircleQuestion', label: "Medical Questions" },
  { href: 'doctor/analytics', icon: 'ChartNoAxesCombined', label: "Analytics" },
]

export default function DoctorLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Enable static rendering
  setRequestLocale(locale)


  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <BlurFade delay={0} className="mt-1 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" inView>
          <SideNavBar navItems={navItems} role={"doctor"} />
          <div className="flex flex-col">
            <TopNavBar navItems={navItems}/>
            {children}
          </div>
        </BlurFade>
      </body>
    </html>
  )
}

