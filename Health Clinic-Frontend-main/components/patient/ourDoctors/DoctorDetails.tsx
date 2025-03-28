"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { MapPin, Phone, Banknote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { getUser } from '@/lib/auth'
import { DaysOfWeek, HandleTimeFormat } from '@/schema/Essentials'
import toast, { Toaster } from 'react-hot-toast'
import { BookSession, DoctorOnlinePayment } from '@/lib/patient/clientApi'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'
import { useTranslations } from 'next-intl'

interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
  limit: string;
}

interface Doctor {
  schedule: {
    days: ScheduleDay[];
    cost: number;
  };
  id: string;
  profilePic: string;
  name: string;
  specialization: string;
  address: string[];
  rating?: number;
  reviews?: number;
  license: string[];
  phoneNumbers: string[];
  gender: string;
  email: string;
  about: string;
}

interface IProps {
  Doctor: Doctor;
}


const DoctorInfo = ({ doctor }: { doctor: Doctor }) => {
     const t = useTranslations('patient.doctors')
  const tcommon = useTranslations('common')
  const tspec = useTranslations('Specializations')
  return(


 

  <div>
    <h1 className="text-3xl font-bold">{doctor.name}</h1>
    <p className="text-xl text-gray-600 mb-2">{tspec(`${doctor.specialization}`)}</p>
    <p className="text-sm text-gray-500 mb-4">{doctor.about}</p>
    {/* <div className="flex items-center mb-4">
      <Star className="w-5 h-5 text-yellow-400 fill-current" />
      <span className="ml-1 text-lg">{doctor.rating}</span>
    </div> */}
    <div className="flex items-center">
      <Banknote className="w-5 h-5 text-gray-400" />
      <span className="ml-2">{`${doctor.schedule.cost} ${tcommon(`EGP`)}  -  ${t(`Per_Session`)}`} </span>
    </div>
  </div>
)
}

const LocationInfo = ({ addresses }: { addresses: string[] }) => {
  const t = useTranslations('patient.doctors')
return(
  <div>
    <h3 className="text-lg font-semibold mb-2">{t(`Locations`)}</h3>
    {addresses.map((address, index) => (
      <p key={index} className="flex items-center mb-2">
        <MapPin className="w-5 h-5 text-gray-400 mr-2" />
        {address}
      </p>
    ))}
  </div>
)
}

const ContactInfo = ({ phoneNumbers }: { phoneNumbers: string[] }) => {
  const t = useTranslations('patient.doctors')
return(

  <div>
    <h3 className="text-lg font-semibold mb-2">{t(`Contact_Information`)}</h3>
    {phoneNumbers.map((phone, index) => (
      <p key={index} className="flex items-center mb-2">
        <Phone className="w-5 h-5 text-gray-400 mr-2" />
        {phone}
      </p>
    ))}
  </div>
)
}

const ScheduleInfo = ({ days }: { days: ScheduleDay[] }) => {
  const t = useTranslations('patient.doctors')
  const tday = useTranslations('days')
  return(
  <div>
    <h3 className="text-lg font-semibold mb-2">{t(`Schedule`)}</h3>
    <div className="grid grid-cols-2 gap-4">
      {days.map(day => (
        <div key={day.day} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4">
          <p className="capitalize font-semibold">{tday(`${(day.day).toLowerCase()}`)}</p>
          <p>{HandleTimeFormat(day.startTime)} - {HandleTimeFormat(day.endTime)}</p>
        </div>
      ))}
    </div>
  </div>
)
}

const LicenseInfo = ({ licenses }: { licenses: string[] }) => {
  const [currentLicenseIndex, setCurrentLicenseIndex] = useState(0)
  const t = useTranslations('patient.doctors')
  const nextLicense = useCallback(() => {
    setCurrentLicenseIndex((prevIndex) => 
      prevIndex === licenses.length - 1 ? 0 : prevIndex + 1
    )
  }, [licenses.length])

  const prevLicense = useCallback(() => {
    setCurrentLicenseIndex((prevIndex) => 
      prevIndex === 0 ? licenses.length - 1 : prevIndex - 1
    )
  }, [licenses.length])

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t(`License_Certifications`)}</h3>
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative w-72 h-72 mx-auto">
          <Image
            src={licenses[currentLicenseIndex]}
            alt={`License ${currentLicenseIndex + 1}`}
            fill
            style={{ objectFit: 'contain' }}
            sizes="256px"
            quality={100}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 transform -translate-y-1/2"
          onClick={prevLicense}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous license</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 transform -translate-y-1/2"
          onClick={nextLicense}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next license</span>
        </Button>
      </div>
      <p className="text-center mt-2 text-sm text-gray-500">
        {`${t(`License`)} ${currentLicenseIndex + 1} of ${licenses.length}`}
      </p>
    </div>
  )
}

