"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { shortName } from '@/lib/utils';
import {useState} from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation'
import SearchBar from "../ui/SearchBar";
import toast, { Toaster } from 'react-hot-toast'
import { searchPatientQuestions } from "@/lib/doctor/clientApi";
import Pagination from "../Pagination";
import Spinner from "../Spinner";
import { useTranslations } from 'next-intl'

interface IProps {
  questions: Question[];
  currentPage: number;
  totalPages: number;
}

interface Question {
  id: number;
  patientName: string;
  profilePic: string;
  question: string;
}
interface IQuestions extends IProps {
  handlePageChange:(newPage:number)=>void
  isLoading:boolean
}
const QuestionsData=({questions,currentPage,totalPages,handlePageChange,isLoading}:IQuestions)=>{
return (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {
  questions.length<=0?<div className="flex justify-center items-center">No Questions</div>
  :questions.map((q) => (
    <Link disabled={isLoading} href={`/doctor/medical-questions/${q.id}`} key={q.id} className="block h-full hover:drop-shadow-2xl">
       {/* <Button key={q.id} onClick={()=>{handleViewQuestion(q)}} className="block h-full" variant="ghost"> */}
      <Card  className="hover:shadow-md transition-shadow h-full flex flex-col">
        <CardHeader className="flex-grow">
          <div className="flex items-center gap-4 mb-4">
            <Avatar>
              <AvatarImage src={q.patient.profilePic} alt={q.patient.name} />
              <AvatarFallback>{shortName(q.patient.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{q.patient.name}</CardTitle>
          </div>
          <CardContent className="p-0">
            <p className="text-sm text-gray-600 line-clamp-3">{q.question}</p>
          </CardContent>
        </CardHeader>
      </Card>
      {/* </Button> */}
    </Link>
  ))}
</div>
<Pagination currentPage={currentPage} totalPages={totalPages}  handlePageChange={handlePageChange} />

  </>
)
}

export default function QuestionsList({ questions,currentPage,totalPages  }: IProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

    const [SearchResult, setSearchResult] = useState<{currentPage:number,totalPages:number,questions:Question[]}|null>(null)
    const t = useTranslations('doctor.Questions')



  const handleSearch = async (page:number) => {
    setIsSearching(true);
    if (!searchTerm) {
      setSearchResult(null)
      setIsSearching(false);
      return
    }

    try {
      const res = await searchPatientQuestions(searchTerm, 7, page)
      if (res.success === true) {
        console.log(res.data)
        setSearchResult({
          questions: res.data.data,
          totalPages: res.data.paginationResult.numberOfPages,
          currentPage: res.data.paginationResult.currentPage
        })
      } else {
        res.message.forEach((err: string) => 
          toast.error(err || 'An unexpected error occurred.', {
            duration: 2000,
            position: 'bottom-center',
          })
        )
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSearching(false);
    }
  }


  const handlePageChange =async (newPage: number) => {
    if(SearchResult!==null&&SearchResult.totalPages>1){
      await handleSearch(newPage)
    }
    else{

      router.push(`medical-questions?page=${newPage}`);
    }

  };

  return (
   
    <div className="container mx-auto p-4">
          <div className="flex flex-col mb-6 sm:flex-row items-center  justify-between gap-2 sm:gap-0">
      <h1 className="text-2xl font-bold ">{t(`title`)}</h1>
      <SearchBar onSearch={handleSearch} setResult={setSearchResult} searchTerm={searchTerm} setSearchTerm={setSearchTerm} title='For_Question'/>
          </div>
    
          {isSearching ? (
      <div className="flex justify-center items-center p-8">
        <Spinner />
      </div>
    ) : (
      SearchResult === null ? (
        <QuestionsData 
          currentPage={currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isSearching} 
          questions={questions} 
          totalPages={totalPages} 
        />
      ) : (
        <QuestionsData 
          currentPage={SearchResult.currentPage} 
          handlePageChange={handlePageChange} 
          isLoading={isSearching} 
          questions={SearchResult.questions} 
          totalPages={SearchResult.totalPages} 
        />
      )
    )}
    <Toaster />
    </div>
    
    )
   
}