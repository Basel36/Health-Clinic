"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslations } from 'next-intl'
import {  shortName } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {  PlusCircle, X } from "lucide-react"
import { FormDataHandler } from "@/utils/AuthHandlers"
import { PasswordSchema, PasswordValue, LabProfileSchema, ProfileValue } from "@/schema/Profile"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { UpdatePassword, UpdateProfile } from "@/lib/lab/clientApi"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Label } from "../ui/label"
import { removeUser } from "@/lib/auth"
import Spinner from "../Spinner"
import { Eye, EyeOff } from 'lucide-react';

interface Iimages {
  profilePic: File | string | null;
  license: (File | string)[];
}

interface IProps {
  profile: ProfileValue;
}

export default function LabProfileUpdate({ profile }: IProps) {
  const [isOpenUpdateProfile, setIsOpenUpdateProfile] = useState(false)
  const [isOpenUpdatePassword, setIsOpenUpdatePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<Iimages>({ profilePic: null, license: [] })
  const router = useRouter();
  const tprofile = useTranslations('profile')
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPasswordConfirm2, setShowPasswordConfirm2] = useState(false);

  const form = useForm<ProfileValue>({
    resolver: zodResolver(LabProfileSchema),
    defaultValues: {
      ...profile,
      profilePic:null,
      license:[],
    },
  })

  const passwordForm = useForm<PasswordValue>({
    resolver: zodResolver(PasswordSchema),
    defaultValues:{
      currentPassword:"",
      newPassword:"",
      passwordConfirm:"",
    }
  })
  useEffect(() => {
    setImages({ profilePic: profile.profilePic, license: profile.license })
  }, [profile])

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control: form.control,
    name: "phoneNumbers",
  })

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control: form.control,
    name: "address",
  })
  
  async function onSubmitPassword(data: PasswordValue) {
   setIsLoading(true);
    const res = await UpdatePassword(data)
    if (res.success ===true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
      removeUser();
      router.push("/login");
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
  
    setIsOpenUpdateProfile(false)
  }
  async function onSubmit(data: ProfileValue) {
    setIsLoading(true);
    if(!data.profilePic){
      delete data.profilePic;
    }
    if(data.email===profile.email){
      delete data.email;
    }
    // setIsLoading(true);
   const formData= FormDataHandler(data);
    const res = await UpdateProfile(formData)
    if (res.success ===true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      })
      router.refresh()
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }))
    }
    setIsLoading(false);
  
    setIsOpenUpdateProfile(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'license') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'profile') {
        setImages(prev => ({ ...prev, profilePic: e.target.files![0] }))
        form.setValue('profilePic', e.target.files[0])
      } else {
        const newFiles = Array.from(e.target.files)
        setImages(prev => ({ ...prev, license: [...prev.license, ...newFiles] }))
        form.setValue('license', [...form.getValues('license'), ...newFiles])
      }
    }
  }



  return (

   
      <div className="container mx-auto flex-grow">
          <Card className="w-full border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{tprofile(`user_profile`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.profilePic} alt={profile.name} />
                    <AvatarFallback>{shortName(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold">{profile.name}</h2>
                    <p className="text-xl text-gray-500">{profile.email}</p>
                  </div>
                </div>
                <div className="space-y-6">
                
                  
                 
                  <div>
                    <Label className="text-lg">{tprofile(`address`)}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.address.map((address, index) => (
                    <p  key={index} className="text-xl mt-1">{address} - </p>

                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-lg">{tprofile(`phoneNumbers`)}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.phoneNumbers.map((phone, index) => (
                    <p  key={index} className="text-xl mt-1">{phone} - </p>

                      ))}
                    </div>
                  </div>
            
                  <div>
                    <Label className="text-lg">{tprofile(`license`)}</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {profile.license.map((pic, index) => (
                        <Image  key={index} priority src={pic} alt={`License ${index + 1}`} width={192} height={144} className=" h-auto object-cover rounded" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">

                <Dialog open={isOpenUpdateProfile} onOpenChange={setIsOpenUpdateProfile}>
      <DialogTrigger asChild>
        <Button  disabled={isLoading}>{tprofile(`update_profile.button`)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tprofile(`update_profile.title`)}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
                
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 p-1">
                <FormField
                  control={form.control}
                  name="profilePic"
                  render={() => (
                    <FormItem>
                      <FormLabel>{tprofile(`update_profile.Profile_Pic`)}</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                        <div className="relative w-28 h-20 rounded-full overflow-hidden bg-muted">
                          <Image
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src={typeof images.profilePic === 'string' ? images.profilePic : images.profilePic instanceof File ? URL.createObjectURL(images.profilePic) : '/placeholder.svg'}
                            alt="Profile"
                            fill
                            style={{objectFit:"cover"}}
                            className="h-auto"
                          />
                          </div>
                          <Input
                          disabled={isLoading}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'profile')}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tprofile(`update_profile.Full_Name`)}</FormLabel>
                      <FormControl>
                        <Input  disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tprofile(`update_profile.email`)}</FormLabel>
                      <FormControl>
                        <Input  disabled={isLoading} {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
         

          

               
                {phoneFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`phoneNumbers.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{`${tprofile(`update_profile.phoneNumber`,{index:index+1})}`}</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input  disabled={isLoading} {...field} />
                            {index > 0 && (
                              <Button
                              disabled={isLoading}
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removePhone(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
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
                  onClick={() => appendPhone("")}
                >
                  {tprofile(`update_profile.Add_Another_Phone_Button`)}
                </Button>

                {addressFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`address.${index}`}
                    render={({ field }) => (
                      <FormItem>
                               <FormLabel>{`${tprofile(`update_profile.address`,{index:index+1})}`}</FormLabel>
               
                        
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input  disabled={isLoading} {...field} />
                            {index > 0 && (
                              <Button
                              disabled={isLoading}
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeAddress(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
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
                  onClick={() => appendAddress("")}
                >
                  {tprofile(`update_profile.Add_Another_Address_Button`)}
                </Button>

                <FormField
                  control={form.control}
                  name="license"
                  render={() => (
                    <FormItem>
                      <FormLabel>{tprofile(`update_profile.License_Photo`)}</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <ScrollArea className="h-30 w-full rounded-md border">
                            <div className="flex space-x-2 p-2">
                              {images.license.map((pic, index) => (
                                <Image
                                  key={index}
                                  src={pic instanceof File ? URL.createObjectURL(pic) : pic}
                                  alt={`License ${index + 1}`}
                                  width={100}
                                  height={75}
                                  className="rounded  h-auto"
                                />
                              ))}
                               {/* {images.license.map((file, index) => (
                                <Image
                                  key={`new-${index}`}
                                  src={pic instanceof File ? URL.createObjectURL(pic) : pic}
                                  alt={`New License ${index + 1}`}
                                  width={100}
                                  height={75}
                                  className="rounded"
                                />
                              ))} */}
                            </div>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                          <Button  disabled={isLoading} type="button" variant="outline" size="sm" className="text-xs sm:text-sm">
                            <label htmlFor="license" className="flex w-full h-full items-center cursor-pointer">
                              <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              {tprofile(`update_profile.Upload_License`)}
                            </label>
                          </Button>
                          <Input
                           disabled={isLoading}
                            id="license"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileChange(e, 'license')}
                            className="hidden"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <Button type="submit" className="w-full">{isLoading?<Spinner/>:tprofile(`update_profile.submit`)}</Button>
          </form>
        </Form>
        <Toaster />
      </DialogContent>
    </Dialog>

    <Dialog open={isOpenUpdatePassword} onOpenChange={setIsOpenUpdatePassword}>
      <DialogTrigger asChild>
        <Button  disabled={isLoading}>{tprofile(`change_password.button`)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tprofile(`change_password.title`)}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...passwordForm}>
                
          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-8">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 p-1">
         

                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tprofile(`change_password.current_Password`)}</FormLabel>
                      <FormControl>
                  <div className="relative">

                        <Input  disabled={isLoading}{...field}type={showPassword ? "text" : "password"}/>
                        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
          </div>
                      </FormControl>
                      <FormMessage translate={"errors"} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tprofile(`change_password.new_Password`)}</FormLabel>
                      <FormControl>
                <div className="relative">

                        <Input  disabled={isLoading}{...field}type={showPasswordConfirm ? "text" : "password"} />
                        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            disabled={isLoading}
          >
            {showPasswordConfirm ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPasswordConfirm ? "Hide password" : "Show password"}
            </span>
          </Button>
                </div>
                      </FormControl>
                      <FormMessage translate={"errors"} />
                    </FormItem>
                  )}
                />
  <FormField
                  control={passwordForm.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tprofile(`change_password.confirm_new_Password`)}</FormLabel>
                      <FormControl>
                <div className="relative">
                <Input  disabled={isLoading} {...field}type={showPasswordConfirm2 ? "text" : "password"} />
                <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPasswordConfirm2(!showPasswordConfirm2)}
            disabled={isLoading}
          >
            {showPasswordConfirm2 ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPasswordConfirm2 ? "Hide password" : "Show password"}
            </span>
          </Button>
                </div> 
                      </FormControl>
                      <FormMessage translate={"errors"}/>
                    </FormItem>
                  )}
                />
                

              
              </div>
            </ScrollArea>
            <Button type="submit" className="w-full">{isLoading?<Spinner/>:tprofile(`change_password.submit`)}</Button>
          </form>
        </Form>
            <Toaster />
      </DialogContent>
    </Dialog>
    </div>
              </div>
            </CardContent>
          </Card>
        </div>

  )
}