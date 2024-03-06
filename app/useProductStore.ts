import { create } from "zustand";

// Define o estado inicial e as funções de atualização
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  page: number;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  page: 0,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setPage: (page) => set({ page }),
}));
