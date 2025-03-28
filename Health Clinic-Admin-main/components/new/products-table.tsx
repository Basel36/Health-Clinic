"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SearchBar from "../ui/SearchBar"
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {  AcceptProduct, DeclineProduct, SearchProducts } from "@/lib/admin/clientApi"
import Pagination from "../Pagination"
import { ProductModal } from "./product-modal"
import Spinner from "../Spinner"
import { useTranslations } from 'next-intl'
import { EditTestModal } from "./EditTestModal"
import { EditMedicineModal } from "./EditMedicineModal"

type type= "Medicine" | "Test" 


interface IProduct {
  id:string
  name: string
  category: string
  user: string
  photo?: string
  state: boolean
  cost?: number
}

interface IProps{
  type: type
  Products: IProduct[]
  currentPage:number
  totalPages:number
  state:string
}
interface IProductData extends IProps{
  selectedProduct:IProduct
  setSelectedProuct:(data:IProduct|null)=>void
  handlePageChange:(newPage:number)=>void
  handleAccept:()=>void
  handleDecline:()=>void
  handleDelete:()=>void
  isAccepting:boolean
  isDeleting:boolean

}
const ProductsData=({Products,selectedProduct,isAccepting,isDeleting,handleDelete,setSelectedProuct,handlePageChange,handleAccept,handleDecline,currentPage,totalPages,type}:IProductData)=>{
  const t = useTranslations('table')
  const [selectedEditMedicine, setSelectedEditMedicine] = useState<IProduct|null>(null)
  const [selectedEditTest, setSelectedEditTest] = useState<IProduct|null>(null)
  const [isOpen,setIsopen]=useState(false)
  return (
    <div className="overflow-x-auto">
      {Products.length<=0?<div className="flex justify-center items-center">{t(`No_${type}s`)}</div>:(
        <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">{t(`Name`)}</TableHead>
          <TableHead className="hidden sm:table-cell w-[40%]">{type==="Medicine"? t(`Category`):t(`user_email`)}</TableHead>
          <TableHead className="text-right w-[20%]">{t(`Actions`)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{type==="Medicine"?t(`Categories.${product.category}`):product.user}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" onClick={() => setSelectedProuct(product)}>
                {t(`view`)}
              </Button>
                <Button  variant="ghost" onClick={() => { type==="Medicine"?setSelectedEditMedicine(product): setSelectedEditTest(product)}}>
                  {t(`edit`)}
                </Button>
                
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <Toaster />
    </Table>
    {selectedEditTest&&(
      <EditTestModal isOpen={selectedEditTest} onClose={()=>setSelectedEditTest(null)} test={{name:selectedEditTest.name,id:selectedEditTest.id}} /> 
    )}
      {selectedEditMedicine&&(
      <EditMedicineModal isOpen={selectedEditMedicine} onClose={()=>setSelectedEditMedicine(null)} medicine={{name:selectedEditMedicine.name,id:selectedEditMedicine.id,category:selectedEditMedicine.category,cost:selectedEditMedicine.cost}} /> 
    )}
    {selectedProduct && (
    <ProductModal isAccepting={isAccepting} isDeleting={isDeleting} onDelete={handleDelete} type={type} product={selectedProduct} onClose={() => setSelectedProuct(null)} onAccept={handleAccept} onDecline={handleDecline} />
  )}
      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
      </>
)}
      </div>
  )
}

export function ProductsTable({Products,currentPage,totalPages,type,state}:IProps) {
  const [selectedProduct, setSelectedProuct] = useState<IProduct|null>(null)
const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,data:IProduct[]}|null>(null)



  const handleSearch = async (page:number) => {
    setIsLoading(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsLoading(false);
      return
    }

    try {
      
      const res = await SearchProducts(searchTerm, 7, page,`${type.toLowerCase()}s`,state)
      if (res.success === true) {
        console.log(res.data)
        setSearchResult({
          data: res.data.data,
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
      setIsLoading(false);
    }
  }
  // const filteredproducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  const handlePageChange=(newPage:number)=>{
    console.log(type)
    if(type==="Medicine"){
      if(state==="true"){

        router.push(`medicines?Apage=${newPage}`);
      }
      else if(state==="false"){

        router.push(`medicines?Ppage=${newPage}`);
      }

    }
    else   if(type==="Test"){
      if(state==="true"){

        router.push(`tests?Apage=${newPage}`);
      }
      else if(state==="false"){

        router.push(`tests?Ppage=${newPage}`);
      }

    }
  }

  const handleAccept=async()=>{
    setIsAccepting(true)
    const res = await AcceptProduct({id:selectedProduct.id,type:type.toLowerCase()})
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'top-center',
      });
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setIsAccepting(false)
    setSelectedProuct(null);

  }
  
  const handleDelete=async()=>{
    setIsDeleting(true)
    const res = await DeclineProduct({id:selectedProduct.id,type:type.toLowerCase()})
    if (res.success === true) {
      toast.success("Deleted", {
        duration: 2000,
        position: 'top-center',
      });
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setIsDeleting(false)

    setSelectedProuct(null);
  }
  


  const handleDecline=async()=>{
    setIsDeleting(true)

    const res = await DeclineProduct({id:selectedProduct.id,type:type.toLowerCase()})
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'top-center',
      });
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setIsDeleting(false)

    setSelectedProuct(null);
  }
  


  return (

    <div className="flex flex-col space-y-2">
  <div className="flex w-full justify-center sm:justify-end">

<SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title={`For_${type}`}/>
  </div>

{    isLoading ? (
      <div className="flex justify-center items-center p-8">
        <Spinner invert />
      </div>
    ) : (
      SearchResult === null ? (
        <ProductsData 
     Products={Products}
     currentPage={currentPage}
     totalPages={totalPages}
     handleAccept={handleAccept}
     handleDecline={handleDecline}
     handlePageChange={handlePageChange}
     type={type}
setSelectedProuct={setSelectedProuct}
     selectedProduct={selectedProduct}
     state={state}
     handleDelete={handleDelete}
isAccepting={isAccepting}
isDeleting={isDeleting}
        />
      ) : (
        <ProductsData
        isAccepting={isAccepting}
isDeleting={isDeleting}
        Products={SearchResult.data}
        currentPage={SearchResult.currentPage}
        totalPages={SearchResult.totalPages}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        handlePageChange={handlePageChange}
     type={type}
     setSelectedProuct={setSelectedProuct}
     selectedProduct={selectedProduct}
        state={state}
        handleDelete={handleDelete}
        />
      )
    )
  }
</div>
    )
}



