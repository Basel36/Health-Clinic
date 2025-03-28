import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import {  MessageCircle } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'

const MedicalQuestionCard =()=>{
  const t = useTranslations('patient.MedicalQuestionCard')

      return(
            <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t(`title`)}</CardTitle>
              <CardDescription>{t(`description`)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
              {t(`paragraph`)}
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/patient/medical-questions">
                <Button className="w-full sm:w-auto">
                  <MessageCircle className="ltr:mr-2 rtl:ml-1 h-4 w-4" />
                  {t(`button`)}
                </Button>
              </Link>
            </CardFooter>
          </Card>
      )
}

export default MedicalQuestionCard