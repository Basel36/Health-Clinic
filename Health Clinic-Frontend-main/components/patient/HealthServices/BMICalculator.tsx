"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function BMICalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState("male")
  const [bmi, setBMI] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const t = useTranslations('patient.HealthServices.BMI_Calculator')

  const calculateBMI = () => {
    const heightInMeters = height / 100
    const bmiValue = weight / (heightInMeters * heightInMeters)
    setBMI(parseFloat(bmiValue.toFixed(1)))
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Healthy"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  const adjustValue = (type: 'weight' | 'height' | 'age', increment: boolean) => {
    const step = type === 'height' ? 1 : 1
    const setValue = type === 'weight' ? setWeight : type === 'height' ? setHeight : setAge
    const currentValue = type === 'weight' ? weight : type === 'height' ? height : age
    setValue(currentValue + (increment ? step : -step))
  }

  useEffect(() => {
    if (bmi) {
      const maxBMI = 40 // Maximum BMI for progress calculation
      const progressValue = (bmi / maxBMI) * 100
      setProgress(Math.min(progressValue, 100))
    }
  }, [bmi])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t(`title`)}</h1>
            <div className="absolute top-4 right-4">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2" />
            </div>
          </div>

          {bmi ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-48 h-48">
                <div className="w-full h-full rounded-full border-8 border-gray-100">
                  <div 
                    className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-teal-500"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                      transform: `rotate(${progress * 3.6}deg)`,
                      transition: 'transform 1s ease-out'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold">{bmi}</span>
                    <span className="text-sm text-gray-500">{t(`BMI`)}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl rtl:hidden">
                  {t(`You_have`)} <span className="text-teal-500 font-semibold">{t(`${getBMICategory(bmi)}`)}</span> {`${t(`body_weight`)}!`}
                </p>
                <p className="text-xl ltr:hidden">
                  {t(`You_have`)}  {t(`body_weight`) } <span className="text-teal-500 font-semibold">{t(`${getBMICategory(bmi)}`)}!</span>
                </p>
              </div>

              <Card className="w-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>{t(`Less_than`)} 18.5</span>
                    <span>{t(`Underweight`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>18.5 {t(`to`)} 24.9</span>
                    <span>{t(`Healthy`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>25 {t(`to`)} 29.9</span>
                    <span>{t(`Overweight`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 {t(`or_above`)}</span>
                    <span>{t(`Obese`)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => setBMI(null)} 
                variant="outline"
                className="w-full"
              >
                {t(`Calculate_Again`)}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className=" p-4 rounded-lg">
                  <Label className="text-sm text-gray-500">{t(`weight`)}</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">{weight}</span>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustValue('weight', false)}
                        className="h-8 w-8 rounded-full bg-orange-400 text-white hover:bg-orange-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustValue('weight', true)}
                        className="h-8 w-8 rounded-full bg-teal-500 text-white hover:bg-teal-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className=" p-4 rounded-lg">
                  <Label className="text-sm text-gray-500">{t(`age`)}</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">{age}</span>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustValue('age', false)}
                        className="h-8 w-8 rounded-full bg-orange-400 text-white hover:bg-orange-500"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustValue('age', true)}
                        className="h-8 w-8 rounded-full bg-teal-500 text-white hover:bg-teal-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className=" p-4 rounded-lg">
                <Label className="text-sm text-gray-500">{t(`height`)}</Label>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-2xl font-bold">{height}<span className="text-sm ml-1">{t(`cm`)}</span></span>
                  <input
                    type="range"
                    min="140"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-1/2 accent-teal-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">{t(`gender`)}</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={setGender}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">{t(`male`)}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">{t(`female`)}</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={calculateBMI}
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