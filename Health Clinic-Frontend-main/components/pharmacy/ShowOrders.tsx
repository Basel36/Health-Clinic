'use client'

import { useState } from "react"
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Spinner from "../Spinner"
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import { shortName } from "@/lib/utils"
import { MarkDelivered } from "@/lib/pharmacy/clientApi"
import { useTranslations } from 'next-intl'



interface IProps {
  OID: string;
  order:object;
}

export default function ShowOrders({ order}: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [showEndReservationDialog, setShowEndReservationDialog] = useState(false)
console.log(order)
  const t = useTranslations('Orders')

  const handleMarkDelivered = async () => {
    setIsLoading(true);
    try{
    const res = await MarkDelivered({state:"delivered"},order.id);
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
      setIsOpen(false);
      setShowEndReservationDialog(false)
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button disabled={isLoading} variant="outline" onClick={() => setIsOpen(true)}>View Order</Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t(`Details.title`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
              <div className="grid gap-4">
             
              <div className="flex flex-col items-center gap-2 mb-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                          <AvatarImage src={order.patient.profilePic} alt="Patient" />
                <AvatarFallback>{shortName(order.patient.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-lg sm:text-2xl font-bold">{order.patient.name}</h2>
             
                    
                  </div>
                <p className="text-sm text-gray-500 mb-2">{`${t(`Details.pay_method`)}: ${t(`${`Details.${order.paymentMethod}`}`)}`}</p>
                </div>
                <div>
               
                  <ul className="space-y-2 flex flex-col justify-between  ">
                  <li  className="flex justify-between items-center text-md">
                    <span>{t(`Details.product`)}</span>
                    <span>{t(`Details.price`)}</span>
                    <span>{t(`Details.quantity`)}</span>
                    </li>
                    {order.medicines.length >0 ? (order.medicines.map((medicine, index) => (
                      <li key={index} className="flex justify-between items-center text-sm ">
                        <span >{medicine.medicineId.medicine.name}</span>
                        <span>{medicine.price}</span>
                        <span className="text-gray-500">{medicine.quantity}</span>
                      </li>
                    ))): <p className="ml-1 text-sm">{t(`Details.no_products`)}</p>}
                  </ul>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>{t(`Details.total`)}</span>
                  <span>{order.totalCost}</span>
                </div>
                {/* <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">Required Tests</h3>
                  <ul className="space-y-1">
                    {reservation.report.requestedTests.length >0 ?(reservation.report.requestedTests.map((test, index) => (
                      <li key={index} className="text-sm">{test}</li>
                    ))):<p className="ml-1 text-sm">No Tests Requested</p>}
                  </ul>
                </div> */}
              </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button disabled={isLoading} type="button" onClick={() => setIsOpen(false)} variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
              {t(`Details.cancel`)}
            </Button>
            <Button disabled={isLoading} onClick={() => setShowEndReservationDialog(true)} variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm">
              {isLoading ? <Spinner /> : t(`Details.submit`)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEndReservationDialog} onOpenChange={setShowEndReservationDialog}>
        <DialogContent className="w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Sure?</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark theis order deliverd? </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button disabled={isLoading} type="button" onClick={() => setShowEndReservationDialog(false)} variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleMarkDelivered} variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm">
              {isLoading ? <Spinner /> : "Mark Deliverd"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}