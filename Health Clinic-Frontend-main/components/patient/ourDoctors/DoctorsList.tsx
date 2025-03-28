"use client"
import { toast, Toaster } from 'react-hot-toast'
import {  MapPin,Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Pagination from '@/components/Pagination'
import { Doctors_Specializations } from '@/schema/Essentials'
import Spinner from '@/components/Spinner'
import { useTranslations } from 'next-intl'
import { SearchForActor } from '@/lib/patient/clientApi'

interface Doctor {
  id: string;
  profilePic: string;
  name: string;
  specialization: string;
  address: string[];
  rating?: number;
  reviews?: number;
}

interface IProps {
  currentPage: number;
  totalPages: number;
  Doctors: Doctor[];
 searchParams?:{name:string,spec:string}
  searchResult?: {currentPage:number,totalPages:number,Doctors:Doctor[]}|null
}
interface IDoctorsData extends IProps  {
  handlePageChange:(newPage:number)=>void
  isLoading:boolean

}


const DoctorsData=({Doctors,currentPage,totalPages,handlePageChange,isLoading}:IDoctorsData)=>{
  const t = useTranslations('patient.doctors')
  const tspec = useTranslations('Specializations')

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Doctors.length<=0?<div className="my-4 flex col-span-4 justify-center items-center">{t(`No_Doctors`)}</div>
        :Doctors.map((doctor) => (
          <Card key={doctor.id} className="flex flex-col h-[500px]">
            <CardContent className="p-0 flex-grow">
              <div className="relative w-full h-48">
                <Image
                  src={doctor.profilePic}
                  alt={doctor.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{`${t(`Dr`)} ${doctor.name}`}</h2>
                <p className="text-sm text-gray-500">{tspec(`${doctor.specialization}`)}</p>
                {/* <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{doctor.rating || 'N/A'}</span>
                  <span className="ml-1 text-sm text-gray-500">({doctor.reviews || 0} reviews)</span>
                </div> */}
                <Accordion type="single" collapsible className="w-full mt-4">
                  <AccordionItem value="address">
                    <AccordionTrigger className="text-sm py-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {t(`Locations`)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {doctor.address.map((address, index) => (
                         <div key={index} className="flex items-center mt-2">
                         <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-sm">{address}</span>
                       </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={`/patient/our-doctors/${doctor.id}`} className="w-full">
                <Button className="w-full">{t(`View_Details`)}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} isLoading={isLoading} />
    </>
  )
}


export default function DoctorsList({ Doctors, currentPage, totalPages,searchParams:{name='',spec=''},searchResult=null }: IProps) {
  const [searchTerm, setSearchTerm] = useState(name)
  const [isLoading, setIsLoading] = useState(false);
  const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,Doctors:[]}|null>(searchResult)
  
  const [specialization, setSpecialization] = useState(spec)
  const router = useRouter()
  const t = useTranslations('patient.doctors')
  const tspec = useTranslations('Specializations')


 const handleSearch =async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true);
      console.log(searchTerm,specialization)
     if(searchTerm.trim().length>0||specialization.trim().length>0){
       let res;
       if(searchTerm.trim().length>0&&specialization.trim().length>0){
         
         res = await SearchForActor(`${searchTerm},${specialization}`,'doctor',1);
        }
        else if(searchTerm.trim().length>0){
            res = await SearchForActor(`${searchTerm}`,'doctor',1);
          }
          else if(specialization.length>0){
            res = await SearchForActor(`${specialization}`,'doctor',1);
      
          }
      if (res&&res.success === true) {
  
        setSearchResult({Doctors:res.data.data,totalPages:res.data.paginationResult.numberOfPages,currentPage:res.data.paginationResult.currentPage})
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
    
    setIsLoading(false);
    
    }
    const handlePageChange = async(newPage: number) => {
      setIsLoading(true);
   if(SearchResult!==null&& SearchResult.totalPages>1){
        let res;
    if(searchTerm.trim().length>0&&specialization.trim().length>0){
         
      res = await SearchForActor(`${searchTerm},${specialization}`,'doctor',newPage);
     }
     else if(searchTerm.trim().length>0){
         res = await SearchForActor(`${searchTerm}`,'doctor',newPage);
       }
       else if(specialization.length>0){
         res = await SearchForActor(`${specialization}`,'doctor',newPage);
   
       }
          
        if (res&&res.success === true) {
      
          setSearchResult({Doctors:res.data.data,totalPages:res.data.paginationResult.numberOfPages,currentPage:res.data.paginationResult.currentPage})
        } else {
          res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
            duration: 2000,
            position: 'bottom-center',
          }));
        }
      }
      else{
        if(name.trim().length>0&&specialization.length>0){

          router.push(`our-doctors?name=${searchTerm}&specialization=${specialization}&resultsPage=${newPage}`)
        }
        else if(name.trim().length>0){
          router.push(`our-doctors?name=${searchTerm}&resultsPage=${newPage}`)
        }
        else if(specialization.length>0){
          router.push(`our-doctors?specialization=${specialization}&resultsPage=${newPage}`)
    
        }
        else{
          router.push(`our-doctors?page=${newPage}`);
        }
        }
     
      setIsLoading(false);
    };
    const check=(e)=>{
      if(e.target.value.trim().length===0&&specialization.trim().length<=0){
        setSearchResult(null)
        // router.refresh()
        // router.refresh(`doctor?page=${currentPage}&date=${currentDate}`);
      }
    
    }
  // const handleSearch =async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true);
  //   if(searchTerm.trim().length>0&&specialization.length>0){

  //     router.push(`our-doctors?name=${searchTerm}&specialization=${specialization}`)
  //   }
  //   else if(searchTerm.trim().length>0){
  //     router.push(`our-doctors?name=${searchTerm}`)
  //   }
  //   else if(specialization.length>0){
  //     router.push(`our-doctors?specialization=${specialization}`)

  //   }

  // setIsLoading(false);

  // }

      // const handlePageChange = (newPage: number) => {
      //   if(name.trim().length>0&&specialization.length>0){

      //     router.push(`our-doctors?name=${searchTerm}&specialization=${specialization}&resultsPage=${newPage}`)
      //   }
      //   else if(name.trim().length>0){
      //     router.push(`our-doctors?name=${searchTerm}&resultsPage=${newPage}`)
      //   }
      //   else if(specialization.length>0){
      //     router.push(`our-doctors?specialization=${specialization}&resultsPage=${newPage}`)
    
      //   }
      //   else{

      //     router.push(`our-doctors?page=${newPage}`);
      //   }
      //     };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{t(`Our_Doctors`)}</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={`${t(`Search_Placeholder`)}...`}
            value={searchTerm}
            onChange={(e) => {check(e); setSearchTerm(e.target.value)}}
            className="flex-grow"
          />
            <Select  value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger className="w-full text-sm py-2 ">
                    <SelectValue placeholder={t(`Select_Specialization`)} />
                  </SelectTrigger>
                  <SelectContent>
                    {Doctors_Specializations.map(spec => (

                    <SelectItem  key={spec} value={`${spec}`}>{tspec(`${spec}`)}</SelectItem>
                    ))}
                 
                  </SelectContent>
                </Select>
          <Button type="submit">
            <Search className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
            {t(`Search`)}
          </Button>
        </div>
      </form>
      
{isLoading? <div className="flex justify-center items-center p-8">
        <Spinner invert />
      </div>
      : SearchResult===null?<DoctorsData Doctors={Doctors} totalPages={totalPages} currentPage={currentPage} isLoading={isLoading} handlePageChange={handlePageChange} />
     :<DoctorsData Doctors={SearchResult.Doctors} totalPages={SearchResult.totalPages} currentPage={SearchResult.currentPage} isLoading={isLoading} handlePageChange={handlePageChange} />}
     <Toaster />
    </div>
  )
}