import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import ProductForm from '@/src/features/products/components/ProductForm';

export default function EditProduct() {
    const {id} = useLocalSearchParams<{id: string}>();
    console.log("Editing product with ID:", id);
  return (
    <ProductForm id={id} />
  )
}