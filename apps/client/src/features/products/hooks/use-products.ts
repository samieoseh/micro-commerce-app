import { CARTS_QUERY_KEY, PRODUCTS_QUERY_KEY } from '@/src/shared/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductsService } from '../services/ProductsService';
import { CartsService } from '../../carts/services';
import { CartItemPayload } from '../../carts/types/cart';

export function useProducts() {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: ProductsService.getAll,
  })
}
