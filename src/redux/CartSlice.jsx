import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItemToCart: (state, action) => {
      const itemInCart = state.items.find(item => item._id === action.payload._id);
      const currentTime = new Date().toISOString(); // Capture the current time
      if (itemInCart) {
        itemInCart.quantity += action.payload.quantity;
        itemInCart.timestamp = currentTime; // Update the timestamp when the quantity changes
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: action.payload.quantity, 
          timestamp: currentTime // Add timestamp when a new item is added
        });
      }
    },
    updateItemQuantity: (state, action) => {
      const itemInCart = state.items.find(item => item._id === action.payload._id);
      if (itemInCart) {
        itemInCart.quantity = action.payload.quantity;
        itemInCart.timestamp = new Date().toISOString(); // Update the timestamp when the quantity is updated
      }
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload._id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItemToCart, updateItemQuantity, removeItemFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
