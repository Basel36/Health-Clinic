"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from 'lucide-react'
import { format, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import PeriodCal from "@/public/PeriodCal.png"
import { useTranslations } from 'next-intl'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PeriodCalculator() {
  const [periodLength, setPeriodLength] = useState(5)
  const [cycleLength, setCycleLength] = useState(28)
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(new Date())
  const [result, setResult] = useState<{ nextPeriod: Date, ovulationDate: Date } | null>(null)
  const t = useTranslations('patient.HealthServices.Period_Calculator')

  const calculateDates = () => {
    if (lastPeriodDate) {
      const nextPeriodDate = addDays(lastPeriodDate, cycleLength)
      const ovulation = addDays(lastPeriodDate, cycleLength - 14)
      setResult({ nextPeriod: nextPeriodDate, ovulationDate: ovulation })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-center">

            <Image
              src={PeriodCal}
              alt="Period Calculator"
              width={800}
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p className="text-2xl font-bold mb-2">{t(`Next_Period`)}: {format(result.nextPeriod, "MMMM d, yyyy")}</p>
                <p className="text-xl">{t(`Ovulation`)}: {format(result.ovulationDate, "MMMM d, yyyy")}</p>
              </div>

              <Card className="w-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t(`Follicular_Phase`)}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t(`Ovulation`)}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t(`Luteal_Phase`)}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
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
              <div>
                <Label htmlFor="lastPeriodDate" className="text-sm text-gray-500 block mb-2">
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
                      <CalendarIcon className="ltr:mr-2 rtl:ml-1 h-4 w-4" />
                      {lastPeriodDate ? format(lastPeriodDate, "PPP") : <span></span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
                  {t(`Cycle_Length_days`)}
                </Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="periodLength" className="text-sm text-gray-500 block mb-2">
                  {t(`Period_Length_days`)}
                </Label>
                <Input
                  id="periodLength"
                  type="number"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={calculateDates}
                className="w-full bg-teal-500 hover:bg-teal-600"
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