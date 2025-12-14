// ✅ THÊM MỚI - Shared store cho filtered products
import { ref } from 'vue'
import type { Product } from '@/modules/products/product.type'

interface FilteredProductsState {
  products: Product[]
  filterType: string
  isFromHome: boolean
}

const filteredProductsState = ref<FilteredProductsState>({
  products: [],
  filterType: '',
  isFromHome: false,
})

export const useFilteredProducts = () => {
  const setFilteredProducts = (products: any[], filterType: string) => {
    filteredProductsState.value = {
      products,
      filterType,
      isFromHome: true,
    }
  }

  const getFilteredProducts = () => {
    return filteredProductsState.value
  }

  const clearFilteredProducts = () => {
    filteredProductsState.value = {
      products: [],
      filterType: '',
      isFromHome: false,
    }
  }

  return {
    setFilteredProducts,
    getFilteredProducts,
    clearFilteredProducts,
  }
}
