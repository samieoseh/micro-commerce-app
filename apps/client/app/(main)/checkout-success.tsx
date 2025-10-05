import React from 'react'
import { Container } from '@/src/shared/components'
import { View } from 'react-native'
import { Button } from '@/src/shared/components'
import { Text, useTheme } from 'react-native-paper'
import { useRouter } from 'expo-router'

export default function CheckoutSuccess() {
  const { colors } = useTheme()
  const router = useRouter()

  return (
    <Container>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Text variant='titleLarge' style={{ color: colors.primary, fontWeight: '700' }}>
          Order Placed Successfully!
        </Text>
        <Text variant='bodyMedium' style={{ textAlign: 'center', opacity: 0.8 }}>
          Thank you for your purchase. You can continue shopping or view more products.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Button size='sm' onPress={() => router.replace('/(main)/(tabs)')}>
            Go to Home
          </Button>
          <Button size='sm' color='gray' mode='outlined' onPress={() => router.replace('/(main)/(tabs)/cart')}>
            Back to Cart
          </Button>
        </View>
      </View>
    </Container>
  )
}
