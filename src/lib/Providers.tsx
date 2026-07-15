"use client";

import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/contexts/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-xl !shadow-lg !px-4 !py-3 !text-sm !font-medium"
        progressClassName="!h-1"
      />
    </CartProvider>
  );
}
