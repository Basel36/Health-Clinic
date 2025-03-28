'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { shortName } from '@/lib/utils'
import { getAge } from '@/utils/utils'
import { ArrowLeft,ArrowRight, Edit,Trash2 } from 'lucide-react'
import Link from "next/link"
import { getUser } from '@/lib/auth'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslations } from 'next-intl'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from '@/components/Spinner'
import { DeleteQuestion, UpdateQuestion } from '@/lib/patient/clientApi'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
      question: z.string().min(6,"Patient_Question_required")
});

interface IProps {
  question: {
    id: string;
    patient: {
      name: string;
      profilePic: string;
      dateOfBirth: string;
      gender: string;
      id:string
    };
    question: string;
    answers: Array<{
      id: string;
      doctor: {
        id: string;
        name: string;
        profilePic: string;
      };
      answer: string;
    }>;
  }
}

export default function QuestionDetail({question}: IProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('patient.medical_questions.Update_Question')
  const tcommon = useTranslations('common')
  const user=getUser();
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
          question: "",
        },
  })
  const handleUpdateQuestion = async(data:z.infer < typeof formSchema >) => {
    // Here you would typically send the updated question to your backend
    setIsLoading(true);
    const res = await UpdateQuestion({question:data.question},question.id);
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'top-center',
      });
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setIsLoading(false);
    setIsUpdateModalOpen(false)
    // You might want to update the local state or refetch the question data here
  }
  const handleDeleteQuestion = async() => {
    // Here you would typically send the updated question to your backend
    setIsLoading(true);
    const res = await DeleteQuestion(question.id);
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'top-center',
      });
      router.replace('/patient/medical-questions');
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setIsLoading(false);
    setIsDeleteModalOpen(false)
    // You might want to update the local state or refetch the question data here
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/patient/medical-questions" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mb-4">
      <ArrowLeft className="mr-2 h-4 w-4 rtl:hidden" />
      <ArrowRight className="ml-2 h-4 w-4 ltr:hidden" />
        {tcommon(`Back`)}
      </Link>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={question.patient.profilePic} alt={question.patient.name} />
            <AvatarFallback>{shortName(question.patient.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle>{question.patient.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{`${t(`PAge`,{age:getAge(question.patient.dateOfBirth)})} | ${t(`PGender`)}: ${t(`${question.patient.gender}`)}`}</p>
          </div>
     {user.id===question.patient.id&&question.answers.length <= 0? 

<div className="flex gap-2">
         <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
         <DialogTrigger asChild>
           <Button variant="outline" size="sm">
             <Edit className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
             {t(`button`)}
           </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
             <DialogTitle>{t(`title`)}</DialogTitle>
             <DialogDescription>
              
             </DialogDescription>
           </DialogHeader>
           <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateQuestion)} className="space-y-8 max-w-3xl mx-auto ">
        
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(`Question_Field_Label`)}</FormLabel>
              <FormControl>
                <Input 
                placeholder={t(`placeholder`)}
                disabled={isLoading}
                type=""
                {...field} />
              </FormControl>
              <FormDescription>{t(`description`)}</FormDescription>
              <FormMessage translate={'errors'} />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>{isLoading?<Spinner/>:t(`submit`)}</Button>
      </form>
    </Form>
         </DialogContent>
       </Dialog>
       
       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
       <DialogTrigger asChild>
         <Button variant="outline" size="sm">
           <Trash2 className="w-4 h-4 ltr:mr-2 rtl:ml-1" />
           {t(`delete_button`)}
         </Button>
       </DialogTrigger>
       <DialogContent className="sm:max-w-[425px]">
         <DialogHeader>
           <DialogTitle>{t(`delete_title`)}</DialogTitle>
           <DialogDescription>
             {t(`delete_description`)}
           </DialogDescription>
         </DialogHeader>
         <div className="flex justify-end gap-2 mt-4">
           <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
             {t(`cancel`)}
           </Button>
           <Button variant="destructive"  onClick={() => {
            handleDeleteQuestion()
           }} disabled={isLoading}>{isLoading?<Spinner/>:
             t(`confirm_delete`) }
           </Button>
         </div>
       </DialogContent>
     </Dialog>
   </div>
       
       :null 
    }
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">{t(`Question`)}</h2>
          <p className="mb-4">{question.question}</p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">{t(`Answers`)}</h2>
      {question.answers.length > 0 ? question.answers.map((answer) => (
        <Card key={answer.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={answer.doctor.profilePic} alt={answer.doctor.name} />
                <AvatarFallback>{shortName(answer.doctor.name)}</AvatarFallback>
              </Avatar>
              <CardTitle>{answer.doctor.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{answer.answer}</p>
          </CardContent>
        </Card>
      )) : <p>{t(`No_Answers`)}</p>}
      <Toaster />
    </div>
  )
}