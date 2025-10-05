// this component will be used to list products in the admin panel
import { View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'

export default function ProductsListing() {
  return (
   <View className="flex-1 items-center justify-center">
        <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
          Admin panel placeholder — add, edit, and manage products here.
        </Text>
      </View>
  )
}