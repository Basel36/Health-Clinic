'use client'

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { FormDataHandler } from "@/utils/AuthHandlers"
import { MarkCompleted, UploadResults } from "@/lib/lab/clientApi"
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getAge } from "@/utils/utils"

// Zod schema
const TestResultSchema = z.object({
  id: z.string(),
  testResult: z.array(z.instanceof(File)).min(1, "At least one file is required"),
})

const PatientTestsSchema = z.object({
  requestedTests: z.array(TestResultSchema),
})

type PatientTestsValues = z.infer<typeof PatientTestsSchema>

interface Patient {
  name: string
  age: number
  profilePic: string
  dateOfBirth: string
}

interface IProps {
  patient: Patient
  requestedTests: {id:string, testDetails: {test:{name:string}}; testResult: File[] }[]
  RID: string;
}

export default function ShowReservation({ RID, patient, requestedTests }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('Reservations')

  const {  control, handleSubmit, formState: { errors }, setValue, watch } = useForm<PatientTestsValues>({
    resolver: zodResolver(PatientTestsSchema),
    defaultValues: {
      requestedTests: requestedTests.map(test => ({
        ...test,
        testResult: [] // Set default value to an empty array
      })),
    },
  })

  const { fields } = useFieldArray({
    control,
    name: "requestedTests",
  })

  const watchedFields = watch("requestedTests")

  const onSubmit = async(data: PatientTestsValues) => {
    try {
      setIsLoading(true);
    data.requestedTests.map(async(test:{id:string,testResult:File[]})=>{
      const formData = FormDataHandler({testId:test.id,testResult:test.testResult})
      const res = await UploadResults(formData,RID);
      if(res.success===false){
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 2000,
          position: 'bottom-center',
        }))
      }
    })
    const res = await MarkCompleted({state:"completed"},RID);
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
      setIsOpen(false);
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
    } catch (error) {
      toast.error(error || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      })
    }
  }

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      const currentFiles = watchedFields[index].testResult || []
      setValue(`requestedTests.${index}.testResult`, [...currentFiles, ...fileArray])
    }
  }

  const removeFile = (testIndex: number, fileIndex: number) => {
    const currentFiles = [...watchedFields[testIndex].testResult]
    currentFiles.splice(fileIndex, 1)
    setValue(`requestedTests.${testIndex}.testResult`, currentFiles)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>{t(`View_Details`)}</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t(`Details.title`)}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={patient.profilePic} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p>{`${t('Details.PAge')}: ${getAge(patient.dateOfBirth)}`}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 p-4 border rounded-md">
              <Label  className="text-sm font-medium">
                {field.testDetails.test.name}
              </Label>
              <div className="mt-2 space-y-2">
                <Input
                  id={`testResult-${index}`}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleFileChange(index, e)}
                  className="flex-grow"
                />
                {errors.requestedTests?.[index]?.testResult && (
                  <p className="text-red-500 text-sm">{errors.requestedTests[index]?.testResult?.message}</p>
                )}
                {watchedFields[index]?.testResult?.length > 0 && (
                  <div className="text-sm text-gray-500 space-y-1">
                    {watchedFields[index].testResult.map((file: File, fileIndex: number) => (
                      <div key={fileIndex} className="flex items-center justify-between">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, fileIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Test Results'}
          </Button>
        </form>
      </DialogContent>
      <Toaster />
    </Dialog>
  )
}