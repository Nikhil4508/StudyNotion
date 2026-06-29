import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const getCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const getTotalFromStorage = () => {
  const storedTotal = localStorage.getItem("total");
  return storedTotal ? JSON.parse(storedTotal) : 0;
};

const getTotalItemsFromStorage = () => {
  const storedTotalItems = localStorage.getItem("totalItems");
  return storedTotalItems ? JSON.parse(storedTotalItems) : 0;
};

const initialState = {
  cart: getCartFromStorage(),
  total: getTotalFromStorage(),
  totalItems: getTotalItemsFromStorage(),
};

// Self-healing: Ensure count and total match the actual cart array
if (initialState.cart.length > 0) {
  initialState.totalItems = initialState.cart.length;
  initialState.total = initialState.cart.reduce((acc, curr) => acc + curr.price, 0);
} else if (initialState.totalItems > 0) {
  // If array is empty but count is > 0, it's legacy data. Reset it.
  initialState.totalItems = 0;
  initialState.total = 0;
  localStorage.setItem("totalItems", 0);
  localStorage.setItem("total", 0);
}

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart(state, action) {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        toast.error("Course already in cart");
        return;
      }

      state.cart.push(course);
      state.totalItems = state.cart.length;
      state.total = state.cart.reduce((acc, curr) => acc + curr.price, 0);

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      toast.success("Course added to cart");
    },
    removeFromCart(state, action) {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        state.cart.splice(index, 1);
        state.totalItems = state.cart.length;
        state.total = state.cart.reduce((acc, curr) => acc + curr.price, 0);

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        toast.success("Course removed from cart");
      }
    },
    resetCart(state) {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
