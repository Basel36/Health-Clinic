'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { File, FileText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import Spinner from '@/components/Spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, format } from "date-fns"
import { HandleTimeFormat } from '@/schema/Essentials'
import { useTranslations } from 'next-intl'

interface IDoctorReservation {
  doctor:{name:string,id:string,porfilePic:string,gender:string,specialization:string,phoneNumbers:string[],  schedule: {
    days: {day: string,startTime: string,endTime: string,limit: string}[]
    cost: number;
  }}
  id:string
  state:string
  report:{diagnose: string|null,requestedTests:string[],results:string[],medicine:string[]}
  date:string

}

interface AppointmentDetailModalProps {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onUpdate: (data:{date:string,files:File[]}) => void
  appointment:IDoctorReservation|null
}

const formSchema = z.object({
  scheduleDay: z.string(),
  appointmentDate: z.string(),
  files: z.array(z.custom<File>()),
}).refine(data => data.appointmentDate || (data.files && data.files.length > 0), {
  message: "Either date or files must be provided",
  path: ['root'],
});

export default function DoctorAppointmentDetailModal({ isOpen, onClose, appointment, onUpdate, isLoading}: AppointmentDetailModalProps) {
  const t = useTranslations('patient.my_activity')
  const tday = useTranslations('days')
  const tspec = useTranslations('Specializations')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduleDay: '',
      appointmentDate: '',
      files: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "files",
  })

  const selectedDay = form.watch('scheduleDay')

  // Generate available dates based on selected schedule day
  const getAvailableDates = (selectedDay: string) => {
    if (!selectedDay) return []
    
    const today = new Date()
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      .indexOf(selectedDay.toLowerCase())
    
    const dates: Date[] = []
    let currentDate = new Date()
    
    // Keep looking for dates until we find 5 valid ones
    while (dates.length < 5) {
      if (currentDate.getDay() === dayIndex && currentDate >= today) {
        dates.push(new Date(currentDate))
      }
      currentDate = addDays(currentDate, 1)
    }
    
    return dates
  }

  const availableDates = selectedDay ? getAvailableDates(selectedDay) : []

  const handleUpdate = async(values: z.infer<typeof formSchema>) => {
  if (appointment) {
    const date = values.appointmentDate 
      ? new Date(values.appointmentDate).setUTCHours(0,0,0,0)
      : undefined;
      
    await onUpdate({
      date: date ? new Date(date).toISOString() : appointment.date,
      files: values.files || [],
    });
    form.reset({
      scheduleDay: '',
      appointmentDate: '',
      files: [],
    })
  }
}

  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[65vh]">
        <ScrollArea className="h-[calc(65vh-2rem)] pr-4" style={{ overflow: 'auto' }}>
          <DialogHeader>
            <DialogTitle>{t(`Appointment_Details`)}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-8 p-1 pb-8">
              <div className="grid gap-4 py-4">
                {/* Existing doctor info fields */}
                <div className="flex gap-2 items-center">
                  <h3 className=" text-md sm:text-md font-semibold">{`${t(`Doctor`)}:`}</h3>
                  <span id="name">{appointment.doctor.name}</span>
                        
                </div>
                <div className="flex gap-2 items-center">
                  <h3 className=" text-md sm:text-md font-semibold">{`${t(`Specialization`)}:`}</h3>
                  <span id="name">{tspec(`${appointment.doctor.specialization}`)}</span>
                        
                </div>
                <div className="flex gap-2 items-center">
                  <h3 className=" text-md sm:text-md font-semibold">{`${t(`Diagnosis`)}:`}</h3>
                  <span id="name">{appointment.report.diagnose}</span>
                        
                </div>
               
                
              
                <div>
                  <h3 className="mb-4 text-md sm:text-md font-semibold">{`${t(`Prescriptions`)}:`}</h3>
                  <ul className="space-y-2">
                    {appointment.report.medicine.length >0 ? (appointment.report.medicine.map((medicine, index) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span>{medicine.name}</span>
                        <span className="text-gray-500">{medicine.dose}</span>
                      </li>
                    ))): <p className="ml-1 text-sm">{t(`No_Medicines`)}</p>}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-md sm:text-md font-semibold">{`${t(`Requested_Tests`)}:`}</h3>
                  <ul className="space-y-2">
                    {appointment.report.requestedTests.length >0 ? (appointment.report.requestedTests.map((test, index) => (
                      <li key={index} className="flex justify-between items-center text-md">
                        <span>{test}</span>
                      </li>
                    ))): <p className="ml-1 text-sm">{t(`No_Tests`)}</p>}
                  </ul>
                </div>
                {/* Files section */}
                <div className="flex items-center gap-2">
                  <h3 className="text-md sm:text-md font-semibold">{`${t(`Files`)}:`}</h3>
                  <div className="flex gap-2 p-4 flex-wrap items-center justify-start">
                    {appointment.report.results.length>0? appointment.report.results.map((result, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 flex items-center space-x-2"
                        asChild
                      >
                        <a href={result} target="_blank" rel="noopener noreferrer" title={`View Result File ${index + 1}`}>
                          <FileText className="h-4 w-4" />
                          <span>{t(`File`,{index:index+1})}</span>
                        </a>
                      </Button>
                    )) :<p className="ml-1 text-sm">{t(`No_Files`)}</p>}
                  </div>
                </div>
                {(appointment.state !== "completed" && appointment.state !== "consultation" )&& (
                  <>
                    {/* File Upload Fields */}
                    <FormField
                      control={form.control}
                      name="files"
                      render={() => (
                        <FormItem className="grid  items-center ">
                          <FormLabel className="text-md">{t(`Upload_Files`)}</FormLabel>
                          <FormControl className="col-span-3">
                            <Input
                              type="file"
                              accept=".pdf"
                              multiple
                              disabled={isLoading}
                              onChange={(e) => {
                                const newFiles = Array.from(e.target.files || []);
                                newFiles.forEach((file) => append(file));
                              }}
                            />
                          </FormControl>
                          <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                      )}
                    />

                    {/* Uploaded Files List */}
                    {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                        <span className="col-start-2 col-span-2">{t(`File`,{index:index+1})}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          {t(`Remove`)}
                        </Button>
                      </div>
                    ))}
        
                    {/* Schedule Day Selection */}
                    <FormField
                      control={form.control}
                      name="scheduleDay"
                      render={({ field }) => (
                        <FormItem className="grid  items-center ">
                          <FormLabel className="text-md" >{t(`Schedule_Day`)}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl className="col-span-3">
                              <SelectTrigger>
                                <SelectValue placeholder={t(`Select_available_day`)} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {appointment.doctor.schedule.days.map((schedule) => (
                                <SelectItem key={schedule.day} value={schedule.day}>
                                    {tday(`${(schedule.day).toLowerCase()}`)} ({HandleTimeFormat(schedule.startTime)} - {HandleTimeFormat(schedule.endTime)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="col-start-2 col-span-3" />
                        </FormItem>
                      )}
                    />

                    {/* Date Selection */}
                    {selectedDay && (
                      <FormField
                        control={form.control}
                        name="appointmentDate"
                        render={({ field }) => (
                          <FormItem className="grid  items-center ">
                            <FormLabel className="text-md">{t(`Available_Dates`)}</FormLabel>
                            <div className="col-span-3 space-y-4">
                              <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue>
                                      {field.value ? format(new Date(field.value), 'EEEE, MMMM d, yyyy') : t(`Select_available_date`)}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableDates.map((date) => (
                                    <SelectItem 
                                      key={date.toISOString()} 
                                      value={date.toISOString()}
                                    >
                                      {format(date, 'EEEE, MMMM d, yyyy')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage className="col-start-2 col-span-3" />
                          </FormItem>
                        )}
                      />
                    )}

                  </>
                )}
              </div>

              {appointment.state !== "completed" && (
                <DialogFooter>
                  <Button disabled={isLoading} type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || (!form.watch("appointmentDate") && (!form.watch("files") || form.watch("files").length === 0))}>
                    {isLoading ? <Spinner /> : t(`Update_Doctor_Appointment_submit`)}
                  </Button>
                </DialogFooter>
              )}
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

