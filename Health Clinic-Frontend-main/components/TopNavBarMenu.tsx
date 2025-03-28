"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from 'next-intl'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { shortName } from "@/lib/utils"
import { logout } from "@/actions/logout"


interface IProps {
 user:{role:string,name:string,profilePic:string}
}
const TopNavBarMenu = ({user}:IProps) => {
 
  const t = useTranslations('TopBarDropMenu')
  
  return (
 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src={user.profilePic } alt={shortName(user.name)} />
                  <AvatarFallback>{shortName(user.name)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t(`MyAccount`)}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/${user.role}/profile`} >  <DropdownMenuItem className="cursor-pointer"> {t(`Profile`)}
            </DropdownMenuItem></Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>  <form action={logout}>
              <Button variant="ghost" className="h-5" type="submit">
              {t(`Logout`)}
              </Button>
            </form></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
     
  )
}

export default TopNavBarMenu