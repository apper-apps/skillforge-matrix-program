import cartData from "@/services/mockData/cart.json";
import { delay } from "@/utils/delay";

let cartItems = [...cartData];

export const cartService = {
  async getAll() {
    await delay(200);
    return [...cartItems];
  },

  async addItem(courseId, price) {
    await delay(300);
    const existingItem = cartItems.find(item => item.courseId === courseId);
    if (existingItem) {
      return { ...existingItem };
    }
    
    const newId = Math.max(...cartItems.map(item => item.Id), 0) + 1;
    const newItem = {
      Id: newId,
      courseId,
      price,
      addedDate: new Date().toISOString()
    };
    
    cartItems.push(newItem);
    return { ...newItem };
  },

  async removeItem(courseId) {
    await delay(200);
    const index = cartItems.findIndex(item => item.courseId === courseId);
    if (index !== -1) {
      cartItems.splice(index, 1);
      return true;
    }
    return false;
  },

  async clearCart() {
    await delay(200);
    cartItems = [];
    return true;
  },

  async getCartTotal() {
    await delay(100);
    return cartItems.reduce((total, item) => total + item.price, 0);
  }
};