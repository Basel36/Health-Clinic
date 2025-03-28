"use client"

import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormDataHandler, ImageHandler } from "@/utils/AuthHandlers"
import { AddMedicine } from "@/lib/admin/clientApi"
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

  photo: z.custom<File>(ImageHandler, {
    message: 'Photo',
  }),
  cost: z.number().min(1, {
    message: "Cost",
  }),
  category: z.string().min(1, {
    message: "Category",
  }),
})

export function AddMedicineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Medicine_Modal')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      photo: undefined,
      cost: 0,
      category: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const formData = FormDataHandler(values)
      const res = await AddMedicine(formData)
      if (res.success) {
        toast.success(res.message, {
          duration: 2000,
          position: 'bottom-center',
        })
        form.reset({
          name: "",
          photo: undefined,
          cost: 0,
          category: "",
        })
        setPhotoPreview(null)
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Revoke the previous preview URL to prevent memory leaks
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
      // Use URL.createObjectURL instead of FileReader for better performance
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
    }
  }

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

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
                    <Input placeholder={t(`Medicine_Name`)} {...field} />
                  </FormControl>
                  <FormMessage translate={'Medicine_Modal.errors'} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>{t(`Photo`)}</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleFileChange(e)
                          onChange(e.target.files?.[0])
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  {photoPreview && (
                    <div className="mt-4 relative w-[100px] h-[100px]">
                      <Image
                        src={photoPreview}
                        alt="Photo preview"
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
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
              {isLoading ? <Spinner /> : t(`submit`)}
            </Button>
          </form>
      <Toaster />
        </Form>
      </DialogContent>
    </Dialog>
  )
}

