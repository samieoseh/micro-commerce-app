import React from 'react'
import { IconButton, useTheme } from 'react-native-paper'
import { useRouter } from 'expo-router'

export default function AddProduct() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <IconButton
      icon="plus"
      size={20}
      iconColor={colors.onPrimary}
      containerColor={colors.primary + '20'}
      style={{ borderRadius: 6 }}
      onPress={() => {
        router.push('/products/add-product')
      }}
    />
  )
}
