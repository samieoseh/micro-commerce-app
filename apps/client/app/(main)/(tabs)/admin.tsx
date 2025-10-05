import React from 'react'
import { Container } from '@/src/shared/components'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import AddProduct from '@/src/features/products/components/AddProduct'
import ProductsListing from '@/src/features/products/components/ProductsListing'

export default function Admin() {
  return (
    <Container>
      <View className="flex-row items-center justify-between py-4">
        <Text variant="titleMedium" style={{ fontWeight: '700' }}>Product Admin</Text>
        <AddProduct />
      </View>

      <ProductsListing />
    </Container>
  )
}
