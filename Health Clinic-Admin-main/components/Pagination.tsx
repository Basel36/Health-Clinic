import { Button } from "@/components/ui/button"
import {  ChevronLeft, ChevronRight } from "lucide-react"

interface IPrpos {
      handlePageChange:(newPage:number)=>void;
      currentPage: number;
      totalPages: number;
      isLoading?: boolean;
      
};

const Pagination =({handlePageChange,currentPage,totalPages,isLoading=false}:IPrpos)=>{
      return(
            <div className="flex justify-center items-center p-4 gap-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          size="icon"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {currentPage} / {totalPages<=1?1:totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          size="icon"
          variant="outline"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      )
}

export default Pagination