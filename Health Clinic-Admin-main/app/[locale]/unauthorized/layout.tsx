import BlurFade from "@/components/ui/blur-fade"
import { setRequestLocale } from 'next-intl/server'




export default function UnAuthLayout({
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
        <BlurFade delay={0} className="min-h-screen flex items-center justify-center p-4" inView>
            {children}
        </BlurFade>
      </body>
    </html>
  )
}