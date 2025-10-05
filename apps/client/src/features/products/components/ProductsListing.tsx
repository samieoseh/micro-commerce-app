// this component will be used to list products in the admin panel
import React from 'react'
import { FlatList, Image, View } from 'react-native'
import { IconButton, Text, useTheme } from 'react-native-paper'
import { useProducts, useProductsMutation } from '../hooks'
import { useRouter } from 'expo-router'
import { EmptyState, LoadingIndicator } from '@/src/shared/components'

export default function ProductsListing() {
  const { colors } = useTheme()
  const { data: products, isLoading } = useProducts()
  const { deleteProduct } = useProductsMutation()
  const router = useRouter()

  if (isLoading) {
    return (
      <LoadingIndicator />
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState title="No products found." subtitle='Please add some products.' />
    )
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-200 dark:bg-gray-800" />}
      renderItem={({ item }) => (
        <View className="flex-row items-center py-3" style={{ paddingVertical: 4 }}>
          <Image source={{ uri: item.imageUrl }} style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12 }} />
          <View className="flex-1" style={{flex: 1}}>
            <Text variant='bodyMedium' numberOfLines={1}>{item.name}</Text>
            <Text variant='labelSmall' style={{ opacity: 0.7 }}>
              {item.brand} • {item.category}
            </Text>
            <Text variant='labelSmall' style={{ fontWeight: '700', marginTop: 2 }}>${item.price} • Stock: {item.stock}</Text>
          </View>

          <IconButton
            icon="pencil"
            size={18}
            iconColor={colors.onPrimary}
            containerColor={colors.primary + '20'}
            style={{ borderRadius: 6, marginRight: 8 }}
            onPress={() => {
              router.push(`/products/edit-product/${item.id}`)
            }}
          />

          <IconButton
            icon="trash-can"
            size={18}
             iconColor="#b71c1c"           
              containerColor={colors.error} 
            style={{ borderRadius: 6 }}
            onPress={() => deleteProduct.mutate(item.id)}
          />
        </View>
      )}
    />
  )
}
