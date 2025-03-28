"use client"
import Medical from "@/public/Medical.jpeg"
import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {   userTypeSchema, userTypeValue } from "@/schema/Essentials"
import Doctor from "@/components/Singup-Forms/Doctor/Doctor"
import Patient from "@/components/Singup-Forms/Patient"
import Lab from "@/components/Singup-Forms/Lab/Lab"
import Pharmacy from "@/components/Singup-Forms/Pharmacy"
import { useLocale } from 'next-intl'
import Link from "next/link"

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const locale = useLocale()

  const userTypeForm = useForm<userTypeValue>({
    resolver: zodResolver(userTypeSchema),
  })

  const onUserTypeSubmit = () => {
    setStep(2)
  }

  const handleBack = () => {
    setStep(1);
  }
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[350px] space-y-6">
          {step === 1 ? (
            <>
            <Form {...userTypeForm}>
              <form onSubmit={userTypeForm.handleSubmit(onUserTypeSubmit)} className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold">Sign Up</h1>
                  <p className="text-balance text-muted-foreground">
                    Choose your account type to get started
                  </p>
                </div>
                <FormField
                  control={userTypeForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          {["Doctor", "Patient", "Lab", "Pharmacy"].map((type) => (
                            <FormItem key={type}>
                              <FormControl>
                                <RadioGroupItem
                                  value={type.toLowerCase()}
                                  id={type.toLowerCase()}
                                  className="peer sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                htmlFor={type.toLowerCase()}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                {type}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </Form>
             <div className="text-center text-sm">
             Already have an account?{" "}
             <Link href={`/${locale}/login`} className="underline">
               Log in
             </Link>
           </div>
           </>
          ) : (
            <>
              {userTypeForm.getValues().userType === 'doctor' ? (
                <Doctor onBack={handleBack} role={userTypeForm.getValues().userType} />
              ) : userTypeForm.getValues().userType === 'patient' ? (
                <Patient onBack={handleBack} role={userTypeForm.getValues().userType} />
              ): userTypeForm.getValues().userType === 'lab' ? (
                <Lab onBack={handleBack} role={userTypeForm.getValues().userType} />
              ) : userTypeForm.getValues().userType === 'pharmacy' ? (
                <Pharmacy onBack={handleBack} role={userTypeForm.getValues().userType} />
              ) : (
                <div>Who Are You {userTypeForm.getValues().userType}</div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="hidden lg:block flex-1">
        <Image
          src={Medical}
          alt="Healthcare illustration"
          width={1920}
          height={1080}
          className="h-full w-full "
          style={{objectFit:"cover"}}
        />
      </div>
    </div>
  )
}