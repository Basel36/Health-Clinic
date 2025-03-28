"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import useCartStore from '@/lib/cart'

export function CartIcon() {
  const { cart, fetchCart } = useCartStore()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    fetchCart()
    const channel = new BroadcastChannel('cart_channel')
    
    const handleCartUpdate = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_CART') {
        fetchCart()
      }
    }
    
    channel.addEventListener('message', handleCartUpdate)
    
    return () => {
      channel.removeEventListener('message', handleCartUpdate)
      channel.close()
    }
  }, [fetchCart])

  useEffect(() => {
    if (cart) {
      const medicineCount = cart.medicines.reduce((total, pharmacy) => 
        total + pharmacy.purchasedMedicines.length, 0)
      const testCount = cart.tests.reduce((total, lab) => 
        total + lab.purchasedTests.length, 0)
      setItemCount(medicineCount + testCount)
    }
  }, [cart])

  return (
    <Link href="/patient/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge 
            variant="default" 
            className="absolute -top-0.5 -right-0 px-1 py-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
        <span className="sr-only">Cart</span>
      </Button>
    </Link>
  )
}

