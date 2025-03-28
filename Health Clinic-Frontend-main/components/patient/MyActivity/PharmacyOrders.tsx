'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { shortName } from '@/lib/utils'
import Pagination from '@/components/Pagination'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'



interface medicineDtails {
  id:string
  name:string
  photo:string
  category:string
  
}

interface IPharmacyReservation {
  pharmacy:{name:string,id:string,porfilePic:string,phoneNumbers:string[]}
  id:string
  state:string
  medicines:{medicineId:{medicine:medicineDtails},price:number,quantity:number,id:string}[]
  paymentMethod:string
  totalCost:string
}

interface IProps {
  currentPage:number
   totalPages:number
  orders:IPharmacyReservation[];
}

export default function PharmacyOrders({orders,currentPage,totalPages}:IProps) {
  const router = useRouter();
  const t = useTranslations('patient.my_activity')
  const tcommon = useTranslations('common')

const handlePageChange=(newPage:number)=>{
  router.push(`my-activity?pharmaciesPage=${newPage}&activeTab=pharmacies`);
}

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="w-full">
          <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <Avatar>
                  <AvatarImage src={order.pharmacy.porfilePic} alt={order.pharmacy.name} />
                  <AvatarFallback>{shortName(order.pharmacy.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{order.pharmacy.name}</h3>
                  <p className="text-sm text-gray-500">{order.pharmacy.phoneNumbers[0]}</p>

                </div>
              </div>
              <div className="flex flex-col items-center" >

              <p className="text-sm text-gray-500">{`${t(`State`)}: ${t(`${order.state}`)}`}</p>
              <p className="text-sm text-gray-500">{`${t(`Pay_Method`)}: ${t(`${(order.paymentMethod).toLowerCase()}`)}`}</p>
              </div>
            </div>
            <div>
            <div className="flex justify-between">

<h4 className="font-semibold mb-2">{`${t(`Products`)}:`}</h4>
<h4 className="font-semibold mb-2">{`${t(`Unit_Price`)}:`}</h4>
      </div>
              <ul className="space-y-1">
                {order.medicines.map((product) => (
                  <li key={product.id} className="flex justify-between items-center ">
                    <div className="flex flex-col items-center space-y-1 sm:space-y-0 my-1 sm:flex-row sm:space-x-2 ">

                      <Avatar >
                  <AvatarImage src={product.medicineId.medicine.photo} alt={product.medicineId.medicine.name} />
                  <AvatarFallback>{shortName(product.medicineId.medicine.name)}</AvatarFallback>
                </Avatar>
                    <span>{product.medicineId.medicine.name} (x{product.quantity})</span>
                    </div>
                    <span>{`${product.price * product.quantity} ${tcommon(`EGP`)}`}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 text-right font-semibold">
              {`${t(`Total`)}: ${order.totalCost} ${tcommon(`EGP`)}`}
            </div>
          </CardContent>
        </Card>
      ))}
      <Pagination  currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
    </div>
  )
}

