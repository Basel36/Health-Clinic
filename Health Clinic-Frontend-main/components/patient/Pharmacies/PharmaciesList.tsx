"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'
import { shortName } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import toast, { Toaster } from 'react-hot-toast'
import { SearchForMedicine, SearchForPharmacy } from '@/lib/patient/clientApi'
import useCartStore from '@/lib/cart'
import { ShoppingCart } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Spinner from '@/components/Spinner'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Pharmacy {
  id: string
  name: string
  profilePic: string
  phoneNumbers: string[]
}

interface Medicine {
  id: string;
  medicine:{
    id: string;
    name: string;
    photo: string;
    cost: string;
  }
  stock: string;
  cost: string;
  pharmacy:Pharmacy
}

interface IProps {
  currentPage: number;
  totalPages: number;
  Pharmacies: Pharmacy[];
}

interface IPharmacyData extends IProps {
  handlePageChange:(newPage:number)=>void
  isSearching:boolean
}
type searchT="Pharmacy"|"Medicine"


interface IResult  {
  handlePageChange:(newPage:number)=>void
  isSearching:boolean
  Medicines:Medicine[]
  currentPage: number;
  totalPages: number;
}




const PharmaciesData=({Pharmacies,currentPage,totalPages,handlePageChange,isSearching}:IPharmacyData) =>{
  const t = useTranslations('patient.pharmacies')
  return(

  <>
   
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Pharmacies.length<=0?<div className="my-4 flex col-span-4 justify-center items-center">{t(`No_Pharmacies`)}</div>
        :Pharmacies.map((pharmacy) => (
          <Card key={pharmacy.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative w-16 h-16">
                  {/* <Image
                    src={lab.profilePic||""}
                    alt={lab.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  /> */}
                      <Avatar className="relative w-16 h-16">
                  <AvatarImage src={pharmacy.profilePic} alt={pharmacy.name} />
                  <AvatarFallback>{shortName(pharmacy.name)}</AvatarFallback>
                </Avatar>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{pharmacy.name}</h2>
                  <p className="text-sm text-gray-500">{pharmacy.phoneNumbers[0]}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href={`/patient/pharmacies/${pharmacy.id}`} className="w-full">
                <Button className="w-full">{t(`View_Details`)}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
     <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} isLoading={isSearching}/>
  </>
  )

 }
 const Results = ({ Medicines, currentPage, handlePageChange, isSearching, totalPages }: IResult) => {
  const { addToCart } = useCartStore()
const[isLoading,setIsLoading]=useState(false)
const [medicineID,setMedicineID] = useState<string|null>(null)
const t = useTranslations('patient.pharmacies')
const tcommon = useTranslations('common')
console.log(Medicines)
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
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {Medicines.length <= 0 ? (
    <div className="my-4 flex col-span-4 justify-center items-center">
      {t(`No_Medicines`)}
    </div>
  ) : (
    Medicines.map((medicine) => (
      <Card key={medicine.id} className="flex flex-col h-full">
        <CardContent className="p-4 flex-1 flex flex-col space-y-4">
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
          <p className="text-2xl font-bold">
            {`${medicine.medicine.cost} ${tcommon(`EGP`)}`}
          </p>
          {Number(medicine.stock) <= 5 && Number(medicine.stock) > 0 ? (
            <span className="w-full flex justify-center items-center text-red-400">
              {t(`Last_in_Stock`, {stock: medicine.stock})}
            </span>
          ) : null}
        </CardContent>
        
        <CardFooter className="mt-auto p-4 pt-0 flex flex-col space-y-4">
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
            ) : Number(medicine.stock) <= 0 ? (
              t(`Out_Of_Stock`)
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
                {t(`Add_to_Cart`)}
              </>
            )}
          </Button>

          <Link
            href={`/patient/pharmacies/${medicine.pharmacy.id}`}
            className="flex items-center gap-2 w-full no-underline pt-2 border-t hover:text-teal-500"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={medicine.pharmacy.profilePic} 
                alt={medicine.pharmacy.name} 
              />
              <AvatarFallback>
                {shortName(medicine.pharmacy.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{medicine.pharmacy.name}</span>
          </Link>
        </CardFooter>
      </Card>
    ))
  )}
</div>


     <Pagination currentPage={currentPage} handlePageChange={handlePageChange} totalPages={totalPages} isLoading={isSearching}/>

    </>
  )
}

export default function PharmaciesList({currentPage,totalPages,Pharmacies}:IProps) {
const [searchTerm, setSearchTerm] = useState('')
  const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,data:[],type:searchT}|null>(null)
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<searchT>('')
  const router = useRouter()

  const t = useTranslations('patient.pharmacies')

  const handleSearch =async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true);
   if(searchTerm.trim().length>0&&searchType!==''){
    let res;
    if(searchType==='Pharmacy'){

      res = await SearchForPharmacy(searchTerm,1);
    }
    else if(searchType==='Medicine'){
        res = await SearchForMedicine(searchTerm,1);
      
    }
    if (res.success === true) {
      // toast.success(res.message, {
      //   duration: 2000,
      //   position: 'top-center',
      // });
      console.log(res.data)
      setSearchResult({data:res.data.data,totalPages:res.data.paginationResult.numberOfPages,currentPage:res.data.paginationResult.currentPage,type:searchType})
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
 if(SearchResult!==null&& SearchResult.totalPages>1&&searchType!==''){
      let res;
      if(searchType==='Pharmacy'){

         res = await SearchForPharmacy(searchTerm,newPage);
        }
        else if(searchType==='Medicine'){
        res = await SearchForMedicine(searchTerm,newPage);
        
      }
      if (res.success === true) {
    
        setSearchResult({data:res.data.data,totalPages:res.data.paginationResult.numberOfPages,currentPage:res.data.paginationResult.currentPage,type:searchType})
      } else {
        res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
          duration: 2000,
          position: 'bottom-center',
        }));
      }
    }
    else{

      router.push(`pharmacies?page=${newPage}`);
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
      <h1 className="text-3xl font-bold text-center mb-8">{t(`Our_Pharmacies`)}</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 sm:flex-row flex-col">
          <Input
            type="text"
            placeholder={`${t(`Search_Placeholder`)}...`}
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); check(e)}}
            className="flex-grow"
          />
            <Select  value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="sm:w-1/4 text-sm py-2 ">
                    <SelectValue placeholder={t(`Search_in`)} />

                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem  value="Pharmacy">{t(`Pharmacies`)}</SelectItem>
                    <SelectItem value="Medicine">{t(`Medicines`)}</SelectItem>
                  </SelectContent>
                </Select>
          <Button type="submit">
            <Search className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
            {t(`Search`)}
          </Button>
        </div>
      </form>
      {isSearching ? (
      <div className="flex justify-center items-center p-8">
        <Spinner invert />
      </div>
    ) : (SearchResult===null?<PharmaciesData Pharmacies={Pharmacies} currentPage={currentPage} handlePageChange={handlePageChange} isSearching={isSearching} totalPages={totalPages} />
:(SearchResult.type==="Pharmacy"?<PharmaciesData Pharmacies={SearchResult.data} currentPage={SearchResult.currentPage} handlePageChange={handlePageChange} isSearching={isSearching} totalPages={SearchResult.totalPages} />
:(SearchResult.type==="Medicine"?<Results Medicines={SearchResult.data} currentPage={SearchResult.currentPage} handlePageChange={handlePageChange} isSearching={isSearching} totalPages={SearchResult.totalPages} />:null)))}
    <Toaster />
  
    </div>
  )
}