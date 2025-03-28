import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Syringe, Baby, Activity } from 'lucide-react'
import { useTranslations } from 'next-intl'

const services = [
  { title: "BMI_Calculator", icon: <Calculator className="h-12 w-12" />, href: "/patient/health-services/bmi-calculator" },
  { title: "Period_Calculator", icon: <Syringe className="h-12 w-12" />, href: "/patient/health-services/period-calculator" },
  { title: "Pregnancy_Calculator", icon: <Baby className="h-12 w-12" />, href: "/patient/health-services/pregnancy-calculator" },
  { title: "Calorie_Counter", icon: <Activity className="h-12 w-12" />, href: "/patient/health-services/kcal-calculator" },
]

export default function HealthServices() {
  const t = useTranslations('patient.HealthServices')

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">{t(`title`)}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Link key={index} href={service.href} className="block group">
            <Card className="transition-shadow hover:shadow-md rounded-2xl h-full bg-card">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="text-teal-primary group-hover:text-teal-400 transition-colors">
                  {service.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold group-hover:text-teal-400 transition-colors">
                  {t(`${service.title}.card`)}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}