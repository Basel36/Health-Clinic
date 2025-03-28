"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { UseModel } from '@/lib/patient/clientApi'
import { Doctors_Specializations } from '@/schema/Essentials'
import { useTranslations } from 'next-intl'

interface SearchSectionProps {
  onAnalyzing: (analyzing: boolean) => void
}

const allSymptoms = ['itching', 'skin rash', 'nodal skin eruptions', 'dischromic patches', 'continuous sneezing', 'shivering', 'chills', 'watering from eyes', 'stomach pain', 'acidity', 'ulcers on tongue', 'vomiting', 'cough', 'chest pain', 'yellowish skin', 'nausea', 'loss of appetite', 'abdominal pain', 'yellowing of eyes', 'burning micturition', 'spotting urination', 'passage of gases', 'internal itching', 'indigestion', 'muscle wasting', 'patches in throat', 'high fever', 'extra marital contacts', 'fatigue', 'weight loss', 'restlessness', 'lethargy', 'irregular sugar level', 'blurred and distorted vision', 'obesity', 'excessive hunger', 'increased appetite', 'polyuria', 'sunken eyes', 'dehydration', 'diarrhoea', 'breathlessness', 'family history', 'mucoid sputum', 'headache', 'dizziness', 'loss of balance', 'lack of concentration', 'stiff neck', 'depression', 'irritability', 'visual disturbances', 'back pain', 'weakness in limbs', 'neck pain', 'weakness of one body side', 'altered sensorium', 'dark urine', 'sweating', 'muscle pain', 'mild fever', 'swelled lymph nodes', 'malaise', 'red spots over body', 'joint pain', 'pain behind the eyes', 'constipation', 'toxic look (typhos)', 'belly pain', 'yellow urine', 'receiving blood transfusion', 'receiving unsterile injections', 'coma', 'stomach bleeding', 'acute liver failure', 'swelling of stomach', 'distention of abdomen', 'history of alcohol consumption', 'fluid overload', 'phlegm', 'blood in sputum', 'throat irritation', 'redness of eyes', 'sinus pressure', 'runny nose', 'congestion', 'loss of smell', 'fast heart rate', 'rusty sputum', 'pain during bowel movements', 'pain in anal region', 'bloody stool', 'irritation in anus', 'cramps', 'bruising', 'swollen legs', 'swollen blood vessels', 'prominent veins on calf', 'weight gain', 'cold hands and feets', 'mood swings', 'puffy face and eyes', 'enlarged thyroid', 'brittle nails', 'swollen extremeties', 'abnormal menstruation', 'muscle weakness', 'anxiety', 'slurred speech', 'palpitations', 'drying and tingling lips', 'knee pain', 'hip joint pain', 'swelling joints', 'painful walking', 'movement stiffness', 'spinning movements', 'unsteadiness', 'pus filled pimples', 'blackheads', 'scurring', 'bladder discomfort', 'foul smell of urine', 'continuous feel of urine', 'skin peeling', 'silver like dusting', 'small dents in nails', 'inflammatory nails', 'blister', 'red sore around nose', 'yellow crust ooze']


export default function SearchSection({ onAnalyzing }: SearchSectionProps) {
  const [symptomFilter, setSymptomFilter] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [specialization, setSpecialization] = useState('')
  const router = useRouter()
  const t = useTranslations('patient.search')
  const tspec = useTranslations('Specializations')

  const filteredSymptoms = allSymptoms.filter(symptom => 
    symptom.toLowerCase().includes(symptomFilter.toLowerCase())
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if(searchTerm.trim().length>0 && specialization.length>0){
      router.push(`patient/our-doctors?name=${searchTerm}&specialization=${specialization}`)
    }
    else if(searchTerm.trim().length>0){
      router.push(`patient/our-doctors?name=${searchTerm}`)
    }
    else if(specialization.length>0){
      router.push(`patient/our-doctors?specialization=${specialization}`)
    }
  }

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }
  
  const DetectSpecialization = async() => {
    if(selectedSymptoms.length > 0){
      onAnalyzing(true)
      const symptoms=selectedSymptoms.map((s:string)=>s.replaceAll(" ","_"))
      console.log(symptoms)
          const res = await UseModel({symptoms})
            if (res.success === true) {
              console.log(res.data)
      router.push(`patient/our-doctors?specialization=${res.data.doctor_specialist}`)

            } else {
              res.message.forEach((err: string) => 
                toast.error(err || 'An unexpected error occurred.', {
                  duration: 2000,
                  position: 'bottom-center',
                })
              )
            }
      // setTimeout(() => {
      //   console.log(selectedSymptoms)
      //   onAnalyzing(false)
      // }, 10000)
      onAnalyzing(false)
    }
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom))
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-card shadow-xl rounded-3xl border border-border">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <Tabs defaultValue="name" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-8 md:mb-4 bg-transparent md:space-y-0 space-y-1 md:bg-muted p-0">
              <TabsTrigger value="name" className="text-xs sm:text-sm md:text-base lg:text-lg h-full   data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground">
                {t(`Search_for_Doctor`)}
              </TabsTrigger>
              <TabsTrigger value="symptoms" className="text-xs sm:text-sm md:text-base lg:text-lg h-full data-[state=active]:bg-teal-400 data-[state=active]:text-primary-foreground">
                {t(`Search_by_Symptoms`)}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="name" className="space-y-4">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:space-y-0 gap-4 items-center space-y-2">
                <Input 
                  placeholder={t(`Enter_Doctor_Name`)}
                  className="flex-grow text-base py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger className="w-full text-sm py-2">
                    <SelectValue placeholder={t(`Select_Specialization`)} />
                  </SelectTrigger>
                  <SelectContent>
                       {Doctors_Specializations.map(spec => (
                    
                                        <SelectItem  key={spec} value={`${spec}`}>{tspec(`${spec}`)}</SelectItem>
                                        ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm" className="w-full">
                  <Search className="ltr:mr-2 rtl:ml-1 h-4 w-4 sm:h-5 sm:w-5" /> {t(`Search_for_Doctor_button`)}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="symptoms" className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0">
                <Input
                  placeholder={t(`Filter_Symptoms`)}
                  value={symptomFilter}
                  onChange={(e) => setSymptomFilter(e.target.value)}
                  className="text-sm sm:text-base md:text-lg py-2"
                />
                <Button onClick={DetectSpecialization} className="w-full sm:w-auto">
                  <Search className="mr-ltr:mr-2 rtl:ml-1 h-4 w-4" /> {t(`Search_by_Symptoms_button`)}
                </Button>
              </div>
              {selectedSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSymptoms.map((symptom) => (
                    <Badge key={symptom} variant="secondary" className="px-2 py-1 text-xs sm:text-sm">
                      {t(`symptoms.${symptom}`)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeSymptom(symptom)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {symptom}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 max-h-60 overflow-y-auto">
                {filteredSymptoms.map((symptom, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`justify-center px-2 sm:px-4 py-1 sm:py-2 h-auto text-xs sm:text-sm md:text-base font-medium rounded-full ${
                      selectedSymptoms.includes(symptom) 
                        ? 'bg-teal-400 text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {t(`symptoms.${symptom}`)}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </section>
  )
}

