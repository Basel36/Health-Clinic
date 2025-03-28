"use client"

import { useState} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {  AddTest } from "@/lib/admin/clientApi"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "../Spinner"
import { useTranslations } from 'next-intl'


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name",
  }).regex(
    /^[a-zA-Z0-9()\s]*$/,
    "Name_Regex"
  ),
})

export function AddTestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('Test_Modal')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsLoading(true);
    const res= await AddTest(values);
    if(res.success){  
      toast.success(res.message,{
        duration: 2000,
        position: 'bottom-center',
      });
      form.reset({   name: ""})
      router.refresh();
    }
    else {
      res.error.forEach((err:string) => toast.error(err.msg || err || 'An unexpected error occurred.',{
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    onClose()
    setIsLoading(false);

    // Here you would typically send the data to your backend
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t(`title`)}</DialogTitle>
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
                    <Input placeholder={t(`Test_Name`)} {...field} />
                  </FormControl>
                  <FormMessage translate={'Test_Modal.errors'} />
                </FormItem>
              )}
            />
           
           <Button disabled={isLoading} type="submit">{isLoading?<Spinner />:t(`submit`)}</Button>
          </form>
      <Toaster />
        </Form>
      </DialogContent>
    </Dialog>
  )
}

