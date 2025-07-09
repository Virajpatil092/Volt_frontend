import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from './productsSlice';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existingItem = state.items.find(item => 
        (item.product._id && action.payload.product._id) 
          ? item.product._id === action.payload.product._id
          : item.product.model.name === action.payload.product.model.name &&
            item.product.battery.name === action.payload.product.battery.name
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity,
        });
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product.rate * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<{ modelName: string; batteryName: string }>) => {
      state.items = state.items.filter(item => 
        !(item.product.model.name === action.payload.modelName && 
          item.product.battery.name === action.payload.batteryName)
      );
      state.total = state.items.reduce((sum, item) => sum + (item.product.rate * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ modelName: string; batteryName: string; quantity: number }>) => {
      const item = state.items.find(item => 
        item.product.model.name === action.payload.modelName &&
        item.product.battery.name === action.payload.batteryName
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.total = state.items.reduce((sum, item) => sum + (item.product.rate * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;