'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { shortName } from '@/lib/utils'
import { getAge } from '@/utils/utils'
import { useRouter } from 'next/navigation'
import { AnswerQuestion, UpdateAnswer } from '@/lib/doctor/clientApi'
import { getUser } from '@/lib/auth'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from '../Spinner'
import { ArrowLeft, Edit, Check, X,ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'

interface IProps {
  question: {
    id: string;
    patient: {
      name: string;
      profilePic: string;
      dateOfBirth: string;
      gender: string;
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
  const router = useRouter();
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [editingAnswerTextArea, setEditingAnswerTextArea] = useState(false);
  // const [editingAnswer, setEditingAnswer] = useState("");
  // const [editedAnswers, setEditedAnswers] = useState<{[key: string]: string}>({});
  const user = getUser();
  const t = useTranslations('doctor.Question_Details')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {questionID: question.id, answer: answerRef.current?.value, doctor: user?.id};
    const res = await AnswerQuestion(data);
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      });
      if (answerRef.current) answerRef.current.value = "";
      router.refresh();
    } else {
      res.message.forEach((err: string) => toast.error(err || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      }));
    }
    setIsLoading(false);
  };

  const handleEdit = (answer: string) => {
    setEditingAnswer(answer);
    setEditingAnswerTextArea(true)
    // editedAnswerRef.current.value=answer;
  };
  
  const handleCancelEdit = () => {
    setEditingAnswer(null);
    setEditingAnswerTextArea(false)
  };

  const handleSaveEdit = async (answerID: string) => {
    setIsLoading(true);
    const data={questionID:question.id, answerID, answer: editingAnswer}
    const res = await UpdateAnswer(data);
    if (res.success === true) {
      toast.success(res.message, {
        duration: 2000,
        position: 'bottom-center',
      });
      setEditingAnswer(null);
      setEditingAnswerTextArea(false);
      router.refresh();
    } else {
      toast.error(res.message || 'An unexpected error occurred.', {
        duration: 2000,
        position: 'bottom-center',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/doctor/medical-questions" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4 rtl:hidden" />
        <ArrowRight className="ml-1 h-4 w-4 ltr:hidden" />
        {t(`Back`)}
      </Link>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={question.patient.profilePic} alt={question.patient.name} />
            <AvatarFallback>{shortName(question.patient.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{question.patient.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{`${t('PAge')}: ${getAge(question.patient.dateOfBirth)}`} | {`${t(`PGender`)}: ${t(`${question.patient.gender}`)}`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">{t(`Question`)}:</h2>
          <p className="mb-4">{question.question}</p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">{t(`Answers`)}:</h2>
      {question.answers.map((answer) => (
        <Card key={answer.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={answer.doctor.profilePic} alt={answer.doctor.name} />
                <AvatarFallback>{shortName(answer.doctor.name)}</AvatarFallback>
              </Avatar>
              <CardTitle>{answer.doctor.name}</CardTitle>
            </div>
            {user?.id === answer.doctor.id &&  (
              <Button variant="ghost" size="sm" onClick={() => handleEdit(answer.answer)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit answer</span>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingAnswerTextArea &&user?.id === answer.doctor.id  ? (
              <div>
                <Textarea
                value={editingAnswer}
                onChange={(e)=>{ setEditingAnswer(e.target.value)}}
                  className="mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isLoading}>
                    <X className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t(`Cancel`)}
                  </Button>
                  <Button size="sm" onClick={() => handleSaveEdit(answer.id)} disabled={isLoading}>
                    {isLoading ? <Spinner /> : <><Check className="h-4 w-4 ltr:mr-2 rtl:ml-1" />{t(`Save`)}</>}
                  </Button>
                </div>
              </div>
            ) : (
              <p>{answer.answer}</p>
            )}
          </CardContent>
        </Card>
      ))}

      <form onSubmit={handleSubmit} className="mt-6">
        <Textarea
          required
          disabled={isLoading}
          ref={answerRef}
          placeholder="Write your answer here..."
          className="mb-4"
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? <Spinner /> : t(`submit`)}
        </Button>
      </form>
      <Toaster />
    </div>
  )
}