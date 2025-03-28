'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CancelModal from './CancelModal'
import LabAppointmentDetailModal from './LabAppointmentDetailModal'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { CancelLabReservation, UpdateMyLabReservation } from '@/lib/patient/clientApi'
import { shortName } from '@/lib/utils'
import { format } from "date-fns"
import Pagination from '@/components/Pagination'
import { useTranslations } from 'next-intl'


interface testDtails {
  test:{id:string,name:string}
  preparations:string[]
  cost:number
  id:string
  
}
interface ILabReservation {
  lab:{name:string,id:string,porfilePic:string,phoneNumbers:string[],chedule: {
    days:    {day: string,startTime: string,endTime: string,limit: string}[]
    cost: number}}
  id:string
  paymentMethod:string
  state:string
  totalCost:string
  requestedTests:{testDetails:testDtails,testResult:string[],id:string}[]
  date:string
}

interface IProps {
  currentPage:number
   totalPages:number
  appointments:ILabReservation[];
}



export default function LabAppointments({appointments,currentPage,totalPages}:IProps) {
 const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('patient.my_activity')
  const tcommon = useTranslations('common')
  const [selectedAppointment, setSelectedAppointment] = useState<ILabReservation | null>(null)
  const router = useRouter();
  const handleCancel = (appointment: ILabReservation) => {
    setSelectedAppointment(appointment)
    setCancelModalOpen(true)
  }
  const confirmCancel = async() => {
    if (selectedAppointment) {
      setIsLoading(true)
      const res = await CancelLabReservation(selectedAppointment.id);
      if (res.success === true) {
        toast.success(res.message, {
        duration: 3000,
        position: 'top-center',
      });
      router.push(`my-activity?labsPage=${currentPage}&activeTab=labs`);
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 3000,
        position: 'bottom-center',
      }));
    }
    setIsLoading(false)
    setCancelModalOpen(false)
    setSelectedAppointment(null)
  }
  }
  const handlePageChange=(newPage:number)=>{
    router.push(`my-activity?labsPage=${newPage}&activeTab=labs`);
  }
  
    const handleShowDetails = (appointment: ILabReservation) => {
      setSelectedAppointment(appointment)
      setDetailModalOpen(true)
    }

    const handleUpdate = async(date:string) => {
      setIsLoading(true)
      if(date!==''){
        console.log(selectedAppointment.id)
        
        const res = await UpdateMyLabReservation({date},selectedAppointment.id);
        if (res.success === true) {
          toast.success(res.message, {
          duration: 3000,
          position: 'top-center',
        });
        router.refresh();
      } else {
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 3000,
          position: 'bottom-center',
        }));
      }
    }
    setIsLoading(false)
    handleCloseDetailModal()
    }

  
    const handleCloseDetailModal = () => {
      setDetailModalOpen(false)
      setSelectedAppointment(null)
    }

  return (
    <div className="grid gap-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="w-full">
          <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <Avatar>
                  <AvatarImage src={appointment.lab.porfilePic} alt={appointment.lab.name} />
                  <AvatarFallback>{shortName(appointment.lab.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{appointment.lab.name}</h3>
                </div>
              </div>
              <div className="flex flex-col items-center" >

              <p className="text-sm text-gray-500">{`${t(`State`)}: ${t(`${appointment.state}`)}`}</p>
              <p className="text-sm text-gray-500">{`${t(`Date`)}: ${format(new Date(appointment.date), 'yyyy-MM-dd') }`}</p>
              </div>
            </div>
            <div>
                  <div className="flex justify-between">

              <h4 className="font-semibold mb-2">{`${t(`Tests`)}:`}</h4>
              <h4 className="font-semibold mb-2">{t(`Price`)}</h4>
                    </div>
              <ul className="space-y-1">
                {appointment.requestedTests.map((test, index) => (
                      <li key={index} className="flex justify-between items-center">
                    <span>{test.testDetails.test.name}</span>
                    <span>{`${test.testDetails.cost} ${tcommon(`EGP`)}`}</span>
                  </li>
                ))}
              </ul>
                </div>
                <div className="mt-4 text-right font-semibold">{`${t(`Total`)}: ${appointment.totalCost} ${tcommon(`EGP`)}`}</div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-start gap-2">
        
            <Button onClick={() => handleShowDetails(appointment)} className="w-full sm:w-auto">{t(`Details`)}</Button>
            {appointment.state!=="completed"?
            <Button variant="outline" onClick={() => handleCancel(appointment)} className="w-full sm:w-auto">{t(`Cancel`)}</Button>:null
            }
            {/* <Button variant="outline" onClick={() => handleCancel(appointment)} className="w-full sm:w-auto">Cancel</Button> */}
          </CardFooter>
          
        </Card>
      ))}
      
      <CancelModal 
        isOpen={cancelModalOpen} 
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancel}
        itemName="lab appointment"
        isLoading={isLoading}
      />
          <LabAppointmentDetailModal  
            isOpen={detailModalOpen}
            isLoading={isLoading}
            onClose={handleCloseDetailModal}
            appointment={selectedAppointment}
            onUpdate={handleUpdate}
            />
          <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
<Toaster />
    </div>
  )
}

