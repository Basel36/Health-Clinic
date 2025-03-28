"use client"

import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UpdateMedicine } from "@/lib/admin/clientApi"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from "../Spinner"
import { useTranslations } from 'next-intl'

const categories = [
  "Cosmetics",
  "Hair Care",
  "Every Day Essentials",
  "Medical Equipment & Supplies",
  "Mom & Baby",
  "Sexual Health",
  "Medicine",
  "Skin Care",
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name",
  }).regex(
    /^[a-zA-Z0-9()\s]*$/,
    "Name_Regex"
  ),


  cost: z.number().min(1, {
    message: "Cost",
  }),
  category: z.string().min(1, {
    message: "Category",
  }),
})

export function EditMedicineModal({ isOpen, onClose,medicine }: {medicine:{id:string,name:string,cost:number,category:string}, isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Medicine_Modal')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: medicine.name,
      cost: medicine.cost,
      category: medicine.category,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      setIsLoading(true)
      const res = await UpdateMedicine(values,medicine.id)
      if (res.success) {
        toast.success(res.message, {
          duration: 2000,
          position: 'bottom-center',
        })
        form.reset({
        ...values
        })
        router.refresh()
      } else {
        res.error.forEach((err: string) => 
          toast.error(err.msg || err || 'An unexpected error occurred.', {
            duration: 2000,
            position: 'bottom-center',
          })
        )
      }
    } catch (error) {
      toast.error('Failed to upload image. Please try again.')
    } finally {
      onClose()

      setIsLoading(false)
    }
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(`edit_title`)}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`Name`)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(`Medicine_Name`)} {...field} />
                  </FormControl>
                  <FormMessage translate={'Medicine_Modal.errors'} />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`Cost`)}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field} 
                      onChange={e => field.onChange(+e.target.value)} 
                    />
                  </FormControl>
               <FormMessage translate={'Medicine_Modal.errors'} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`Category`)}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue  placeholder={t(`Select_Category`)} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category, index) => (
                        <SelectItem key={index} value={category}>{t(`Categories.${category}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               <FormMessage translate={'Medicine_Modal.errors'} />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : t(`edit_submit`)}
            </Button>
          </form>
      <Toaster />
        </Form>
      </DialogContent>
    </Dialog>
  )
}

