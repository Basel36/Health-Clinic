'use client'

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Edit2, DollarSign } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ConvertTimeToDate, DaysOfWeek, DayValue, HandleTimeFormat } from "@/schema/Essentials"
import { DoctorScheduleschema, DoctorScheduleschemaValue } from "@/schema/Doctor"
import { FormDataHandler } from "@/utils/AuthHandlers"
import { addDay, DeleteDay, UpdateCost, UpdateDay } from "@/lib/doctor/clientApi"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from "../Spinner"

interface IProps {
  days: DayValue[];
  cost: number;
}

function ScheduleForm({ onSubmit, availableDays, isLoading, initialData }: { onSubmit: (data: DayValue) => void, availableDays: string[], isLoading: boolean, initialData?: DayValue }) {
  const t = useTranslations('schedule')

  const form = useForm<DoctorScheduleschemaValue>({
    resolver: zodResolver(DoctorScheduleschema.pick({ days: true })),
    defaultValues: {
      days: initialData ? [initialData] : [{ day: "", startTime: "", endTime: "", limit: 0 }],
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data.days[0]))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="days.0.day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">{t('selectDay')}</FormLabel>
                  <Select disabled={initialData?true:false} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoading} className="text-sm sm:text-base">
                        <SelectValue placeholder={t('selectDay')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableDays.map(day => (
                        <SelectItem key={day} value={day} className="text-sm sm:text-base">
                          {t(`days.${day}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="days.0.limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">{t(`PatientLimit`)}</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} type="number" min={1} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="days.0.startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">{t('startTime')}</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="time" {...field} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="days.0.endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">{t('endTime')}</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="time" {...field} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3">{isLoading?<Spinner/>:(initialData ? t('updateSchedule') : t('addToSchedule'))}</Button>
      </form>
    </Form>
  )
}

export default function Schedule({ days, cost }: IProps) {
  const t = useTranslations('schedule')
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [currentEditingItem, setCurrentEditingItem] = useState<DayValue | null>(null)
  const [isSessionCostModalOpen, setIsSessionCostModalOpen] = useState(false)

  const costForm = useForm<{ cost: number }>({
    resolver: zodResolver(DoctorScheduleschema.pick({ cost: true })),
    defaultValues: { cost: cost },
  })

  const availableDays = DaysOfWeek.filter(day => !days.find(item => item.day === day))

  const handleAddSchedule = async(data: DayValue) => {
    setIsLoading(true);
    data.startTime=ConvertTimeToDate(data.startTime)
    data.endTime=ConvertTimeToDate(data.endTime)
    const res = await addDay(data)
    if (res.success ===true) {
      router.refresh()
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
  }

  const handleSaveSessionCost = async (data: { cost: number }) => {
    setIsLoading(true);
    const formData = FormDataHandler({ "schedule.cost": data.cost })
    const res = await UpdateCost(formData)
    if (res.success === true) {
      router.refresh()
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
    setIsSessionCostModalOpen(false)
  }

  const handleDeleteDay = (day: DayValue) => {
    setCurrentEditingItem(day)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async() => {
    setIsLoading(true);
    if (currentEditingItem) {
      const res = await DeleteDay({day:currentEditingItem.day})
      if (res.success === true) {
        router.refresh()
        toast.success(res.message, {
          duration: 2000,
          position: 'bottom-center',
        })
      } else {
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 2000,
          position: 'bottom-center',
        }))
      }
      setIsLoading(false);
      setIsDeleteModalOpen(false)
      setCurrentEditingItem(null)
    }
  }

  const handleUpdateDay = (day: DayValue) => {
    setCurrentEditingItem(day)
    setIsUpdateModalOpen(true)
  }

  const confirmUpdate = async (data: DayValue) => {
    setIsLoading(true);
    data.startTime=ConvertTimeToDate(data.startTime)
    data.endTime=ConvertTimeToDate(data.endTime)
    const res = await UpdateDay(data)
    if (res.success === true) {
      router.refresh()
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
    setIsUpdateModalOpen(false)
    setCurrentEditingItem(null)
  }

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
        <Card className="w-full h-full max-h-[90vh] sm:max-h-[95vh]">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">{t('title')}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <ScrollArea className="h-[calc(90vh-8rem)] sm:h-[calc(95vh-10rem)] pr-2 sm:pr-4">
              <div className="space-y-4 sm:space-y-6">
                <ScheduleForm availableDays={availableDays} onSubmit={handleAddSchedule} isLoading={isLoading} />
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold">{t('currentSchedule')}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm sm:text-base font-semibold">{t('sessionCost')}: {cost} EGP</span>
                      <Button disabled={isLoading} variant="outline" size="icon" onClick={() => setIsSessionCostModalOpen(true)}>
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {days.map((item) => (
                      <div key={item.day} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b space-y-2 sm:space-y-0">
                        <span className="text-sm sm:text-base font-medium">{t(`days.${item.day}`)}</span>
                        <span className="text-sm sm:text-base">{HandleTimeFormat(item.startTime)} - {HandleTimeFormat(item.endTime)}</span>
                        <div className="flex space-x-2">
                          <Button disabled={isLoading} variant="outline" size="sm" onClick={() => handleUpdateDay(item)}>
                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm">{t(`update`)}</span>
                          </Button>
                          <Button disabled={isLoading} variant="outline" size="sm" onClick={() => handleDeleteDay(item)}>
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm">{t(`delete`)}</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{t('confirmDeletion')}</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                {t('deleteConfirmation', { day: currentEditingItem ? t(`days.${currentEditingItem.day}`) : '' })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button disabled={isLoading} variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="text-sm sm:text-base">{t('cancel')}</Button>
              <Button variant="destructive" onClick={confirmDelete} className="text-sm sm:text-base">{isLoading?<Spinner />:(t('delete'))}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{t('updateSchedule')}</DialogTitle>
            </DialogHeader>
            
            {currentEditingItem && (
              <ScheduleForm
                onSubmit={confirmUpdate}
                availableDays={[currentEditingItem.day, ...availableDays]}
                isLoading={isLoading}
                initialData={currentEditingItem}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isSessionCostModalOpen} onOpenChange={setIsSessionCostModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{t('setSessionCost')}</DialogTitle>
            </DialogHeader>
            <Form {...costForm}>
              <form onSubmit={costForm.handleSubmit(handleSaveSessionCost)} className="space-y-4">
                <FormField
                  control={costForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">{t('sessionCost')}</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="text-sm sm:text-base" />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-sm sm:text-base">{isLoading?<Spinner/>:(t('setCost'))}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      <Toaster />
    </ProtectedRoute>
  )
}