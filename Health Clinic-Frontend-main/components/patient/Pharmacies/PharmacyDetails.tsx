"use client"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, ShoppingCart ,Search} from 'lucide-react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import useCartStore from '@/lib/cart'
import Spinner from '@/components/Spinner'
import Pagination from '@/components/Pagination'
import { SearchPharmacyMedicine } from '@/lib/patient/clientApi'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface Medicine {
  id: string;
  medicine:{
    id: string;
    name: string;
    cost: string;
    photo: string;
  }
  stock: string;
  cost: string;
}

interface ScheduleDay {
  day: string;
  startTime: string;
  endTime: string;
  limit: string;
}

interface Pharmacy {
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
  Pharmacy: Pharmacy;
  Medicines: Medicine[];
  currentPage: number;
  totalPages: number;
}


interface IResult  {
  handlePageChange:(newPage:number)=>void
  Medicines:Medicine[]
  currentPage: number;
  totalPages: number;
  isSearching:boolean
}


const PharmacyMedicines=( {Medicines, currentPage, handlePageChange, totalPages ,isSearching}: IResult)=>{
  const {  addToCart } = useCartStore();
  const [medicineID,setMedicineID] = useState<string|null>(null)
  const t = useTranslations('patient.pharmacies')
  const tcommon = useTranslations('common')
  console.log(Medicines)
  const [isLoading, setIsLoading] = useState(false)
  const handleAddToCart = async (medicineId: string) => {
    setIsLoading(true)
    
    const res = await addToCart({ medicineId });
    if (!res.success) {
      toast.error("Something went wrong! Try Again Later", {
        duration: 2000,
        position: 'bottom-center',
      });
    } else {
      toast.success("Medicine Added To Cart", {
        duration: 2000,
        position: 'bottom-center',
      });
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col item-center space-y-2">
  <div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {Medicines.length <= 0 ? (
    <div className="my-4 flex col-span-4 justify-center items-center">
      {t(`No Medicines`)}
    </div>
  ) : (
    Medicines.map((medicine) => (
      <Card key={medicine.id} className="h-full flex flex-col">
        <CardContent className="p-4 flex-1 flex flex-col items-center space-y-2">
          <div className="relative w-full aspect-square">
            <Image 
              src={medicine.medicine.photo} 
              alt={medicine.medicine.name} 
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          <div className="flex items-center gap-2">
            <medicineTubeDiagonal size={24} />
            <h3 className="text-lg font-semibold">{medicine.medicine.name}</h3>
          </div>
          <p className="text-2xl font-bold">{`${medicine.medicine.cost} ${tcommon(`EGP`)}`}</p>
          {Number(medicine.stock) <= 5 && Number(medicine.stock) > 0 ? (
            <span className="w-full flex justify-center items-center text-red-400">
              {t(`Last_in_Stock`, {stock: medicine.stock})}
            </span>
          ) : null}
        </CardContent>
        <CardFooter className="mt-auto">
          <Button 
            className="w-full" 
            disabled={isLoading || Number(medicine.stock) <= 0} 
            onClick={() => {
              setMedicineID(medicine.id);
              handleAddToCart(medicine.id);
            }}
          >
            {isLoading && medicine.id === medicineID ? (
              <Spinner />
            ) : (
              Number(medicine.stock) <= 0 ? (
                t(`Out_Of_Stock`)
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
                  {t(`Add_to_Cart`)}
                </>
              )
            )}
          </Button>
        </CardFooter>
      </Card>
    ))
  )}
</div>


      </div>
     <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} isLoading={isSearching}/>

      </div>

  )
}

export default function PharmacyDetails({Pharmacy, Medicines,currentPage,totalPages}: 
  IProps) {
    const [isSearching, setIsSearching] = useState(false);
    const t = useTranslations('patient.pharmacies')

const [searchTerm, setSearchTerm] = useState('')
  const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,data:[]}|null>(null)

  const router = useRouter()



  const handleSearch =async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSearching(true);
     if(searchTerm.trim().length>0){
  
       const res = await SearchPharmacyMedicine(Pharmacy.id,searchTerm,1,7);
      
  
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
        
        const res = await SearchPharmacyMedicine(Pharmacy.id,searchTerm,newPage,8);
  
          
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
          router.push(`${Pharmacy.id}?medicinePage=${newPage}`);
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
                src={Pharmacy.profilePic ? Pharmacy.profilePic : "/placeholder.svg"}
                alt={Pharmacy.name}
                priority
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{Pharmacy.name}</h1>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold">{t(`Locations`)}</h2>
                {Pharmacy.address.map((location, index) => (
                  <p key={index} className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    {location}
                  </p>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-semibold">{t(`Contact_Information`)}</h2>
                {Pharmacy.phoneNumbers.map((phone, index) => (
                  <p key={index} className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    {phone}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mb-4">{t(`Available_Medcines`)}</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 sm:flex-row flex-col">
          <Input
            type="text"
            placeholder={t(`Search_Medcines_Placeholder`)}
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
      : ( (SearchResult===null?<PharmacyMedicines Medicines={Medicines}  totalPages={totalPages} currentPage={currentPage} isSearching={isSearching} handlePageChange={handlePageChange} />
     :<PharmacyMedicines Medicines={SearchResult.data}  totalPages={SearchResult.totalPages} currentPage={SearchResult.currentPage} isSearching={isSearching} handlePageChange={handlePageChange} />))}

      <Toaster />
    </div>
  )
}