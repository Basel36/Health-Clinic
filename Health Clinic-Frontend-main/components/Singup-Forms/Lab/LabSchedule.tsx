"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { ArrowLeft ,ArrowRight} from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast, { Toaster } from 'react-hot-toast';

import {  LabValue, LabScheduleSchema, LabScheduleValue } from "@/schema/Lab"
import { FormDataHandler, onSignupSubmit } from "@/utils/AuthHandlers"
import { ConvertTimeToDate, DaysOfWeek } from "@/schema/Essentials"
import Spinner from "@/components/Spinner"
import { useRouter } from 'next/navigation'


interface IProps {
  role: string;
  prevData: LabValue;
  onBack: () => void;
}

export default function LabSchedule({ role ,prevData,onBack}: IProps) {
  const router = useRouter()

  const [isLoading,SetIsLoading]=useState(false);

  const form = useForm<LabScheduleValue>({
    resolver: zodResolver(LabScheduleSchema),
    defaultValues: {
      days: [{ day: "monday", startTime: "", endTime: "", limit: 1 }],
      cost: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const [availableDays, setAvailableDays] = useState(DaysOfWeek);

  useEffect(() => {
    const selectedDays = form.getValues().days.map(item => item.day);
    setAvailableDays(DaysOfWeek.filter(day => !selectedDays.includes(day)));
  }, [fields, form]);



  const onSubmitHandler=async (data:LabScheduleValue)=>{
    SetIsLoading(true);
     const newdata={days:data.days.map(d=>{return ({day:d.day,startTime:ConvertTimeToDate(d.startTime),endTime:ConvertTimeToDate(d.endTime)})})}
    const AllData={...prevData,role,schedule:{...newdata}}
    const formData=FormDataHandler(AllData);
    const res= await onSignupSubmit(formData);
    if(res.success){  
      toast.success(res.message,{
        duration: 2000,
        position: 'bottom-center',
      });
      router.push("/login");
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
    SetIsLoading(false);

  }
  return (
    <>  <Button disabled={isLoading} type="button" variant="ghost" onClick={onBack}>
   <ArrowLeft className="mr-2 h-4 w-4 rtl:hidden" />
   <ArrowRight className="ml-2 h-4 w-4 ltr:hidden" />
    Back
  </Button>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Set Schedule</h1>
          <p className="text-balance text-muted-foreground">
            Set your schedule as a {role}.
          </p>
          <p className="text-sm text-muted-foreground">
       you can modify it later.
          </p>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Day {index + 1}</h3>
                {fields.length>1?
                <Button  disabled={isLoading} type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  Remove Day
                </Button>:null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`days.${index}.day`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Day</FormLabel>
                      <Select 
                       disabled={isLoading}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setAvailableDays(prev => prev.filter(day => day !== value));
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger disabled={isLoading} >
                            <SelectValue placeholder="Select Day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...availableDays, field.value].map((day) => (
                            <SelectItem key={day}   value={day}>
                              {day}
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
                  name={`days.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input  disabled={isLoading} {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`days.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input  disabled={isLoading} {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`days.${index}.limit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Limit</FormLabel>
                      <FormControl>
                        <Input  disabled={isLoading} {...field} type="number" min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
           disabled={isLoading||availableDays.length === 0}
            type="button"
            variant="outline"
            onClick={() => {
              if (availableDays.length > 0) {
                append({ day: availableDays[0], startTime: "", endTime: "", limit: 1 });
              }
            }}
          >
            Add Another Day
          </Button>

     

          <Button  disabled={isLoading} type="submit" className="w-full">
            
          {isLoading? <Spinner />: 'Complete Sign Up'}

          </Button>
        </div>
 
      </form>
    </Form>
    <Toaster />
    </>
  );
}