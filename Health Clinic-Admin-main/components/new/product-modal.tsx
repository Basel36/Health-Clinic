 "use client"
import Image from "next/image"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { shortName } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import Spinner from "../Spinner"

interface IProduct {
  id:string
  name: string
  category: string
  user: string
  photo?: string
  state: boolean
  cost?: number
}
type type= "Medicine" | "Test" 

export function ProductModal({ product, onClose, onDelete,onAccept, onDecline,type ,isAccepting,isDeleting}: { isAccepting:boolean ,isDeleting:boolean, product: IProduct, onClose: () => void, onAccept: () => void, onDelete: () => void, onDecline: () => void,type:type }) {
    const t = useTranslations('Product_Modal')
  
  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${type==="Medicine" ? "h-[80vh]":null} p-0 flex flex-col`}>
        <DialogHeader className="px-6 py-4 ">
          <DialogTitle>{t(`${type}_Details`)}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-6 py-4">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={product.photo} alt={product.name} />
                <AvatarFallback>{shortName(product.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold">{product.name}</h3>
              {product.category?
                <p className="text-sm text-gray-500">{t(`Categories.${product.category}`)}</p>
                :null
              }
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <p className="text-sm font-medium mb-2">Address</p>
                {product.address.map((address, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{address}</p>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Phone</p>
                {product.phoneNumbers.map((phone, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">{phone}</p>
                ))}
              </div> */}
              
              {product.cost?
              <div>
                <p className="text-sm font-medium mb-1">{t(`Cost`)}</p>
                <p className="text-sm text-gray-500">{product.cost}</p>
              </div>
              :null}
              <div>
                <p className="text-sm font-medium mb-1">{t(`user_email`)}</p>
                <p className="text-sm text-gray-500">{product.user}</p>
              </div>
              
             
            </div>
            {product.photo?
            <div>
              <p className="text-sm font-medium mb-2">{t(`Photo`)}</p>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex p-4">
                 
                    <Image
                      width={400}
                      height={500}
                      src={product.photo}
                      alt={t(`Product_Photo`)}
                      className="h-100 w-100 rounded object-contain mr-4 last:mr-0"
                      quality={100}
                    />
            </div>
              
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
:null}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center mb-2 justify-center">
              {!product.state?
              <>
                <Button type="button"  variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm" disabled={isAccepting||isDeleting} onClick={onDecline}>
                  {isDeleting?<Spinner/>:t(`Decline`)}
                </Button>
                <Button type="button"  disabled={isAccepting||isDeleting}  className="w-full sm:w-auto text-xs sm:text-sm " onClick={onAccept}>
                  {isAccepting?<Spinner/>:t(`Accept`)}
                </Button>
                </>
:<Button type="button"  disabled={isAccepting||isDeleting}   variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm " onClick={onDelete}>
{isDeleting?<Spinner/>:t(`Delete`)}
</Button>}
              </DialogFooter>
          </div>
        
        </ScrollArea>
        
      </DialogContent>
    </Dialog>
  )
}

