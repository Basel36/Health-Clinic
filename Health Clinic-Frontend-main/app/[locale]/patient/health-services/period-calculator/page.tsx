import PeriodCalculator from "@/components/patient/HealthServices/PeriodCalculator";
import ProtectedRoute from "@/components/ProtectedRoute";
import BlurFade from "@/components/ui/blur-fade";


export default function PatientPage() {
  
  return (
    <ProtectedRoute allowedRoles={['patient']}>  
      <BlurFade delay={0} className="flex-grow p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full bg-background  text-foreground" inView>
    
      
      <PeriodCalculator />
      </BlurFade>
    </ProtectedRoute>
  )
}