export const AUTH_ENDPOINTS = {
  SIGN_IN: '/auth/login',
  SIGN_UP: '/auth/signup',
  FORGOT_PASSWORD: '/forgot-password',
};

export const PRODUCTS_ENDPOINTS = {
  GET_ALL: '/products',
  CREATE: '/products',
  UPDATE: (id: number) => `/products/${id}`,
  DELETE: (id: number) => `/products/${id}`,
};

export const CARTS_ENDPOINTS = {
  GET_ALL_ITEMS: '/cart/items',
  ADD_TO_CART: '/cart/items',
  UPDATE_IN_CART: (itemId: number) => `/cart/items/${itemId}`,
  REMOVE_FROM_CART: (itemId: number) => `/cart/items/${itemId}`,
  CHECKOUT: '/orders',
};
