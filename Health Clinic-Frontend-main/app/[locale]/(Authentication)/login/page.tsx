"use client"
import Medical from "@/public/Medical.jpeg"
import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Login from "@/components/Login"
import {   userTypeSchema, userTypeValue } from "@/schema/Essentials"
export default function LoginPage() {
  const [step, setStep] = useState(1);
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
            <Form {...userTypeForm}>
              <form onSubmit={userTypeForm.handleSubmit(onUserTypeSubmit)} className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold">Login</h1>
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
          ) : (
            <>
              {userTypeForm.getValues().userType === 'doctor' ? (
                <Login onBack={handleBack} role={userTypeForm.getValues().userType} />
              ) : userTypeForm.getValues().userType === 'patient' ? (
                <Login onBack={handleBack} role={userTypeForm.getValues().userType} />
              ): userTypeForm.getValues().userType === 'lab' ? (
                <Login onBack={handleBack} role={userTypeForm.getValues().userType} />
              ) : userTypeForm.getValues().userType === 'pharmacy' ? (
                <Login onBack={handleBack} role={userTypeForm.getValues().userType} />
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