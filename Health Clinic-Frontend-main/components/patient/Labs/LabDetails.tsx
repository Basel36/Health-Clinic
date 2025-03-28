"use client"
import { useTranslations } from 'next-intl'
import { MapPin, Phone, TestTubeDiagonal, ShoppingCart,Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast, Toaster } from 'react-hot-toast'
import Image from 'next/image'
import { HandleTimeFormat } from '@/schema/Essentials'
import useCartStore from '@/lib/cart'
import { useState } from "react"
import Spinner from '@/components/Spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import Pagination from '@/components/Pagination'
import { useRouter } from 'next/navigation'
import { SearchLabTests } from '@/lib/patient/clientApi'
import { Input } from '@/components/ui/input'

interface Test {
  id: string;
  test: {
    id: string;
    name: string;
    cost: number;
  }
  preparations: string[];
  cost: string;
}

interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
  limit: string;
}

interface Lab {
  schedule: {
    days: ScheduleDay[];
  };
  id: string;
  profilePic: string;
  name: string;
  address: string[];
  rating?: number;
  reviews?: number;
  license: string[];
  phoneNumbers: string[];
  email: string;
}

interface IProps {
  Lab: Lab;
  Tests: Test[];
  currentPage: number;
  totalPages: number;
}interface IResult  {
  handlePageChange:(newPage:number)=>void
  isSearching:boolean
  Tests:Test[]
  currentPage: number;
  totalPages: number;
}

const LabTests=({ Tests, currentPage, handlePageChange, isSearching, totalPages }: IResult)=>{
  const { addToCart } = useCartStore()
  const t = useTranslations('patient.labs')
  const tcommon = useTranslations('common')

  const [isLoading, setIsLoading] = useState(false)
  const [testId,setTestID] = useState<string|null>(null)
  const handleAddToCart = async (testId: string) => {
    setIsLoading(true)
    const res = await addToCart({ testId })
    if (!res.success) {
      toast.error("You have added this test before.", {
        duration: 2000,
        position: 'bottom-center',
      })
    } else {
      toast.success("Test Added To Cart", {
        duration: 2000,
        position: 'bottom-center',
      })
    }
    setIsLoading(false)
  }

  
  return(
    <div className="flex flex-col space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Tests.length<=0?<div className="my-4 flex col-span-4 justify-center items-center">{t(`No_Tests`)}</div>
:Tests.map((test) => (
        <Card key={test.id} className="flex flex-col">
          <CardContent className="p-4 flex-1">
            <div className="flex items-center justify-center gap-2 mb-3 h-10">
              <TestTubeDiagonal className="h-5 w-5 flex-shrink-0 mt-1" />
              <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                {test.test.name}
              </h3>
            </div>
          
              <div className="space-y-2">
                <h4 className="font-medium">{t(`Preparations`)}</h4>
                <ScrollArea className="h-10 w-full pr-4">
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {test.preparations.length>0? test.preparations.map((prep, index) => (
                      <li key={index} className="text-muted-foreground">
                        {prep}
                      </li>
                    )):<li>{t(`None`)}</li>}
                  </ul>
                </ScrollArea>
              </div>
              <p className="text-2xl text-center font-bold mb-3">{`${test.cost} ${tcommon(`EGP`)}`}</p>
          
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full" 
              onClick={() => {
                setTestID(test.id)
                handleAddToCart(test.id)
              }} 
              disabled={isLoading}
            >
              {isLoading && testId === test.id ? (
                <Spinner />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 ltr:mr-2 rtl:ml-1-2" />
                  {t(`Add_to_Cart`)}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} isLoading={isSearching}/>

  </div>
  )
}

export default function LabDetails({ Lab, Tests,currentPage,totalPages }: IProps) {
 const [searchTerm, setSearchTerm] = useState('')
  const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,data:[]}|null>(null)
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter()
  const t = useTranslations('patient.labs')
  const tday = useTranslations('days')

 const handleSearch =async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSearching(true);
     if(searchTerm.trim().length>0){
  
       const res = await SearchLabTests(Lab.id,searchTerm,1,7);
      
  
      if (res.success === true) {
  
        console.log(res.data)
        setSearchResult({data:res.data.data,totalPages:res.data.paginationResult.numberOfPages,currentPage:res.data.paginationResult.currentPage})
        console.log(SearchResult)
      } else {
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 2000,
          position: 'bottom-center',
        }));
      }
    }
    else{
      toast.error("You have to enter text and choose what you search for", {
        duration: 2000,
        position: 'top-center',
      })
    }
    
    setIsSearching(false);
    
    }
    const handlePageChange = async(newPage: number) => {
      setIsSearching(true);
   if(SearchResult!==null&& SearchResult.totalPages>1){
        
        const res = await SearchLabTests(Lab.id,searchTerm,newPage,7);
  
          
        if (res.success === true) {
      
          setSearchResult({data:res.data.data,totalPages:res.data.paginationResult.numberOfPages,currentPage:res.data.paginationResult.currentPage})
        } else {
          res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
            duration: 2000,
            position: 'bottom-center',
          }));
        }
      }
      else{
          router.push(`${Lab.id}?testPage=${newPage}`);
        }
     
      setIsSearching(false);
    };
    const check=(e)=>{
      if(e.target.value.trim().length===0){
        setSearchResult(null)
        // router.refresh()
        // router.refresh(`doctor?page=${currentPage}&date=${currentDate}`);
      }
    
    }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
              <Image
                src={Lab.profilePic ? Lab.profilePic : "/placeholder.svg"}
                alt={Lab.name}
                priority
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{Lab.name}</h1>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold">{t(`Locations`)}</h2>
                {Lab.address.map((location, index) => (
                  <p key={index} className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 ltr:mr-2 rtl:ml-1" />
                    {location}
                  </p>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold">{t(`Contact_Information`)}</h2>
                {Lab.phoneNumbers.map((phone, index) => (
                  <p key={index} className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 ltr:mr-2 rtl:ml-1" />
                    {phone}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t(`Schedule`)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Lab.schedule.days.map(day => (
              <div key={day.day} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4">
                <p className="capitalize font-semibold">{tday(`${(day.day).toLowerCase()}`)}</p>
                <p>{HandleTimeFormat(day.startTime)} - {HandleTimeFormat(day.endTime)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    <h2 className="text-2xl font-semibold mb-4">{t(`Available_Tests`)}</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 sm:flex-row flex-col">
          <Input
            type="text"
            placeholder={`${t(`Search_Tests_Placeholder`)}...`}
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); check(e)}}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
            {t(`Search`)}
          </Button>
        </div>
      </form>

      {isSearching? <div className="flex justify-center items-center p-8">
        <Spinner invert />
      </div>
      : ( (SearchResult===null?<LabTests Tests={Tests}  totalPages={totalPages} currentPage={currentPage} isSearching={isSearching} handlePageChange={handlePageChange} />
     :<LabTests Tests={SearchResult.data}  totalPages={SearchResult.totalPages} currentPage={SearchResult.currentPage} isSearching={isSearching} handlePageChange={handlePageChange} />))}
 
      <Toaster />
    </div>
  )
}

