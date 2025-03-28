'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FileText } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HandleTimeFormat } from '@/schema/Essentials'
import Spinner from '@/components/Spinner'

interface TestDetails {
  test: { id: string; name: string }
  preparations: string[]
  cost: number
  id: string
}

interface ILabReservation {
  lab:{
    name: string
    id: string
    porfilePic: string
    phoneNumbers: string[]
    schedule: {
      days: {
        day: string
        startTime: string
        endTime: string
        limit: string
      }[]
      cost: number
    }
  }
  id: string
  paymentMethod: string
  state: string
  totalCost: string
  requestedTests: {
    testDetails: TestDetails
    testResult: string[]
    id: string
  }[]
  date: string
}

interface AppointmentDetailModalProps {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  appointment: ILabReservation | null
  onUpdate: (date: string) => void
}

const formSchema = z.object({
  day: z.string().min(1, { message: "Day is required" }),
  date: z.string().min(1, { message: "Date is required" }),
})

export default function LabAppointmentDetailModal({ isOpen, onClose,isLoading, appointment, onUpdate }: AppointmentDetailModalProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const t = useTranslations('patient.my_activity')
  const tday = useTranslations('days')
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: '',
      date: appointment?.date || '',
    },
  })

  const handleUpdate = async(values: z.infer<typeof formSchema>) => {
    if (appointment) {
      const date=new Date(values.date).setUTCHours(0,0,0,0)
     await onUpdate(new Date(date).toISOString())
     setSelectedDay(null)
     form.reset({
      day: '',
      date: appointment?.date || '',
     })
    }
  }

  // Generate 5 dates from the selected day
  const getAvailableDates = (dayName: string) => {
    const today = new Date()
    const dates: Date[] = []
    let currentDate = new Date(today)

    // Find the next occurrence of the selected day
    while (format(currentDate, 'EEEE').toLowerCase() !== dayName.toLowerCase()) {
      currentDate = addDays(currentDate, 1)
    }

    // Generate 5 dates
    for (let i = 0; i < 5; i++) {
      dates.push(addDays(currentDate, i * 7))
    }

    return dates
  }

  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] ">
        <ScrollArea className="h-[calc(70vh-2rem)] pr-4" style={{ overflow: 'auto' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t(`Appointment_Details`)}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={appointment.lab.porfilePic} alt={appointment.lab.name} />
                <AvatarFallback>{appointment.lab.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{appointment.lab.name}</h2>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
                {appointment.state !== "completed" && (
                  <div className="space-y-4 p-1">
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t(`Select_Day`)}</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedDay(value)
                              form.setValue('date', '') 
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t(`Select_available_day`)} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {appointment.lab.schedule.days.map((schedule) => (
                                <SelectItem key={schedule.day} value={schedule.day}>
                                  {tday(`${(schedule.day).toLowerCase()}`)} ({HandleTimeFormat(schedule.startTime)} - {HandleTimeFormat(schedule.endTime)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedDay && (
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>{t(`Select_Appointment_Date`)}</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue>
                                    {field.value ? format(new Date(field.value), 'EEEE, MMMM d, yyyy') : t(`Select_available_date`)}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableDates(selectedDay).map((date) => (
                                    <SelectItem 
                                      key={date.toISOString()} 
                                      value={date.toISOString()}
                                    >
                                      {format(date, 'EEEE, MMMM d, yyyy')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-2 block">{t(`Test_Results`)}</Label>
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {appointment.requestedTests.map((test) => (
                        <Card key={test.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{test.testDetails.test.name}</CardTitle>
                            <div className="mt-1">
              <h3 className="text-sm font-sempibold mb-1">{`${t(`Preperations`)}:`}</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {test.testDetails.preparations.length > 0 ? test.testDetails.preparations.map((prep, index) => (
                  <li key={index}>{prep}</li>
                )) : <li>{t(`None`)}</li>}
              </ul>
            </div>
                          </CardHeader>
                          <CardContent>
                          
                            <div className="flex flex-wrap gap-2">
                              {test.testResult.map((result, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center space-x-2"
                                  asChild
                                >
                                  <a
                                    href={result}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`View Result File ${index + 1}`}
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span>{t(`Result`,{index:index+1})}</span>
                                  </a>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {appointment.state !== "completed" && (
                  <DialogFooter className="p-1">
                    <Button type="button" disabled={isLoading} variant="outline" onClick={onClose}>
                      {t(`Cancel`)}
                    </Button>
                    <Button type="submit" disabled={isLoading}>{isLoading?<Spinner />:t(`Update_Lab_Appointment_submit`)}</Button>
                  </DialogFooter>
                )}
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

