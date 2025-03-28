'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PlusCircle, Edit, Trash2, Send, Plus, X, } from 'lucide-react'
import { AddTest, DeleteTest, RequestTest, searchTests, UpdateTest } from '@/lib/lab/clientApi'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { getUser } from '@/lib/auth'
import Spinner from '../Spinner'
import { ITest, ITestDetails } from '@/interfaces/Lab'
import SearchBar from '../ui/SearchBar'
import Pagination from '../Pagination'
import { useTranslations } from 'next-intl'


interface IProps {
  tests: ITest[];
  currentPage: number;
  totalPages: number;
  availableTests: ITestDetails[]
}

interface ITestsData extends IProps{
  form :object
  isLoading: boolean
  setTestName: (name:string)=>void
  setIsEditOpen: (value:boolean)=>void
  setIsDeleteOpen: (value:boolean)=>void
  handlePageChange:(newPage:number)=>void

}

const TestsData=({tests,form,isLoading,setTestName,setIsEditOpen,setIsDeleteOpen,currentPage,handlePageChange,totalPages}:ITestsData)=>{
  const t = useTranslations('Tests')
  const t2 = useTranslations('common')

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {tests.length<=0?<div className="flex col-span-4 justify-center items-center">No Tests</div>
        :tests.map((test) => (
          <div key={test.id} className="bg-card text-card-foreground rounded-lg p-4 shadow-md transition-all hover:shadow-lg border border-border">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold">{test.test.name}</h2>
              <div className="flex space-x-1">
                <Button
                disabled={isLoading}
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    form.reset({
                      id: test.id,
                      cost: test.cost,
                      preparations: test.preparations,
                    })
                    setTestName(test.test.name);
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
                    form.reset({
                      id: test.id,
                      cost: test.cost,
                      preparations: test.preparations,
                    })
                    setTestName(test.test.name);
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            <p className="text-xl font-bold text-primary mb-2">{`${test.cost} ${t2(`EGP`)}`} </p>
            <div className="mt-2">
              <h3 className="text-sm font-sempibold mb-1">{`${t(`preps`)}:`}</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {test.preparations.length > 0 ? test.preparations.map((prep, index) => (
                  <li key={index}>{prep}</li>
                )) : <li>{t(`none`)}</li>}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages}  handlePageChange={handlePageChange} />

    </>
  )
}
const testFormSchema = z.object({
  id: z.string().min(5, {
    message: "Test name must be at least 2 characters.",
  }),
  cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Cost must be a positive number.",
  }),
  preparations: z.array(z.string().min(1, { message: "Preparation step cannot be empty." })),
})
type TestFormValue =z.infer<typeof testFormSchema>;

