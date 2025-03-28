"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Upload } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm ,useFieldArray} from "react-hook-form"
import { PlusCircle, File } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PharmacySchema, PharmacyValue } from "@/schema/Pharmacy"
import { FormDataHandler, onSignupSubmit } from "@/utils/AuthHandlers"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "@/components/Spinner"



interface IProps {
  role: string;
  onBack: () => void;
}
interface Iimages{
  profilePic: File|null;
  license: File[];

}
export default function Pharmacy({ role ,onBack}: IProps) {
  const router = useRouter()
 
  const [isLoading,SetIsLoading]=useState(false);

  const [images, setImages] = useState<Iimages>({profilePic:null,license:[]});




  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImages({...images,profilePic:e.target.files[0]})
    }
  }

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
       setImages({...images,license:[...images.license,...newFiles]})
    }
  
  }

  const signupForm = useForm<PharmacyValue>({
    resolver: zodResolver(PharmacySchema),
    defaultValues: {
      address: [" "],
      phoneNumbers: [" "],
    },
  })

  const { fields:AddressFields, append:AddressAppend, remove:AddressRemove } = useFieldArray({
    control: signupForm.control,
    name: "address",
  })

  const { fields:PhoneFields, append:PhoneAppend, remove:PhoneRemove } = useFieldArray({
    control: signupForm.control,
    name: "phoneNumbers",
  })



  const onSubmitHandler=async (data:PharmacyValue)=>{
    SetIsLoading(true);
    data['role']=role;
    const formData=FormDataHandler(data);
    const res= await onSignupSubmit(formData);
    SetIsLoading(false);
    if(res.success){
      toast.success(res.message,{
        duration: 2000,
        position: 'bottom-center',
      });
      router.push("/login")
    }
    else {
      res.message.forEach((err:string) => toast.error( err || 'An unexpected error occurred.',{
     duration: 2000,
     position: 'bottom-center',
   }))
      // res.error.forEach((err:string) => toast.error(err.msg || err || 'An unexpected error occurred.',{
      //   duration: 2000,
      //   position: 'bottom-center',
      // }))
    }
  }

  return (
    <>
    <Button   disabled={isLoading} type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
    <Form {...signupForm}>
      <form onSubmit={signupForm.handleSubmit(onSubmitHandler)} className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Create your account as a {role}
          </p>
        </div>
        {/* <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
            {profilePic ? (
              <Image
                src={URL.createObjectURL(profilePic)}
                alt="Profile photo"
                fill
                style={{objectFit:"cover"}}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <Label htmlFor="profilePic" className="cursor-pointer text-sm text-primary hover:underline">
            Upload Profile Photo
          </Label>
          <Input
            id="profilePic"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div> */}
        <div className="space-y-4">
        <FormField
              control={signupForm.control}
              name="profilePic"
              render={({ field }) => (
                  <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
            {images.profilePic ? (
              <Image
                src={URL.createObjectURL(images.profilePic)}
                alt="Profile photo"
                fill
                style={{objectFit:"cover"}}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <FormItem>
          <FormLabel htmlFor="profilePic" className="cursor-pointer text-sm text-primary hover:underline">
            Upload Profile Photo
          </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="file"
                  accept="image/*"
                  id="profilePic"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0])
                    handleProfilePicChange(e);
                  }}
                  className="hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          
        </div>
              )}
            />
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input   disabled={isLoading} {...field} placeholder="Hazem Samir" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
         {/* <FormField
          control={signupForm.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
          {/* </div> */}
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input   disabled={isLoading} {...field} type="email" placeholder="m@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input   disabled={isLoading} {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input   disabled={isLoading} {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
    
     
        
    {/* <div className="flex-col space-y-2 sm:flex items-start justify-between"> */}
    
    {PhoneFields.map((field, index) => (
                
                <FormField 
                 key={field.id} 
                  control={signupForm.control}
                  name={`phoneNumbers[${index}]`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>  <div className="flex justify-between items-center">
                  <h3 className="font-bold">{index>0?`Phone Number ${index + 1}`:`Phone Number`}</h3>
                  {index > 0 && (
                    <Button  disabled={isLoading} type="button" variant="destructive" size="xs" className="p-1 text-xs" onClick={() => PhoneRemove(index)}>
                      Remove Number
                    </Button>
                  )}
                </div></FormLabel>
                      <FormControl>
                      <Input   disabled={isLoading} {...field} type="tel" placeholder="(123) 456-7890" />
                        {/* <Input  {...field} value={field.value} placeholder="123 street"/> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
           
             
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => PhoneAppend("")}
              disabled={isLoading}
            >
              Add Another Phone Number
            </Button>
    {AddressFields.map((field, index) => (
                
                  <FormField 
                   key={field.id} 
                    control={signupForm.control}
                    name={`address[${index}]`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{index>0?`Address ${index + 1}`:`Address`}
                    </h3>
                    {index > 0 && (
                      <Button   disabled={isLoading} type="button" variant="destructive" size="xs" className="p-1 text-xs" onClick={() => AddressRemove(index)}>
                        Remove Address
                      </Button>
                    )}
                  </div></FormLabel>
                        <FormControl>
                          <Input   disabled={isLoading} {...field} value={field.value} placeholder="123 street"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
             
               
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => AddressAppend("")}
                disabled={isLoading}
              >
                Add Another Address
              </Button>  
    <FormField
              control={signupForm.control}
              name="license"
              render={({ field }) => (
                    // <div className="flex-col items-start space-y-3">
                <FormItem className=" flex-col items-start space-y-3">
          
                    <ScrollArea className=" rounded-md border">

      <div className="flex w-max space-x-4 p-4">
                    {images.license.map((license,index)=>(
                             <div key={index} className="relative w-40 h-32  rounded-md overflow-hidden bg-muted">
                            
                               <Image
                                 src={URL.createObjectURL(license)}
                                 alt="Profile photo"
                                 fill
                                 style={{objectFit:"cover"}}
                               />
                           
                            
                           </div>
                    ))}
                    </div>
           <ScrollBar orientation="horizontal" />
                    </ScrollArea  >
                    <Button   disabled={isLoading} type="button" variant="outline" size="sm" className="text-xs sm:text-sm ">
                <FormLabel htmlFor="license" className="flex w-full h-full items-center" >
                 
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Upload License Photo
                </FormLabel>
                  </Button> 
                    <FormControl>
                      <Input
                      disabled={isLoading}
                      multiple
                        type="file"
                        accept="image/*"
                        id="license"
                        onChange={(e) => {
                      const newFiles = Array.from(e.target.files||[]);
                          field.onChange([...images.license,...newFiles])
                          handleLicenseChange(e);
                        }}
                        className="hidden"
                      />
                    </FormControl>
              <FormMessage />
            </FormItem>
      
          
 
              )}
            />
               

          <Button   disabled={isLoading} type="submit" className="w-full">
          {isLoading? <Spinner />: 'Sign Up'}

          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </form>
    </Form>
    <Toaster />
    </>
  
 
  )
}