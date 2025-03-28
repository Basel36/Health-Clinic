 "use client"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { shortName } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getAge } from "@/utils/utils"
import Spinner from "../Spinner"
type role= "Patient" | "Pharmacy" | "Lab" | "Doctor" 

interface IDoctor {
  id:string
  name: string
  dateOfBirth: string
  email: string
  address: string[]
  phoneNumbers: string[]
  specialization: string
  profilePic: string
  state: boolean|undefined
  about: string
  license: string[]
  gender: string
}

  export function DoctorModal({ doctor, onClose, onAccept, onDecline,role ,isAccepting,isDeclining}: {isDeclining:boolean,isAccepting:boolean, doctor: IDoctor, onClose: () => void, onAccept: () => void, onDecline: () => void,role:role }) {
  const t = useTranslations('Actor_Modal')
  
  return (
    <Dialog open={!!doctor} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${role!=="Patient"?"h-[80vh]":null} p-0 flex flex-col`}>
        <DialogHeader className="px-6 py-4 ">
          <DialogTitle>{t(`${role}_Details`)}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={doctor.profilePic} alt={doctor.name} />
                <AvatarFallback>{shortName(doctor.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{doctor.name}</h3>
                {role==="Doctor"?
                <p className="text-sm text-gray-500">{t(`Specializations.${doctor.specialization}`)}</p>
              :null}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium mb-2">{t(`Address`)}</p>
                {doctor.address.map((address, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{address}</p>
                ))}
              </div>
              <div >
                <p className="text-sm font-medium mb-2 ">{t(`Phone`)}</p>
                {doctor.phoneNumbers.map((phone, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{phone}</p>
                ))}
              </div>
              {doctor.gender?
              <div>
                <p className="text-sm font-medium mb-1">{t(`Gender`)}</p>
                <p className="text-sm text-gray-500">{t(`${doctor.gender}`)}</p>
              </div>
              :null}
               {doctor.dateOfBirth?
              <div>
                <p className="text-sm font-medium mb-1">{t(`Age`)}</p>
                <p className="text-sm text-gray-500">{getAge(doctor.dateOfBirth)}</p>
              </div>
:null}
            </div>
            {doctor.license?
            <div>
              <p className="text-sm font-medium mb-2">{t(`License`)}</p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex p-4">
                  {doctor.license.map((license, index) => (
                    <Image
                      width={500}
                      height={500}
                      key={index}
                      src={license}
                      alt={`License ${index + 1}`}
                      className="h-100 w-100 rounded object-contain mr-4 last:mr-0"
                      quality={100}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
:null}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center mb-2 justify-center">
              {doctor.state!==undefined && !doctor.state?
              <>
                <Button type="button" disabled={isAccepting||isDeclining} variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm" onClick={onDecline}>
                  {isDeclining?<Spinner />:t(`Decline`)}
                </Button>
                <Button type="button"  disabled={isAccepting||isDeclining} className="w-full sm:w-auto text-xs sm:text-sm " onClick={onAccept}>
                {isAccepting?<Spinner />:t(`Accept`)}
                </Button>
                </>
:null}
              </DialogFooter>
          </div>
        
        </ScrollArea>
        
      </DialogContent>
    </Dialog>
  )
}

