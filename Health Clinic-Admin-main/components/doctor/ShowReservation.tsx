'use client'

import { useState } from "react"
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, X, File } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { EnReservationschema, EndReservationValues } from "@/schema/DoctorReservation"
import Spinner from "../Spinner"
import toast, { Toaster } from 'react-hot-toast';
import { getToken } from "@/lib/auth"
import { getAge } from "@/utils/utils"
import { useRouter } from 'next/navigation'
import { shortName } from "@/lib/utils"
import { FormDataHandler } from "@/utils/AuthHandlers"
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface consultaitonData {
  diagnose: string;
  medicine: { name: string, dose: string, id: string }[];
  requestedTests: string[];
}

interface IProps {
  size: string;
  reservation: object;
  RID: string;
  currentPage: number;
  currentDate?: string;
  consultaion?: consultaitonData | null;
}

export default function ShowReservation({  reservation, RID, currentPage, currentDate, consultaion }: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [showEndReservationDialog, setShowEndReservationDialog] = useState(false)
  const [showSetConsultationDialog, setShowSetConsultationDialog] = useState(false)
  const t = useTranslations('Reservations')

  const { register, control, handleSubmit, formState: { errors }, reset, getValues } = useForm<EndReservationValues>({
    resolver: zodResolver(EnReservationschema),
    defaultValues: {
      diagnose: consultaion ? consultaion.diagnose : "",
      medicine: consultaion ? consultaion.medicine : [],
      requestedTests: consultaion ? consultaion.requestedTests : [],
    },
  })

  const { fields: medicineFields, append: appendMedicine, remove: removeMedicine } = useFieldArray({
    control,
    name: "medicine",
  })

  const { fields: testFields, append: appendTest, remove: removeTest } = useFieldArray({
    control,
    name: "requestedTests",
  })

  const handleConsultaionModal = () => {
    const currentValues = getValues();
    reset({
      ...currentValues,
      consultationDate: null,
    })
    setShowSetConsultationDialog(!showSetConsultationDialog)
  }

  const handleResrvationModal = () => {
    reset({
      diagnose: consultaion ? consultaion.diagnose : "",
      medicine: consultaion ? consultaion.medicine : [],
      requestedTests: consultaion ? consultaion.requestedTests : [],
      consultationDate: null,
    })
    setIsOpen(!isOpen)
  }

  const handleSetConsultation = () => {
    setShowSetConsultationDialog(true)
  }

  const onSubmit: SubmitHandler<EndReservationValues> = async () => {
    setShowEndReservationDialog(true);
  }

  const onSubmitConsultationDate: SubmitHandler<EndReservationValues> = async (data: EndReservationValues) => {
    setIsLoading(true);
    const { consultationDate, ...rest } = data;
    const consultaion = { report: { ...rest }, date: new Date(consultationDate).toISOString(), state: 'consultaion' };
    const body = FormDataHandler(consultaion);
    const token = getToken();
    try {
      const res = await fetch(`/api/doctor/reservations?ID=${RID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body,
      })
      setIsLoading(false);

      if (res.ok) {
        setShowSetConsultationDialog(false)
        setIsOpen(false)
        reset({
          diagnose: "",
          medicine: [],
          requestedTests: [],
          consultationDate: null,
        })
        router.push(`doctor?page=${currentPage}&date=${currentDate}`)
      } else {
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 2000,
          position: 'bottom-center',
        }))
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const handleEndReservation = async () => {
    setIsLoading(true);
    const currentValues = getValues();
    const {  ...rest } = currentValues;
    const treatment = { report: { ...rest }, state: 'completed' };
    const body = FormDataHandler(treatment);
    const token = getToken();
    try {
      const res = await fetch(`/api/doctor/reservations?ID=${RID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: body,
      })
      setIsLoading(false);

      if (res.ok) {
        setShowEndReservationDialog(false)
        setIsOpen(false)
        reset({
          diagnose: "",
          medicine: [],
          requestedTests: [],
          consultationDate: null,
        })
        router.push(`doctor?page=${currentPage}&date=${currentDate}`)
      } else {
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 2000,
          position: 'bottom-center',
        }))
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
    }
  }

  const handleCancelConsultationDate = () => {
    const currentValues = getValues();
    reset({
      ...currentValues,
      consultationDate: null,
    })
    setShowSetConsultationDialog(false)
  }

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={handleResrvationModal}>
        <DialogTrigger asChild>
          <Button disabled={isLoading} variant="outline" onClick={() => setIsOpen(true)}>{t(`View_Details`)}</Button>
        </DialogTrigger>
        <DialogContent className="w-full h-[90vh] sm:h-auto sm:max-w-3xl overflow-y-auto">
          <div className="custom-scrollbar overflow-y-auto max-h-[calc(90vh-4rem)] sm:max-h-[calc(100vh-8rem)] pr-4 p-1 ">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{t('Details.title')}</DialogTitle>
              <DialogDescription>{`${t(`Details.RDate`)}: ${new Date(reservation.date).toDateString()}`} - {reservation.state==="pending"?"new":"consultation"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2 sm:gap-4 py-2 sm:py-4 space-y-2">
                <div className="flex flex-col items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                    <AvatarImage src={reservation.patient.profilePic} alt={reservation.patient.name} />
                    <AvatarFallback>{shortName(reservation.patient.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg sm:text-2xl font-bold">{reservation.patient.name}</h2>
                    <p>{`${t(`Details.PAge`)}: ${getAge(reservation.patient.dateOfBirth)}`}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.FSBP`)}</h3>
                  <div className="flex flex-wrap gap-2">
            
                    {reservation.report.results.length>0? reservation.report.results.map((index,result)=>{
 <Link href={result} index={index} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm h-9 rounded-md px-3" >
 <File className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
 {`${t(`Details.View_File`)} ${index}`}
</Link>
                    }):t(`Details.No_Files`)}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.diagnose.title`)}</h3>
                  <div className="space-y-2 mb-4">
                    <Textarea
                      aria-describedby="diagnose field"
                      disabled={isLoading}
                      placeholder={`${t(`Details.diagnose.placeholder`)}`}
                      {...register("diagnose")}
                      className="w-full text-xs sm:text-sm"
                    />
                    {errors.diagnose && (
                      <p className="text-red-500 text-sm">{errors.diagnose.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.Medicine.title`)}</h3>
                  <div className="space-y-2">
                    {medicineFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                        <Input
                          disabled={isLoading}
                          placeholder={`${t(`Details.Medicine.Medicine_name`)}`}
                          {...register(`medicine.${index}.name`)}
                          className="w-full sm:w-1/2 text-xs sm:text-sm"
                        />
                        <Input
                          disabled={isLoading}
                          placeholder={`${t(`Details.Medicine.Medicine_Dose`)}`}
                          {...register(`medicine.${index}.dose`)}
                          className="w-full sm:w-1/3 text-xs sm:text-sm"
                        />
                        <Button
                          disabled={isLoading}
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMedicine(index)}
                          className="p-1 sm:p-2"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                    {errors.medicine && (
                      <p className="text-red-500 text-sm">{errors.medicine.message}</p>
                    )}
                    <Button 
                      disabled={isLoading} 
                      type="button" 
                      onClick={() => appendMedicine({ name: "", dose: "" })} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {t(`Details.Medicine.Add_Prescription`)}
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.Medicine.Tests.title`)}</h3>
                  <div className="space-y-2">
                    {testFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 mb-2">
                        <Input
                          disabled={isLoading}
                          placeholder={t(`Details.Medicine.Tests.placeholder`)}
                          {...register(`requestedTests.${index}`)}
                          className="w-full text-xs sm:text-sm"
                        />
                        <Button
                          disabled={isLoading}
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTest(index)}
                          className="p-1 sm:p-2"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                    {errors.requestedTests && (
                      <p className="text-red-500 text-sm">{errors.requestedTests.message}</p>
                    )}
                    <Button 
                      disabled={isLoading} 
                      type="button" 
                      onClick={() => appendTest("")} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {t(`Details.Medicine.Tests.button`)}
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button disabled={isLoading} type="button" onClick={handleSetConsultation} className="w-full sm:w-auto text-xs sm:text-sm">
                  {t(`Details.Set_Consultation_Button`)}
                </Button>
                <Button disabled={isLoading} type="submit" variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm">
                {t(`Details.End_Reservation_Button`)}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEndReservationDialog} onOpenChange={setShowEndReservationDialog}>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t(`Details.End_Reservation.title`)}</DialogTitle>
            <DialogDescription>
            {t(`Details.End_Reservation.description`)} </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button disabled={isLoading} type="button" onClick={() => setShowEndReservationDialog(false)} variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
            {t(`Details.End_Reservation.Cancel`)} 
            </Button>
            <Button disabled={isLoading} onClick={handleEndReservation} variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm">
              {isLoading ? <Spinner /> :   t(`Details.End_Reservation.submit`)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSetConsultationDialog} onOpenChange={handleConsultaionModal}>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t(`Details.Set_Consultation.title`)}</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitConsultationDate)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="consultationDate" className="text-right text-xs sm:text-sm">
                {t(`Details.Set_Consultation.Date`)}
                </Label>
                <Input
                  disabled={isLoading}
                  id="consultationDate"
                  type="date"
                  {...register("consultationDate")}
                  className="col-span-3 text-xs sm:text-sm"
                />
              </div>
              {errors.consultationDate && (
                <p className="text-red-500 text-sm">{errors.consultationDate.message}</p>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button disabled={isLoading} type="button" onClick={handleCancelConsultationDate} variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
              {t(`Details.Set_Consultation.Cancel`)}
              </Button>
              <Button disabled={isLoading} type="submit" className="w-full sm:w-auto text-xs sm:text-sm">{isLoading ? <Spinner /> : t(`Details.Set_Consultation.submit`)}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}