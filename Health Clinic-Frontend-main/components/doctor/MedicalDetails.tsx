
    "use client"
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    } from "@/components/ui/dialog"
    import {
      Avatar,
      AvatarFallback,
      AvatarImage,
    } from "@/components/ui/avatar"
    import { Button } from "@/components/ui/button"
    import { File } from "lucide-react"
    import { ScrollArea } from "@/components/ui/scroll-area"
import { EndReservationValues } from "@/schema/DoctorReservation"
import { getAge } from "@/utils/utils"
import { shortName } from "@/lib/utils"
import Link from 'next/link'
import { useTranslations } from 'next-intl'
    
interface IProps {
  reservation: EndReservationValues;

}

    export default function MedicalDetails({reservation}:IProps) {

  const t = useTranslations('Reservations')
    
console.log(reservation)
    
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{t(`View_Details`)}</Button>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-[425px] max-h-[80vh] p-0">
            <DialogHeader className="px-4 pt-5 pb-4">
              <DialogTitle className="text-lg sm:text-xl">{t(`Details.title`)}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(80vh-7rem)] px-4 pb-6">
              <div className="grid gap-4">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                          <AvatarImage src={reservation.patient.profilePic} alt="Patient" />
                <AvatarFallback>{shortName(reservation.patient.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-lg sm:text-2xl font-bold">{reservation.patient.name}</h2>
                  <p className="text-sm text-gray-500">{`${t(`Details.PAge`)}: ${getAge(reservation.patient.dateOfBirth)}`}</p>
                    
                  </div>
                </div>
                <div>
                <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.FSBP`)}</h3>
                <div className="flex flex-wrap gap-2">
                   
                         {reservation.report.results.length>0? reservation.report.results.map((result,index)=>
 <Link href={result} key={index} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm h-9 rounded-md px-3" >
 <File className="h-3 w-3 sm:h-4 sm:w-4 ltr:mr-1  rtl:ml-1  ltr:sm:mr-2" />
 {`${t(`Details.View_File`)} ${index}`}
</Link>
                    ):t(`Details.No_Files`)}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.diagnose.title`)}</h3>
                  <p className="ml-1 text-sm">{reservation.report.diagnose ? reservation.report.diagnose  : t(`Details.diagnose.No_Diagnosis`)}</p>
                  
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.Medicine.Prescriptions`)}</h3>
                  <ul className="space-y-2">
                    {reservation.report.medicine.length >0 ? (reservation.report.medicine.map((medicine, index) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <span>{medicine.name}</span>
                        <span className="text-gray-500">{medicine.dose}</span>
                      </li>
                    ))): <p className="ml-1 text-sm">{t(`Details.Medicine.No_Medicines`)}</p>}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-sm sm:text-lg font-semibold">{t(`Details.Medicine.Tests.title`)}</h3>
                  <ul className="space-y-1">
                    {reservation.report.requestedTests.length >0 ?(reservation.report.requestedTests.map((test, index) => (
                      <li key={index} className="text-sm">{test}</li>
                    ))):<p className="ml-1 text-sm">{t(`Details.Medicine.Tests.No_Tests`)}</p>}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )
    }