"use client"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTranslations } from 'next-intl'

interface SearchBarProps {
  onSearch: (page:number) => void;
  setResult:(result) => void;
  setSearchTerm:(keyword:string)=>void
  searchTerm:string
  title:string
}



const SearchBar = ({ onSearch ,setResult,setSearchTerm,searchTerm,title}: SearchBarProps) => {
  const t = useTranslations('search')

  const search = async (e) => {
    e.preventDefault()
    if (searchTerm.trim().length > 0) {
      await onSearch(1)
    }
  }
  

const check=(e)=>{
  if(e.target.value.trim().length===0){
    setResult(null)
    // router.refresh()
    // router.refresh(`doctor?page=${currentPage}&date=${currentDate}`);
  }

}

  return (
    <form className="ml-1 w-full max-w-fit mr-1" onSubmit={(e) => {search(e)}}>
      <div className="relative">
        <Search className="absolute left-2.5 top-[10px] h-4 w-4 text-muted-foreground" />
        <Input
        value={searchTerm}
          type="search"
          placeholder={`${t(`${title}`)}`}
          className="w-full h-9 appearance-none bg-background pl-8 pr-3 shadow-none rounded-full"
     onChange={e=>{setSearchTerm(e.target.value); check(e)}}
        />
      </div>
    </form>
  )
}

export default SearchBar