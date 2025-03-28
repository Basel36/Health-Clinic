'use client'

import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import SearchBar from "@/components/ui/SearchBar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { shortName } from "@/lib/utils"
import { EndReservationValues } from "@/schema/DoctorReservation"
import { useRouter } from 'next/navigation'
import ShowReservation from "./ShowReservation"
import Pagination from "../Pagination"
import { searchReservations } from "@/lib/doctor/clientApi"
import toast, { Toaster } from 'react-hot-toast'
import Spinner from "../Spinner"
import { useTranslations } from 'next-intl'

interface IProps {
  reservations: EndReservationValues[];
  currentPage: number;
  totalPages: number;
  currentDate?: string;
}
interface IReservations extends IProps {
  handlePageChange:(newPage:number)=>void
  isLoading:boolean
}
const ReservationsData=({reservations,currentPage,totalPages,handlePageChange,isLoading,currentDate}:IReservations)=>{
  const t = useTranslations('Reservations')

  return (
    <>
      <CardContent className="flex flex-col gap-4 sm:gap-8">
       {reservations.length<=0?<div className="flex justify-center items-center">{t(`No_Reservations`)}</div>:     reservations.map((reservation) => (
            <div key={reservation.id} className="flex items-center gap-2 sm:gap-4">
              <Avatar className="max-[350px]:hidden sm:h-9 sm:w-9">
                <AvatarImage src={reservation.patient.profilePic} alt="Avatar" />
                <AvatarFallback>{shortName(reservation.patient.name)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 sm:gap-1">
                <p className="text-xs sm:text-sm font-medium leading-none">{reservation.patient.name}</p>
                <p className="max-[400px]:hidden text-xs sm:text-sm text-muted-foreground">
                  Phone: {reservation.patient.phoneNumbers.join(", ")}
                </p>
              </div>
              <div className="ltr:ml-auto rtl:mr-auto font-medium">
                <ShowReservation size="sm" reservation={reservation}  consultaion={reservation.report}  currentPage={currentPage} currentDate={currentDate} RID={reservation.id}/>
              </div>
            </div>
          ))}
      </CardContent>
      <Pagination currentPage={currentPage} totalPages={totalPages}  handlePageChange={handlePageChange} isLoading={isLoading}/>

         </>
  )
}

export default function ReservationsTable({reservations, currentPage, totalPages, currentDate}: IProps) {
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false)
    const t = useTranslations('Reservations')


  const [searchTerm, setSearchTerm] = useState('')

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,reservations:EndReservationValues[]}|null>(null)



  const handleSearch = async (page:number) => {
    setIsSearching(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsSearching(false);
      return
    }

    try {
      const res = await searchReservations(searchTerm, 7, page)
      if (res.success === true) {
        console.log(res.data)
        setSearchResult({
          reservations: res.data.data,
          totalPages: res.data.paginationResult.numberOfPages,
          currentPage: res.data.paginationResult.currentPage
        })
      } else {
        res.message.forEach((err: string) => 
          toast.error(err || 'An unexpected error occurred.', {
            duration: 2000,
            position: 'bottom-center',
          })
        )
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSearching(false);
    }
  }

  const handlePageChange = async(newPage: number) => {
    if(SearchResult!==null&&SearchResult.totalPages>1){
      await handleSearch(newPage)
    }
    else{

      router.push(`doctor?page=${newPage}&date=${currentDate}`);
    }
  };

  const handleDateChange = (date: Date) => {
    const newDate = format(date, "yyyy-MM-dd");
    router.push(`doctor?page=${currentPage}&date=${newDate}`);
  };
  
  const getDayOptions = () => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      options.push({
        value: date.toISOString(),
        label: format(date, 'MMM d'),
        fullLabel: i === 0 ? `Today (${format(date, 'MMM d')})` : format(date, 'MMM d')
      });
    }
    return options;
  };

  const dayOptions = getDayOptions();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 sm:gap-4">
          <CardTitle className="text-base sm:text-lg">{t('title')}</CardTitle>
          <div className="flex items-center gap-2">
          <SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title='For_Patient'/>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent  className="w-auto p-0" align="end">
                <div className="flex flex-col">
                  {dayOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => handleDateChange(new Date(option.value))}
                    >
                      {option.fullLabel}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <div className="text-sm font-medium">
              {currentDate ? format(new Date(currentDate), 'MMM d') : 'No date selected'}
            </div>
          </div>
        </div>
      </CardHeader>
   
      {isSearching ? (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    ) : (
      SearchResult === null ? (
        <ReservationsData 
          currentPage={currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isSearching} 
          reservations={reservations} 
          totalPages={totalPages} 
        />
      ) : (
        <ReservationsData 
          currentPage={SearchResult.currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isSearching} 
          reservations={SearchResult.reservations} 
          totalPages={SearchResult.totalPages} 
        />
      )
    )}
    <Toaster />
    </Card>
  )
}