export default function DoctorDetails({ Doctor }: IProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa'>('cash')
  const t = useTranslations('patient.doctors')
  const tcommon = useTranslations('common')
  const tday = useTranslations('days')

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const {name:PatientName, phoneNumbers:PatientPhoneNumbers} = getUser();

  const getNextFiveDates = useCallback((day: string) => {
    const dayIndex = DaysOfWeek.indexOf(day.toLowerCase());
    const today = new Date();
    const dates: Date[] = [];
    const currentDate = new Date(today);

    while (dates.length < 5) {
      if (currentDate.getDay() === dayIndex) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);



  useEffect(() => {
    if (selectedDay) {
      const dates = getNextFiveDates(selectedDay);
      setAvailableDates(dates);
    }
  }, [selectedDay, getNextFiveDates]);

  const handleBook = useCallback(async() => {
    setIsLoading(true);

if(paymentMethod==="cash"){



    const res = await BookSession({doctor:Doctor.id,date:new Date(selectedDate.setUTCHours(0,0,0,0)).toISOString()})
    if (res.success ===true) {
      console.log(res.message)
          toast.success(res.message, {
                duration: 2000,
                position: 'top-center',
            })
          
      } else {
            res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
                  duration: 2000,
                  position: 'top-center',
            }))
      }
    }

    else if(paymentMethod==="visa"){
      console.log(new Date(new Date(selectedDate).setUTCHours(0,0,0,0)).toISOString());

    const res = await DoctorOnlinePayment(Doctor.id,new Date(selectedDate.setUTCHours(0,0,0,0)).toISOString())
    if (res.success ===true) {
      console.log(res)
      router.push(res?.data.session.url)
          
      } else {
            res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
                  duration: 2000,
                  position: 'top-center',
            }))
      }
    }
    
    setIsBookingOpen(false);
    setSelectedDay("");
    setSelectedDate(null)
    setIsLoading(false);

  }
  
  
  , [ selectedDate, Doctor.id,paymentMethod]);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }, []);

  const memoizedDoctorInfo = useMemo(() => <DoctorInfo doctor={Doctor} />, [Doctor]);
  const memoizedLocationInfo = useMemo(() => <LocationInfo addresses={Doctor.address} />, [Doctor.address]);
  const memoizedContactInfo = useMemo(() => <ContactInfo phoneNumbers={Doctor.phoneNumbers} />, [Doctor.phoneNumbers]);
  const memoizedScheduleInfo = useMemo(() => <ScheduleInfo days={Doctor.schedule.days} />, [Doctor.schedule.days]);
  const memoizedLicenseInfo = useMemo(() => <LicenseInfo licenses={Doctor.license} />, [Doctor.license]);

  return (
      
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                  <Image
                    src={Doctor.profilePic}
                    alt={Doctor.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-lg"
                  />
                </div>
                {memoizedDoctorInfo}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{t(`About_the_Doctor`)}</h2>
              <div className="space-y-4">
                {memoizedLocationInfo}
                {memoizedContactInfo}
                {memoizedScheduleInfo}
                {memoizedLicenseInfo}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-1/3">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{t(`Booking_Information`)}</h2>
              <Button className="w-full mb-4" onClick={() => setIsBookingOpen(true)}>
                {t(`Booking_Examination`)}
              </Button>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t(`Fees`)}</span>
                  <span>{`${Doctor.schedule.cost} ${tcommon(`EGP`)}`}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(`Book_Title`,{name:Doctor.name})}</DialogTitle>
            <DialogDescription>
              {t(`Book_Description`)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t(`Patient_Name`,{name:PatientName})}</Label>
            </div>
            <div>
              <Label> {t(`Patient_Phone`,{phone:(PatientPhoneNumbers.length > 1 ? PatientPhoneNumbers.map((phone:string) => `${phone} - `) : PatientPhoneNumbers[0])})}</Label>
            </div>
            <div>
              <Label>Select Day</Label>
              <RadioGroup onValueChange={setSelectedDay} className="grid grid-cols-2 gap-2 mt-2">
                {Doctor.schedule.days.map(day => (
                  <div key={day.day}>
                    <RadioGroupItem value={day.day} id={day.day} className="peer sr-only" />
                    <Label
                      htmlFor={day.day}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="capitalize">{tday(`${(day.day).toLowerCase()}`)}</span>
                      <span className="text-sm">{HandleTimeFormat(day.startTime)} - {HandleTimeFormat(day.endTime)}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {selectedDay && (
              <div>
                <Label>{t(`Select_Date`)}</Label>
                <Select onValueChange={(value) => setSelectedDate(new Date(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t(`Select_Date`)}/>
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates.map((date) => (
                      <SelectItem key={date.toISOString()} value={date.toISOString()}>
                        {formatDate(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">{t(`Payment_Method`)}</h3>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={(value) => setPaymentMethod(value as 'cash' | 'visa')}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                          <Label
                            htmlFor="cash"
                            className="flex items-center space-x-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="12" x="2" y="6" rx="2" />
                              <circle cx="12" cy="12" r="2" />
                              <path d="M6 12h.01M18 12h.01" />
                            </svg>
                            <span>{t(`Cash`)}</span>
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="visa" id="visa" className="peer sr-only" />
                          <Label
                            htmlFor="visa"
                            className="flex items-center space-x-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            <span>{t(`Visa`)}</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
          <DialogFooter>
            <Button onClick={handleBook} disabled={!selectedDay || !selectedDate || isLoading}>{isLoading?<Spinner />:t(`submit`)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
      
  )
}