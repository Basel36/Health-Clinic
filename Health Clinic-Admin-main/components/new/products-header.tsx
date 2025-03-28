"use client"
import { useState } from "react"
import { AddMedicineModal } from "./addMedicineModal"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { AddTestModal } from "./addTestModal"

type type= "Medicine" | "Test" 

export function ProductsHeader({type}:{type:type}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const t = useTranslations('header')
  
  return (
    
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 items-center justify-between p-2">

    <h1 className="text-3xl font-bold text-center">{t(`${type}s_Management`)}</h1>
   
    <Button className="w-full sm:w-auto" onClick={() => setIsAddModalOpen(true)}>
    {t(`Add_New_${type}`)}
  </Button>
  {type==="Medicine"?
  <AddMedicineModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
:  <AddTestModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
  }
  </div>
  )
}

