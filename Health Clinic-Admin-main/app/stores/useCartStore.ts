import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  profilePic?: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'test' | 'medicine'; // Add this line to differentiate between tests and medicines
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, newItem] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getItemQuantity: (id) => {
        const item = get().items.find((item) => item.id === id)
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
)