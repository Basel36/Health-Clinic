'use client'

import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SearchBar from "@/components/ui/SearchBar"
import { EndReservationValues } from '@/schema/DoctorReservation'
import { shortName } from '@/lib/utils'
import ReservationDetails from './ReservationDetails'
import Pagination from '../Pagination'
import toast, { Toaster } from 'react-hot-toast'
import { useState } from "react"
import { searchReservationsHistory } from '@/lib/lab/clientApi'
import Spinner from '../Spinner'
import { useTranslations } from 'next-intl'

interface IProps  {
  reservations: EndReservationValues[];
  currentPage: number
  totalPages: number
}
interface IReservations extends IProps {
  handlePageChange:(newPage:number)=>void
  isLoading:boolean
}

const ReservationsData=({reservations,currentPage,totalPages,handlePageChange,isLoading}:IReservations)=>{
  const t = useTranslations('Reservations')

  return(
    <>
            <CardContent className="grid gap-4 sm:gap-8">
          {reservations.length<=0?<div className="flex justify-center items-center">{t(`No_Reservations`)}</div>
          :reservations.map((reservation) => (
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
                <ReservationDetails  reservation={reservation}/>
              </div>
            </div>
          ))}
        </CardContent>
      <Pagination currentPage={currentPage} totalPages={totalPages}  handlePageChange={handlePageChange} isLoading={isLoading} />

    </>
  )
}

export default function ReservationsHistoryTable({ 
  reservations, 
  currentPage, 
  totalPages
}: IProps) {
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
      const res = await searchReservationsHistory(searchTerm, 7, page)
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
      router.push(`reservations-history?page=${newPage}`)
    }
  }

  return (
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-2 sm:gap-0">
            <CardTitle className="text-base sm:text-lg">{t(`History_title`)}</CardTitle>
          <SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title='For_Patient'/>

          </div>
        </CardHeader>

        {isSearching ? (
      <div className="flex justify-center items-center p-8">
        <Spinner invert />
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