export default function TestManagement({tests, currentPage, totalPages,availableTests}: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [testName, setTestName] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const t = useTranslations('Tests')

  const [searchTerm, setSearchTerm] = useState('')

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,tests:ITest[]}|null>(null)



  const handleSearch = async (page:number) => {
    setIsSearching(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsSearching(false);
      return
    }

    try {
      const res = await searchTests(searchTerm, 7, page)
      if (res.success === true) {
        setSearchResult({
          tests: res.data.data,
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
  const handleEditModalOpen=()=>{
    setIsEditOpen(!isEditOpen);
    setTestName('')
    if(!isEditOpen){
form.reset({
  id: "",
  cost: "",
  preparations: [],
})
}
}
const handleAddModalOpen=()=>{
  setIsAddOpen(!isAddOpen);
  setTestName('')
  if(!isAddOpen){

      form.reset({
        id: "",
        cost: "",
        preparations: [],
      })
    }
  }
  const handleDeleteModal=()=>{
    setIsDeleteOpen(!isDeleteOpen);
    setTestName('')
    if(!isAddOpen){
      
      form.reset({
        id: "",
        cost: "",
        preparations: [],
      })
    }
    }


  const form = useForm<TestFormValue>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      id: "",
      cost: "",
      preparations: [],
    },
  })

  async function onSubmit(data:TestFormValue) {
   setIsLoading(true);
    const user = getUser();
    const object ={Lab:user.id,test:data.id,preparations:data.preparations,cost:data.cost}
    const res = await AddTest(object)
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
const handleUpdateSubmit=async(data:TestFormValue)=>{
  setIsLoading(true);
    const object ={preparations:data.preparations,cost:Number(data.cost)}
    const res = await UpdateTest(object,data.id)
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

    router.push(`lab/my-tests?page=${newPage}`);
  }
};

const handleDeleteTest = async() => {
  setIsLoading(true);
   const{id}=form.getValues();
      const res = await DeleteTest(id);
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
      handleDeleteModal();
    
  }

  const handleRequestTest = async() => {
    setIsLoading(true);
    const regex = /^[A-Za-z0-9\s\(\)]+$/;
    if (testName) {
      if(!regex.test(testName)){
        toast.error("Name can only contain letters, numbers, spaces, and parentheses.", {
          duration: 2000,
          position: 'top-center',
        })
        return;
      }
          const res = await RequestTest({name:testName});
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
          setTestName('')
          setIsLoading(false);
      setIsRequestOpen(false);
    }
  }

  return (
    <>
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{t(`title`)}</h1>
        <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
          <DialogTrigger asChild>
            <Button disabled={isLoading} variant="outline" size="sm" className="w-full sm:w-auto mb-4 sm:mb-0">
              <Send className="ltr:mr-2 rtl:ml-1 h-4 w-4" />
              {t(`Request_Test.title`)}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t(`Request_Test.title`)}</DialogTitle>
              <DialogDescription>
              {t(`Request_Test.description`)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requestTest" className="text-right">
                {t(`Request_Test.Test_Name`)}
                </Label>
                <Input
                disabled={isLoading}
                  id="requestTest"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isLoading} variant="outline" onClick={() => setIsRequestOpen(false)}>
                {t(`Request_Test.Cancel`)}
              </Button>
              <Button disabled={isLoading} onClick={handleRequestTest}>{isLoading?<Spinner/>:t(`Request_Test.submit`)}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col justify-center items-center mb-4  space-y-4  border-grey-400">
<span className="border-t-2 border-grey-400 items-center  w-full"></span>
<div className="flex justify-between items-center w-full">
<Dialog open={isAddOpen} onOpenChange={handleAddModalOpen}>
        <DialogTrigger asChild>
          <Button disabled={isLoading} className="w-full sm:w-auto">
            <PlusCircle className="ltr:mr-2 rtl:ml-1 h-4 w-4" />
            {t(`Add_Test.title`)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>  {t(`Add_Test.title`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>  {t(`Add_Test.Test_Name`)}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={isLoading}>
                          <SelectValue placeholder= {t(`Add_Test.Select_Test`)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTests.map((test) => (
                          <SelectItem key={test.id} value={test.id}>
                            {test.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="number" {...field} placeholder="123" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preparations"
                render={() => (
                  <FormItem>
                    <FormLabel> {t(`Add_Test.preps`)}</FormLabel>
                    <FormDescription> {t(`Add_Test.preps_desc`)}</FormDescription>
                    {form.watch("preparations").map((prep, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={`preparations.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input disabled={isLoading} {...field} />
                                <Button
                                disabled={isLoading}
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const currentPreps = form.getValues("preparations")
                                    form.setValue("preparations", currentPreps.filter((_, i) => i !== index))
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                    disabled={isLoading}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentPreps = form.getValues("preparations")
                        form.setValue("preparations", [...currentPreps, ""])
                      }}
                    >
                      <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-1" />  {t(`Add_Test.prep_add_button`)}
                    </Button>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={isLoading} type="button" variant="outline" onClick={() => {
                 handleAddModalOpen()
                }}>
                  {t(`Add_Test.Cancel`)}
                </Button>
                <Button disabled={isLoading} type="submit">{isLoading?<Spinner/>:t(`Add_Test.submit`)}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
        <Toaster />
      </Dialog>
        <SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title='For_Test'/>
</div>
</div>

{isSearching ? (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    ) : (
      SearchResult === null ? (
        <TestsData 
        availableTests={availableTests}
        form={form}
        setIsDeleteOpen={setIsDeleteOpen}
        setTestName={setTestName}
        setIsEditOpen={setIsEditOpen}
          currentPage={currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isLoading} 
          tests={tests} 
          totalPages={totalPages} 
        />
      ) : (
        <TestsData 
        form={form}
        setIsDeleteOpen={setIsDeleteOpen}
        setTestName={setTestName}
        setIsEditOpen={setIsEditOpen}
        availableTests={availableTests}
          currentPage={SearchResult.currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isLoading} 
          tests={SearchResult.tests} 
          totalPages={SearchResult.totalPages} 
        />
      )
    )}
      
         
      <Dialog open={isEditOpen} onOpenChange={handleEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t(`Add_Test.Edit_Test`)}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(`Add_Test.Test_Name`)}</FormLabel>
                    <FormControl>
                      <Input {...field} value={testName} disabled  />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(`Add_Test.cost`)}</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preparations"
                render={() => (
                  <FormItem>
                    <FormLabel>{t(`Add_Test.preps`)}</FormLabel>
                    <FormDescription>{t(`Add_Test.preps_edit_desc`)}</FormDescription>
                    {form.watch("preparations").map((prep, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={`preparations.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input {...field} disabled={isLoading}/>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const currentPreps = form.getValues("preparations")
                                    form.setValue("preparations", currentPreps.filter((_, i) => i !== index))
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                    disabled={isLoading}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentPreps = form.getValues("preparations")
                        form.setValue("preparations", [...currentPreps, ""])
                      }}
                    >
                      <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-1" /> {t(`Add_Test.prep_add_button`)}
                    </Button>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={isLoading} type="button" variant="outline" onClick={() => {
                      handleEditModalOpen()
                }}>
                  {t(`Add_Test.Cancel`)}
                </Button>
                <Button  disabled={isLoading}type="submit">{isLoading?<Spinner/>:t(`Add_Test.Save`)}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={handleDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t(`Delete_Test.title`)}</DialogTitle>
            <DialogDescription>
           {t(`Delete_Test.description`,{testName})}
            
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isLoading} type="button" variant="outline" onClick={() => {handleDeleteModal()}}>
            {t(`Delete_Test.Cancel`)}
            </Button>
            <Button disabled={isLoading} variant="destructive" onClick={handleDeleteTest}>{isLoading?<Spinner />:t(`Delete_Test.submit`)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     

   
 
       
             <Toaster />
    </div>
      
      </>
  )
}