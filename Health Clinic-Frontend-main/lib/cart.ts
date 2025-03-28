import { create } from 'zustand'
import {  AddToCart, GetMyCart, RemoveMedicineFromCart, RemoveTestFromCart, updateMedicineQuantity } from '@/lib/patient/clientApi'

interface Pharmacy {
  _id: string
  profilePic: string
  name: string
  address:string[]
  id: string
}
interface ILabSchedule {
  schedule:{days:{day:string,startTime:string,endTime:string,limit:number}[]}
  }
interface Lab {
  _id: string
  profilePic: string
  name: string
  address:string[]
  schedule:ILabSchedule
  id: string
}
 
interface Medicine {
  _id: string
  medicine: {
    _id: string
    name: string
    id: string
  }
  pharmacy: string
  stock: string
  createdAt: string
  updatedAt: string
  __v: number
  id: string
}

interface Test {
  _id: string
  lab: string
  test: {
    _id: string
    name: string
    id: string
  }
  preparations: string[]
  cost: number
  createdAt: string
  updatedAt: string
  __v: number
  id: string
}

interface PurchasedMedicine {
  medicineId: Medicine
  price: number
  quantity: number
  _id: string
  id: string
}

interface PurchasedTest {
  testId: Test
  price: number
  _id: string
  id: string
}

interface PharmacyPurchase {
  pharmacyId: Pharmacy
  purchasedMedicines: PurchasedMedicine[]
  _id: string
  id: string
}

interface LabPurchase {
  labId: Lab
  purchasedTests: PurchasedTest[]
  _id: string
  id: string
}

interface CartData {
  _id: string
  user: string
  totalMedicinePrice: number
  totalTestPrice: number
  totalPrice: number
  medicines: PharmacyPurchase[]
  tests: LabPurchase[]
  createdAt: string
  updatedAt: string
  id: string
}

interface CartStore {
  cart: CartData | null
  isLoading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  removeMedicine: (medicineId: string) => Promise<void>
  updateMedicineQuantity: (medicineId:string,quantity:number) => Promise<void>
  removeTest: (testId: string) => Promise<void>
  addToCart: (id:{medicineId: string}|{testId: string}) => Promise<void>
}

const channel = typeof window !== 'undefined' ? new BroadcastChannel('cart_channel') : null

const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await GetMyCart();
      set({ cart: response.data.data[0], isLoading: false })
    } catch {
      set({ error: 'Failed to fetch cart', isLoading: false })
    }
  },

  
  removeMedicine: async (medicineId:string) => {
    set({  error: null })
    try {
      const response = await RemoveMedicineFromCart(medicineId);
      set({ cart: response.data.data, isLoading: false })
    } catch {
      set({ error: 'Failed to remove medicine from cart', isLoading: false })
    }
  },

  updateMedicineQuantity: async (medicineId:string,quantity:number) => {
    set({  error: null })
    try {
      const response = await updateMedicineQuantity({type:"medicine",quantity},medicineId);
      console.log(response.data.data)
      set({ cart:  response.data.data, isLoading: false })
    } catch {
      set({ error: 'Failed to update medicine quantity', isLoading: false })
    }
  },

  removeTest: async (testId:string) => {
    set({  error: null })
    try {
      const response = await RemoveTestFromCart(testId);
      set({ cart: response.data.data, isLoading: false })
    } catch {
      set({ error: 'Failed to remove test from cart', isLoading: false })
    }
  },
  addToCart: async (id:{medicineId: string}|{testId: string}) => {
    set({  error: null })
    try {
      const response = await AddToCart(id);
      
      set({ cart: response.data.data, isLoading: false })
      channel?.postMessage({ type: 'UPDATE_CART' })
      return {success:true}
    } catch {
      console.log("dasadasd")
      set({ error: 'Failed to add test to cart', isLoading: false })
      return {success:false}
    }
  },
}))

export default useCartStore
