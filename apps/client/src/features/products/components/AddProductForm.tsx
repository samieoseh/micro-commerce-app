import React from 'react'
import { Container, Button } from '@/src/shared/components'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { FormTextInput } from '@/src/shared/components'
import { useRouter } from 'expo-router'
import { useProductsMutation } from '../hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema } from '../schemas/add-product-schema'

interface AddProductFormValues {
  name: string
  brand: string
  category: string
  price: string
  stock: string
  imageUrl: string
  description: string
}

export default function AddProductForm() {
  const router = useRouter()
  const { createProduct } = useProductsMutation()

  const { control, handleSubmit, reset } = useForm<AddProductFormValues>({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: '',
      imageUrl: '',
      description: '',
    },
    resolver:zodResolver(createProductSchema),
  })

  const onSubmit = (data: AddProductFormValues) => {
    const payload = {
      name: data.name,
      brand: data.brand,
      category: data.category,
      price: data.price,
      stock: Number(data.stock) || 0,
      imageUrl: data.imageUrl,
      description: data.description || undefined,
    }

    createProduct.mutate(payload, {
      onSuccess: () => {
        reset()
        router.replace('/(main)/(tabs)/admin')
      },
    })
  }

  return (
    <Container scroll>
      <View>
        <Text variant="titleMedium" style={{ fontWeight: '700' }}>Add Product</Text>
      </View>

      <View className="mt-4">
        <FormTextInput control={control} name="name" label="Name" required={true} />
        <FormTextInput control={control} name="brand" label="Brand" required={true} />
        <FormTextInput control={control} name="category" label="Category" required={true} />
        <FormTextInput control={control} name="price" label="Price" keyboardType="decimal-pad" required={true} />
        <FormTextInput control={control} name="stock" label="Stock" keyboardType="number-pad" required={true} />
        <FormTextInput control={control} name="imageUrl" label="Image URL" required={true} />
        <FormTextInput control={control} name="description" label="Description" />
      </View>

      <View className="mt-4">
        <Button onPress={handleSubmit(onSubmit)} isLoading={createProduct.isPending}>
          Save Product
        </Button>
      </View>
    </Container>
  )
}
