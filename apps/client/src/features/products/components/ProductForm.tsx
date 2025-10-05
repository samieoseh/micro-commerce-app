import React, { useEffect } from 'react'
import { Container, Button, LoadingIndicator } from '@/src/shared/components'
import { View } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import { useForm } from 'react-hook-form'
import { FormTextInput } from '@/src/shared/components'
import { useRouter } from 'expo-router'
import { useProductsMutation, useProducts } from '../hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema } from '../schemas/add-product-schema'

interface ProductFormValues {
  name: string
  brand: string
  category: string
  price: string
  stock: string
  imageUrl: string
  description: string
}

export default function ProductForm({ id }: { id?: string }) {
  const router = useRouter()
  const {colors} = useTheme()
  const { createProduct, updateProduct } = useProductsMutation()
  const { data: products, isLoading: isLoadingProduct } = useProducts()
  const product = products?.find((p) => p.id === Number(id))

  const { control, handleSubmit, reset } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: '',
      imageUrl: '',
      description: '',
    },
    resolver: zodResolver(createProductSchema),
  })

  // Populate form when editing
  useEffect(() => {
    if (product && id) {
      reset({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        imageUrl: product.imageUrl,
        description: product.description || '',
      })
    }
  }, [product, id, reset])

  const onSubmit = (data: ProductFormValues) => {
    const payload = {
      name: data.name,
      brand: data.brand,
      category: data.category,
      price: data.price,
      stock: Number(data.stock) || 0,
      imageUrl: data.imageUrl,
      description: data.description || undefined,
    }

    if (id) {
      // Update existing product
      updateProduct.mutate(
        { id: Number(id), data: payload },
        {
          onSuccess: () => {
            router.back()
          },
        }
      )
    } else {
      // Create new product
      createProduct.mutate(payload, {
        onSuccess: () => {
          reset()
          router.replace('/(main)/(tabs)/admin')
        },
      })
    }
  }

  const isLoading = id ? isLoadingProduct : false

  if (isLoading) {
    return (
      <LoadingIndicator />
    )
  }

  return (
   <Container scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" }}>
        <IconButton
          icon="arrow-left"
          size={20}
          iconColor={colors.primary}
          onPress={() => router.back()}
          style={{padding: 0, margin: 0}}
        />
        <Text variant="titleMedium" style={{ fontWeight: '700' }}>
          {id ? 'Edit Product' : 'Add Product'}
        </Text>
      </View>

      <View style={{ marginTop: 16 }}>
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
          {id ? "Update Product" : "Create Product"}
        </Button>
      </View>
    </Container>
  )
}