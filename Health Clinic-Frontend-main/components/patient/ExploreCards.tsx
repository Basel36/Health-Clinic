import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import ExplorePharmacies from "@/public/ExplorePharmacies.jpg"
import ExploreLabs from "@/public/ExploreLabs.png"
import { useTranslations } from 'next-intl'

export default function ExploreCards() {
  const t = useTranslations('patient.ExploreCards')

  return (
    <section className="grid md:grid-cols-2 gap-6">
      <Card className="overflow-hidden bg-card">
        <div className="relative h-48">
          <Image
            src={ExplorePharmacies}
            alt="Pharmacy"
            fill
            style={{objectFit: "cover"}}
          />
        </div>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">{t(`Explore_Pharmacies`)}</h2>
          <p className="text-gray-600 mb-4">{t(`Find_medications_and_health_products`)}</p>
          <Link href="/patient/pharmacies" className="
          inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-teal-400 text-primary-foreground hover:bg-teal-400/90">Go to Pharmacies</Link>
        </CardContent>
      </Card>
      <Card className="overflow-hidden bg-card">
        <div className="relative h-48">
          <Image
            src={ExploreLabs}
            alt="Laboratory"
           fill
            style={{objectFit: "cover"}}
          />
        </div>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-2">{t(`Explore_Labs`)}</h2>
          <p className="text-gray-600 mb-4">{t(`Book_lab_tests_and_view_results`)}</p>
          <Link href="/patient/labs" className="
          inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-teal-400 text-primary-foreground hover:bg-teal-400/90">Go to Labs</Link>

        </CardContent>
      </Card>
    </section>
  )
}