import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { EmptyState, LoadingIndicator, Button } from '@/src/shared/components'
import { useCarts, useCartsMutation } from '../hooks'
import { CartItem as CartItemType } from '../types/cart'
import { CartItem } from './CartItem'
import { useRouter } from 'expo-router'

export function Carts() {
  const { data, isLoading } = useCarts()
  const { updateItemInCart, removeItemFromCart, checkout } = useCartsMutation()
  const { colors } = useTheme()
  const router = useRouter()

  if (isLoading) return <LoadingIndicator />

  const items = data?.items ?? []

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        subtitle="Items you add to your cart will appear here."
        iconName="shopping-cart"
      />
    )
  }

  const totalPrice = items.reduce((sum, it) => sum + (parseFloat(it.price) * it.quantity), 0)

  const renderItem = ({ item }: { item: CartItemType }) => (
    <View style={styles.item}>
      <CartItem
        item={item}
        onUpdateQuantity={(qty) =>
          updateItemInCart.mutate({
            itemId: item.id,
            item: {
              productId: item.productId,
              price: item.price,
              quantity: qty,
            },
          })
        }
        onRemove={() => removeItemFromCart.mutate(item.id)}
      />
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />

      <View style={styles.footer}>
        <View>
          <Text variant='bodyMedium' style={{ color: colors.onBackground }}>
            Items: {items.length}
          </Text>
          <Text variant='titleSmall' style={{ color: colors.onBackground, fontWeight: '700' }}>
            Total: ${totalPrice.toFixed(2)}
          </Text>
        </View>
        <Button
          size='sm'
          onPress={() => {
            checkout.mutate(undefined, {
              onSuccess: () => {
                router.replace('/checkout-success')
              },
            })
          }}
          isLoading={checkout.isPending}
        >
          Checkout
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  item: {
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
