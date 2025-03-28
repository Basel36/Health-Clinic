import BlurFade from "@/components/ui/blur-fade"
import Navbar from '@/components/patient/Navbar'
import Footer from '@/components/patient/Footer'
import { setRequestLocale } from 'next-intl/server'
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default function PatientLayout({
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
        <BlurFade delay={0}   className="flex flex-col min-h-screen "inView>
      <Navbar />
      
        {children}
        {/* <Banner />
        <SearchSection />
        <ExploreCards />
        <HealthServices /> */}
      <Footer />
        </BlurFade>
      </body>
    </html>
  )
}