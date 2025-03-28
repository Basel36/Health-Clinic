'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SearchBar from "@/components/ui/SearchBar"
import { EndReservationValues } from '@/schema/DoctorReservation'
import { shortName } from '@/lib/utils'
import Pagination from '../Pagination'
import OrderDetails from './OrderDetails'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from "../Spinner"
import { searchOrders } from "@/lib/pharmacy/clientApi"
import { useTranslations } from 'next-intl'


interface IProps {
  orders: EndReservationValues[];
  currentPage: number
  totalPages: number
}
interface IOrder extends IProps {
  handlePageChange:(newPage:number)=>void
  isLoading:boolean
}

const OrdersHistoryData=({orders,currentPage,totalPages,handlePageChange,isLoading}:IOrder)=>{
  const t = useTranslations('Orders')
  
  return(
    <>
     <CardContent className="grid gap-4 sm:gap-8">
     {orders.length<=0?<div className="flex justify-center items-center">{t(`No_Orders`)}</div>
          :orders.map((order) => (
            <div key={order.id} className="flex items-center gap-2 sm:gap-4">
              <Avatar className="max-[350px]:hidden sm:h-9 sm:w-9">
                <AvatarImage src={order.patient.profilePic} alt="Avatar" />
                <AvatarFallback>{shortName(order.patient.name)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 sm:gap-1">
                <p className="text-xs sm:text-sm font-medium leading-none">{order.patient.name}</p>
                <p className="max-[400px]:hidden text-xs sm:text-sm text-muted-foreground">
                Phone: {order.patient.phoneNumbers.join(", ")}
                </p>
              </div>
              <div className="ltr:ml-auto rtl:mr-auto font-medium">
                <OrderDetails   order={order}/>
              </div>
            </div>
          ))}
        </CardContent>
      <Pagination currentPage={currentPage} totalPages={totalPages}  handlePageChange={handlePageChange} isLoading={isLoading} />

    </>
  )
}
export default function OrdersHistoryTable({ 
  orders, 
  currentPage, 
  totalPages
}: IProps) {
 const [searchTerm, setSearchTerm] = useState('')
 const [isSearching, setIsSearching] = useState(false)

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,orders:EndReservationValues[]}|null>(null)
  const router = useRouter()


  const handleSearch = async (page:number) => {
    setIsSearching(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsSearching(false);
      return
    }

    try {
      const res = await searchOrders(searchTerm, 7, page,'delivered')
      if (res.success === true) {
        console.log(res.data)
        setSearchResult({
          orders: res.data.data,
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
    
      router.push(`orders-history?page=${newPage}`)
    }
  }
  const t = useTranslations('Orders')


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
        <OrdersHistoryData 
          currentPage={currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isSearching} 
          orders={orders} 
          totalPages={totalPages} 
        />
      ) : (
        <OrdersHistoryData 
          currentPage={SearchResult.currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isSearching} 
          orders={SearchResult.orders} 
          totalPages={SearchResult.totalPages} 
        />
      )
    )}
    <Toaster />
      </Card>
  )
}