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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { EndReservationValues } from "@/schema/DoctorReservation"
import { getAge } from "@/utils/utils"
import { shortName } from "@/lib/utils"
import Link from "next/link"
import { useTranslations } from 'next-intl'

interface IProps {
  reservation: EndReservationValues;
}

export default function ReservationDetails({ reservation }: IProps) {
  const t = useTranslations('Reservations')

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
          <div className="space-y-6 p-1">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={reservation.patient.profilePic} alt="Patient" />
                <AvatarFallback>{shortName(reservation.patient.name)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-bold">{reservation.patient.name}</h2>
                <p className="text-sm text-muted-foreground">{`${t('Details.PAge')}: ${getAge(reservation.patient.dateOfBirth)}`}</p>
              </div>
            </div>
         
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t(`Details.Test_Results`)}</h3>
              {reservation.requestedTests.map((test, testIndex) => (
                <div key={testIndex} className="space-y-2">
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                  {test.testResult.length > 0 ? (
                    <>
                      <div className="flex justify-center mt-2">
                      <h4 className=" text-sm font-medium">{test.testDetails.test.name}</h4>
                      </div>
                      <div className="flex w-max space-x-4 p-4">
                        {test.testResult.map((result, index) => (
                          <Link
                            href={result}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="flex flex-col items-center space-y-2 rounded-md border p-4 hover:bg-accent transition-colors"
                          >
                            <div className="rounded-full bg-primary/10 p-2">
                              <File className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-sm font-medium"> {`${t('Details.View_File')} ${index + 1}`}</span>
                          </Link>
                        ))}
                      </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground italic p-4">{t(`Details.No_Results`)}</p>
                    )}
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
              ))}
            </div>
          </div>
          
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}