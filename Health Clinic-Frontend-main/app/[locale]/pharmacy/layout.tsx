import { setRequestLocale } from 'next-intl/server'
import TopNavBar from "@/components/TopNavBar"
import SideNavBar from "@/components/SideNavBar"
import BlurFade from '@/components/ui/blur-fade'

const navItems = [
  { href: `pharmacy`, icon: 'Home', label: "Home" },
  { href: `pharmacy/orders-history`, icon: 'History', label: "Orders History" },
  { href: `pharmacy/my-medicines`, icon: 'BriefcaseMedical', label: "My Medicines" },
  { href: 'pharmacy/analytics', icon: 'ChartNoAxesCombined', label: "Analytics" },

]

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default function PharmacyLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Enable static rendering
  setRequestLocale(locale)

  return (
    <BlurFade className="mt-1 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" inView>
      <SideNavBar navItems={navItems} role='pharmacy'/>
      <div className="flex flex-col">
        <TopNavBar navItems={navItems}/>
        {children}
      </div>
    </BlurFade>
  )
}

