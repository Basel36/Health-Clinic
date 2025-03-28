"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from 'lucide-react'
import { format, addDays, differenceInWeeks } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import PregnancyCal from "@/public/PregnancyCal.png"
import { useTranslations } from 'next-intl'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PregnancyCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(new Date())
  const [cycleLength, setCycleLength] = useState(28)
  const [result, setResult] = useState<{ dueDate: Date, currentWeek: number } | null>(null)
  const t = useTranslations('patient.HealthServices.Pregnancy_Calculator')

  const calculateDueDate = () => {
    if (lastPeriodDate) {
      const dueDate = addDays(lastPeriodDate, 280)
      const currentWeek = differenceInWeeks(new Date(), lastPeriodDate)
      setResult({ dueDate, currentWeek })
    }
  }

  const getFruitSize = (weeks: number) => {
    const fruits = ["Poppy seed", "Apple seed", "Blueberry", "Raspberry", "Olive", "Plum", "Peach", "Lemon", "Apple"]
    return fruits[Math.min(Math.floor(weeks / 4), fruits.length - 1)]
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="mb-8">
          <div className="flex items-center justify-center">

            <Image
              src={PregnancyCal}
              alt="Pregnancy Calculator"
              width={400}
              height={200}
              className="w-2/3 h-auto rounded-lg mb-4"
            />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">{t(`title`)}</h1>
            <p className="text-center text-gray-600">
              {t(`description`)}
            </p>
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2" />
            </div>
          </div>

          {result ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8a3 3 0 0 0-3 3v1h6v-1a3 3 0 0 0-3-3z" />
                </svg>
                <p className="text-2xl font-bold mb-2">{format(result.dueDate, "MMMM d, yyyy")}</p>
                <p className="text-xl">{result.currentWeek} {t(`weeks`)} {result.currentWeek * 7 % 7} {t(`days`)}</p>
                <p className="text-lg mt-2">{t(`baby_size`)}{" "}{t(`fruits.${getFruitSize(result.currentWeek)}`)} 🍎</p>
              </div>

              <Card className="w-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t(`First_Trimester`)}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (result.currentWeek / 13) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t(`Second_Trimester`)}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.max(0, Math.min(100, ((result.currentWeek - 13) / 13) * 100))}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t(`Third_Trimester`)}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.max(0, Math.min(100, ((result.currentWeek - 26) / 14) * 100))}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => setResult(null)} 
                variant="outline"
                className="w-full"
              >
                {t(`Calculate_Again`)}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="space-y-2">
        <Label htmlFor="lastPeriodDate" className="text-sm text-gray-500 block">
          {t(`Start_Date`)}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${
                !lastPeriodDate && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {lastPeriodDate ? format(lastPeriodDate, "PPP") : <span>{t(`Pick_a_date`)}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={lastPeriodDate}
              onSelect={setLastPeriodDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

              <div>
                <Label htmlFor="cycleLength" className="text-sm text-gray-500 block mb-2">
                  {t(`Average_Cycle_Length_days`)}
                </Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={calculateDueDate}
                className="w-full bg-teal-500 h over:bg-teal-600"
              >
                {t(`button`)}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}