import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);

        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }

        return {
          items: [...state.items, { ...product, quantity }]
        };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter(item => item.id !== productId)
          };
        }

        return {
          items: state.items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        };
      }),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.discount_price || item.price;
          return total + (parseFloat(price) * item.quantity);
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + (parseFloat(item.price) * item.quantity);
        }, 0);
      },

      getDiscount: () => {
        const { items } = get();
        return items.reduce((discount, item) => {
          if (item.discount_price) {
            return discount + ((parseFloat(item.price) - parseFloat(item.discount_price)) * item.quantity);
          }
          return discount;
        }, 0);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token });
        if (token) {
          localStorage.setItem('token', token);
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },

      isAuthenticated: () => {
        const state = get();
        return !!state.token;
      },

      isAdmin: () => {
        const state = get();
        return state.user?.is_admin || false;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
