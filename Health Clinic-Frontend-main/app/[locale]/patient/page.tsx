import Banner from "@/components/patient/Banner"
import ExploreCards from "@/components/patient/ExploreCards"
import HealthServices from "@/components/patient/HealthServices"
import MedicalQuestionCard from "@/components/patient/MedicalQuestionCard"
import SearchWrapper from "@/components/patient/search-wrapper"
import ProtectedRoute from "@/components/ProtectedRoute"
import BlurFade from "@/components/ui/blur-fade"
import { setRequestLocale } from 'next-intl/server'

export default function PatientPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return (
    <ProtectedRoute allowedRoles={['patient']}>  
      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background text-foreground" inView>
        <Banner />
        <SearchWrapper />
        <ExploreCards />
        <MedicalQuestionCard />
        <HealthServices />
      </BlurFade>
    </ProtectedRoute>
  )
}

