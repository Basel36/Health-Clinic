import BlurFade from "@/components/ui/blur-fade"
import TopNavBar from "@/components/TopNavBar"
import SideNavBar from "@/components/SideNavBar"
import { setRequestLocale } from 'next-intl/server'


const navItems = [
  { href: `lab`, icon: 'Home', label: "Home" },
  { href: `lab/reservations-history`, icon: 'History', label: "Reservations History" },
  { href: `lab/my-schedule`, icon: 'CalendarCheck', label: "My Schedule" },
  { href: `lab/my-tests`, icon: 'FlaskConical', label: "My Tests" },
  { href: 'lab/analytics', icon: 'ChartNoAxesCombined', label: "Analytics" },

]

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default function LabLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {

  setRequestLocale(locale)
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <BlurFade delay={0} className="mt-1 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" inView>
          <SideNavBar navItems={navItems} role='lab'/>
          <div className="flex flex-col">
            <TopNavBar navItems={navItems}/>
            {children}
          </div>
        </BlurFade>
      </body>
    </html>
  )
}