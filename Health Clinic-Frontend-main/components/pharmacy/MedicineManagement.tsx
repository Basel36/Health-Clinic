'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PlusCircle, Edit, Trash2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from '../Spinner'
import Image from 'next/image'
import { FormDataHandler } from '@/utils/AuthHandlers'
import { AddMedicine, DeleteMedicine, RequestMedicine, searchMedicines, UpdateStock } from '@/lib/pharmacy/clientApi'
import { IMedicine, IMedicineDetails } from '@/interfaces/Phamacy'
import { MedicineSchema, MedicineValue, NewMedicineSchema, NewMedicineValue } from '@/schema/Pharmacy'
import SearchBar from '../ui/SearchBar'
import Pagination from '../Pagination'
import { useTranslations } from 'next-intl'



interface IProps {
  medicines: IMedicine[];
  currentPage: number;
  totalPages: number;
  availableMedicines: IMedicineDetails[];
}

interface IMedicinesData extends IProps{
  medicineForm :object
  isLoading: boolean
  setMedicineName: (name:string)=>void
  setIsEditOpen: (value:boolean)=>void
  setIsDeleteOpen: (value:boolean)=>void
  handlePageChange:(newPage:number)=>void

}


const MedicinesData=({medicines,medicineForm,isLoading,setMedicineName,setIsEditOpen,setIsDeleteOpen,currentPage,handlePageChange,totalPages}:IMedicinesData)=>{
  const t = useTranslations('Medicines')
  const tcommon = useTranslations('common')

return(
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {medicines.length<=0?<div className="flex justify-center items-center">{t(`none`)}</div>
          :medicines.map((medicine) => (
            <div key={medicine.id} className="bg-card text-card-foreground rounded-lg  shadow-md transition-all hover:shadow-lg border border-border rounded-md">
              <div className="mb-4 relative w-full h-52">
                <Image 
                  src={medicine.medicine.photo} 
                  alt={medicine.medicine.name} 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-4 pt-0">
                
           
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{medicine.medicine.name}</h2>
                <div className="flex space-x-1">
                  <Button
                    disabled={isLoading}
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      medicineForm.reset({
                        id: medicine.id,
                        stock: medicine.stock,
                      })
                      setMedicineName(medicine.medicine.name);
                      setIsEditOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    disabled={isLoading}
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      medicineForm.reset({
                        id: medicine.id,
                      })
                      setMedicineName(medicine.medicine.name);
                      setIsDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
           
              <p className="text-xl font-bold text-primary mb-2">{`${medicine.medicine.cost} ${tcommon(`EGP`)}`}</p>
              <p className="text-sm text-muted-foreground"> {`${t(`Add_Med.stock`)}: ${medicine.stock}`}</p>
            </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages}  handlePageChange={handlePageChange} isLoading={isLoading}/>
  
  </>
)
}

export default function MedicineManagement({medicines, currentPage, totalPages, availableMedicines}: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [medicineName, setMedicineName] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const t = useTranslations('Medicines')

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,medicines:IMedicine[]}|null>(null)



  const handleSearch = async (page:number) => {
    setIsSearching(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsSearching(false);
      return
    }

    try {
      const res = await searchMedicines(searchTerm, 7, page)
      if (res.success === true) {
        console.log(res.data)
        setSearchResult({
          medicines: res.data.data,
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
  const handleEditModalOpen = () => {
    setIsEditOpen(!isEditOpen);
    setMedicineName('')
    if(!isEditOpen){
      resetMedicineForm();
    }
  }

const resetMedicineForm=()=>{
  medicineForm.reset({
    id: "",
    stock: "",
   
  })
}
  const handleAddModalOpen = () => {
    setIsAddOpen(!isAddOpen);
    setMedicineName('')
    if(!isAddOpen){
      resetMedicineForm();
    }
  }

  const handleDeleteModal = () => {
    setIsDeleteOpen(!isDeleteOpen);
    setMedicineName('')
    if(!isDeleteOpen){
      resetMedicineForm();
    }
  }

  const medicineForm = useForm<MedicineValue>({
    resolver: zodResolver(MedicineSchema),
    defaultValues: {
      id: "",
      stock: "",
    },
  })

  const NewMedicineForm = useForm<NewMedicineValue>({
    resolver: zodResolver(NewMedicineSchema),
    defaultValues: {
      name: "",
      cost: "",
      photo:null,
    },
  })



  async function onSubmit(data: MedicineValue) {
    setIsLoading(true);

    const object ={medicine:data.id,stock:data.stock}
    console.log(object)
    const res = await AddMedicine(object)
    if (res.success ===true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
      router.refresh();
      
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    handleAddModalOpen();
    setIsLoading(false);
  }

  const handleUpdateSubmit = async (data: MedicineValue) => {
    setIsLoading(true);

    const res = await UpdateStock({stock:data.stock},data.id)
    if (res.success ===true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
      router.refresh();
      
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    handleEditModalOpen();
    setIsLoading(false);
  }

  const handlePageChange = async(newPage: number) => {
    if(SearchResult!==null&&SearchResult.totalPages>1){
      await handleSearch(newPage)
    }
    else{

      router.push(`/lab/my-medicines?page=${newPage}`);
    }
  };

  const handleDeleteMedicine = async() => {
    setIsLoading(true);
    const {id} = medicineForm.getValues();
    const res = await DeleteMedicine(id);
    router.refresh();
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
    handleDeleteModal();
  }

  const handleRequestMedicine = async(data:NewMedicineValue) => {
    setIsLoading(true);
    const formData=FormDataHandler(data);
          const res = await RequestMedicine(formData);
          if (res.success ===true) {
            toast.success(res.message, {
              duration: 2000,
              position: 'bottom-center',
            })
            router.refresh();
          } else {
            res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
              duration: 2000,
              position: 'bottom-center',
            }))
          }
          setIsLoading(false);
      setIsRequestOpen(false);
    }
  
  

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{t(`title`)}</h1>
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading} variant="outline" size="sm" className="w-full sm:w-auto mb-4 sm:mb-0">
                <Send className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                {t(`Request_Med.title`)}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t(`Request_Med.title`)}</DialogTitle>
                <DialogDescription>
                {t(`Request_Med.description`)}
                </DialogDescription>
              </DialogHeader>
              <Form {...NewMedicineForm}>
              <form onSubmit={NewMedicineForm.handleSubmit(handleRequestMedicine)} className="space-y-8">
              <FormField
                  control={NewMedicineForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`Request_Med.Med_Name`)}</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             
                <FormField
                  control={NewMedicineForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`Request_Med.cost`)}</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={NewMedicineForm.control}
                  
                name="photo"
                  render={({ field}) => (
                    <FormItem>
              <FormLabel  className="cursor-pointer text-sm text-primary hover:underline">
              {t(`Request_Med.upload_photo`)}
          </FormLabel>
              <FormControl>
                <Input
                disabled={isLoading}
                  type="file"
                  accept="image/*"
                  id="photo"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0])
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
                  )}
                />
            
                <DialogFooter className="gap-1">
                  <Button disabled={isLoading} type="button" variant="outline" onClick={() => {
                    setIsRequestOpen(false)
                  }}>
                    {t(`Request_Med.Cancel`)}
                  </Button>
                  <Button disabled={isLoading} type="submit">{isLoading?<Spinner/>:t(`Request_Med.submit`)}</Button>
                </DialogFooter>
              </form>
            </Form>
        
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col justify-center items-center mb-4  space-y-4  border-grey-400">
<span className="border-t-2 border-grey-400 items-center  w-full"></span>
<div className="flex justify-between items-center w-full">
<Dialog open={isAddOpen} onOpenChange={handleAddModalOpen}>
          <DialogTrigger asChild>
            <Button disabled={isLoading} className="w-full sm:w-auto">
              <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
              {t(`Add_Med.title`)}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t(`Add_Med.title`)}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <Form {...medicineForm}>
              <form onSubmit={medicineForm.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={medicineForm.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`Add_Med.Med_Name`)}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger disabled={isLoading}>
                            <SelectValue placeholder={t(`Add_Med.Select_Med`)} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableMedicines.map((medicine) => (
                            <SelectItem key={medicine.id} value={medicine.id}>
                              {medicine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicineForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`Add_Med.stock`)}</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             
            
                <DialogFooter className="gap-1">
                  <Button disabled={isLoading} type="button" variant="outline" onClick={() => {
                    handleAddModalOpen()
                  }}>
                    {t(`Add_Med.Cancel`)}
                  </Button>
                  <Button disabled={isLoading} type="submit">{isLoading?<Spinner/>:t(`Add_Med.submit`)}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
          <Toaster />
        </Dialog>
        <SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title='For_Medicine'/>
</div>
</div>

{isSearching ? (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    ) : (
      SearchResult === null ? (
        <MedicinesData 
        medicineForm={medicineForm}
        setIsDeleteOpen={setIsDeleteOpen}
        setMedicineName={setMedicineName}
        setIsEditOpen={setIsEditOpen}
          currentPage={currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isLoading} 
          medicines={medicines} 
          totalPages={totalPages} 
          availableMedicines={availableMedicines}
        />
      ) : (
        <MedicinesData 
        medicineForm={medicineForm}
        setIsDeleteOpen={setIsDeleteOpen}
        setMedicineName={setMedicineName}
        setIsEditOpen={setIsEditOpen}
          currentPage={SearchResult.currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isLoading} 
          medicines={SearchResult.medicines} 
          totalPages={SearchResult.totalPages} 
          availableMedicines={availableMedicines}
        />
      )
    )}
      
        <Dialog open={isEditOpen} onOpenChange={handleEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t(`Add_Med.Edit_Med`)}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <Form {...medicineForm}>
              <form onSubmit={medicineForm.handleSubmit(handleUpdateSubmit)} className="space-y-8">
                <FormField
                  control={medicineForm.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`Add_Med.Med_Name`)}</FormLabel>
                      <FormControl>
                        <Input {...field} value={medicineName} disabled={true} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={medicineForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`Add_Med.stock`)}</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
             
                <DialogFooter className="gap-1">
                  <Button disabled={isLoading} type="button" variant="outline" onClick={() => {
                    handleEditModalOpen()
                  }}>
                    {t(`Add_Med.Cancel`)}
                  </Button>
                  <Button disabled={isLoading} type="submit">{isLoading?<Spinner/>:t(`Add_Med.submit`)}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteOpen} onOpenChange={handleDeleteModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t(`Delete_Med.title`)}</DialogTitle>
              <DialogDescription>
                {t(`Delete_Med.description`,{medicineName})}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-1">
              <Button disabled={isLoading} type="button" variant="outline" onClick={() => {handleDeleteModal()}}>
                {t(`Delete_Med.Cancel`)}
              </Button>
              <Button disabled={isLoading} variant="destructive" onClick={handleDeleteMedicine}>{isLoading?<Spinner />:t(`Delete_Med.submit`)}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
   
        
        <Toaster />
      </div>
    </>
  )
}

