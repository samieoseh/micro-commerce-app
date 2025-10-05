import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CARTS_QUERY_KEY } from '@/src/shared/constants'
import { CartsService } from '../services'
import { CartItemPayload } from '../types/cart'

export  function useCarts() {
  return useQuery({
    queryKey: [CARTS_QUERY_KEY],
    queryFn: CartsService.getAll,
  })
}

export function useCartsMutation() {
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: (payload: CartItemPayload) => CartsService.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [CARTS_QUERY_KEY]})
    },
    
    onError: (error) => {
      console.error('Error adding product to cart:', error);
    }
  })

  const updateItemInCart = useMutation({
    mutationFn: (payload: {itemId: number, item: CartItemPayload}) => CartsService.updateItemInCart(payload.itemId, payload.item),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [CARTS_QUERY_KEY]})
    },
    
    onError: (error) => {
      console.error('Error adding product to cart:', error);
    }
  })

  const removeItemFromCart = useMutation({
    mutationFn: (itemId: number) => CartsService.removeItemFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [CARTS_QUERY_KEY]})
    },
    
    onError: (error) => {
      console.error('Error adding product to cart:', error);
    }
  })

  const checkout = useMutation({
    mutationFn: () => CartsService.checkout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARTS_QUERY_KEY] })
    },
    onError: (error) => {
      console.error('Error during checkout:', error)
    }
  })

  return {
    addToCart,
    updateItemInCart,
    removeItemFromCart,
    checkout,
  }
} 
