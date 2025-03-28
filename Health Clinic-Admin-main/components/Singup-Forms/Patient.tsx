"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Upload, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm ,useFieldArray} from "react-hook-form"
import { format } from "date-fns"
import {  File } from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PatientSchema, PatientValue,  } from "@/schema/Patient"
import {  FormDataHandler, onSignupSubmit } from "@/utils/AuthHandlers"
import toast, { Toaster } from 'react-hot-toast';
import Spinner from "../Spinner"
import { useRouter } from "next/navigation"



interface IProps {
  role: string;
  onBack: () => void;
}
interface Iimages{
  profilePic: File|null;


}
export default function Patient({ role ,onBack}: IProps) {

  
  const [images, setImages] = useState<Iimages>({profilePic:null});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
 const router=useRouter();
  const [isLoading,SetIsLoading]=useState(false);


  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImages({...images,profilePic:e.target.files[0]})
    }
  }

 

  const signupForm = useForm<PatientValue>({
    resolver: zodResolver(PatientSchema),
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


    const onSubmitHandler=async (data:PatientValue)=>{
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
        router.push('/login');
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

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  return (
    <>
    <Button disabled={isLoading} type="button" variant="ghost" onClick={onBack}>
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
                    <Input disabled={isLoading} {...field} placeholder="Hazem Samir" />
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
                  <Input disabled={isLoading} {...field} type="email" placeholder="m@example.com" />
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
                  <Input disabled={isLoading} {...field} type="password" />
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
                  <Input disabled={isLoading} {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger  disabled={isLoading}>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
    
          <FormField
            control={signupForm.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                      disabled={isLoading}
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 space-y-4 bg-background rounded-lg shadow-lg border border-border space-x-3">
                      <div className="flex justify-between items-center">
                        <Select
                          value={year.toString()}
                          onValueChange={(value) => setYear(parseInt(value))}
                        >
                          <SelectTrigger disabled={isLoading} className="w-[120px]">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent >
                            {years.map((y) => (
                              <SelectItem key={y} value={y.toString()}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center">
                          <Button
                          disabled={isLoading}
                            variant="outline"
                            size="icon"
                            onClick={() => setMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                            className="h-7 w-7"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <div className="w-[100px] text-center font-medium">
                            {months[month]}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                            className="h-7 w-7"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: new Date(year, month, 1).getDay() }, (_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {days.map((day) => {
                          const date = new Date(year, month, day);
                          const isSelected = field.value && format(field.value, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                          const isToday = format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                          return (
                            <Button
                              key={day}
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                field.onChange(date);
                                signupForm.setValue("dateOfBirth", date);
                              }}
                              className={cn(
                                "h-8 w-8 p-0 font-normal",
                                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                isToday && !isSelected && "border border-primary text-primary",
                                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              {day}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                    <Button disabled={isLoading} type="button" variant="destructive" size="xs" className="p-1 text-xs" onClick={() => PhoneRemove(index)}>
                      Remove Number
                    </Button>
                  )}
                </div></FormLabel>
                      <FormControl>
                      <Input disabled={isLoading} {...field} type="tel" placeholder="(123) 456-7890" />
                        {/* <Input  {...field} value={field.value} placeholder="123 street"/> */}
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
              onClick={() => PhoneAppend("")}
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
                      <Button disabled={isLoading} type="button" variant="destructive" size="xs" className="p-1 text-xs" onClick={() => AddressRemove(index)}>
                        Remove Address
                      </Button>
                    )}
                  </div></FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} value={field.value} placeholder="123 street"/>
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