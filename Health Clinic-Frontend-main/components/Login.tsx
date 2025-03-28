"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react"
import { PatientValue } from "@/schema/Patient"
import { LoginSubmit } from "@/utils/AuthHandlers"
import { useRouter } from 'next/navigation'
import { setUser } from "@/lib/auth"
import Spinner from "./Spinner"
import { useForm } from "react-hook-form"
import { useLocale } from 'next-intl'
import { Eye, EyeOff,ArrowLeft } from 'lucide-react';

interface IProps {
  role: string;
  onBack: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})



export default function Login({ role ,onBack}: IProps) {
  const [isLoading,SetIsLoading]=useState(false);
  const router = useRouter()
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmitHandler=async (data:PatientValue)=>{
    SetIsLoading(true);
    data['role']=role;
    const res= await LoginSubmit(data);
    SetIsLoading(false);
    if(res.success){
      toast.success(res.message,{
        duration: 2000,
        position: 'top-center',
      });
      setUser(res.data.data,res.data.token);
      // Cookies.set('user', JSON.stringify(res.data.data), { expires: 7 }) 
      // Cookies.set('token', res.data.token, { expires: 7 }) 
      router.push(`/${role}`)
    }
    else {
      res.message.forEach((err:string) => toast.error( err || 'An unexpected error occurred.',{
        duration: 2000,
        position: 'top-center',
      }))
      // res.error.forEach((err:string) => toast.error(err.msg || err || 'An unexpected error occurred.',{
      //   duration: 2000,
      //   position: 'bottom-center',
      // }))
    }
  }

  return (
 
     
      <>
      <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4 " />
            Back
          </Button>
     
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading}  placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl >
                      <div className="relative">

                      <Input  type={showPassword ? "text" : "password"} disabled={isLoading}   {...field} />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading} >
                {isLoading? <Spinner />: 'Login'}
              </Button>
            </form>
          </Form>
         
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href={`/${locale}/signup`} className="underline">
              Sign up
            </Link>
          </div>
          <Toaster />
        
          </>  
   
  )
}