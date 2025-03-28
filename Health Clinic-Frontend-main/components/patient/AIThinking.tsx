'use client'

import { useState, useEffect } from 'react'
import { Brain, Stethoscope, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface AIThinkingProps {
  message?: string
}

export default function AIThinking({  }: AIThinkingProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const t = useTranslations('patient.AIThinking')
  
  const messages = [
    "Analyzing_your_symptoms",
    "Reviewing_medical_patterns",
    "Matching_with_specializations",
    "Preparing_recommendations"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-transparent border-none">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Icons */}
        <div className="relative">
          <Brain className="w-12 h-12 text-primary animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-[spin_3s_linear_infinite]" />
            </div>
          </div>
        </div>

        {/* Secondary Icons */}
        <div className="flex justify-center space-x-8">
          <div className="animate-bounce delay-100">
            <Stethoscope className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="animate-bounce delay-200">
            <Activity className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-primary">
            {`${t(`${messages[currentMessage]}`)}...`}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(`Our_AI_is_evaluating_your_case`)}
          </p>
        </div>


      </div>
    </Card>
  )
}

