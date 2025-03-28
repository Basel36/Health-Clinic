"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'

export default function YearSelector({selectedYear}:{selectedYear:string}) {
  const [year, setYear] = React.useState(selectedYear)
  const router = useRouter()
  
  // Generate array of years from 2020 to 2030
  const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString())

  const handleYearChange = (selectedYear: string) => {
    setYear(selectedYear)
    router.push(`analytics?year=${selectedYear}`)

  }

  return (
    <Select defaultValue={selectedYear} value={year} onValueChange={handleYearChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Years</SelectLabel>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

