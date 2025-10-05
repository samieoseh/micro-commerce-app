import { PRODUCTS_QUERY_KEY } from '@/src/shared/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductsService } from '../services/ProductsService';
import { CreateProductPayload } from '../types/products'

export function useProducts() {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: ProductsService.getAll,
  })
}

export function useProductsMutation() {
  const queryClient = useQueryClient()

  const createProduct = useMutation({
    mutationFn: (payload: CreateProductPayload) => ProductsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
    },
    onError: (error) => {
      console.error('Error creating product:', error)
    },
  })

  const updateProduct = useMutation({
    mutationFn: (payload: { id: number; data: CreateProductPayload }) =>
      ProductsService.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
    },
    onError: (error) => {
      console.error('Error updating product:', error)
    },
  })

  const deleteProduct = useMutation({
    mutationFn: (id: number) => ProductsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
    },
    onError: (error) => {
      console.error('Error deleting product:', error)
    },
  })

  return { createProduct, updateProduct, deleteProduct }
}
