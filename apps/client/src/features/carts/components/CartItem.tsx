
import { StyleSheet, TextInput, View } from 'react-native'
import { Card, Text, IconButton, Button as RNButton, useTheme } from 'react-native-paper'
import { CartItem as CartItemType } from '../types/cart'
import { useEffect, useState } from 'react'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity?: (quantity: number) => void
  onRemove?: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { colors } = useTheme()
  const [quantity, setQuantity] = useState<number | string>(item.quantity)

  useEffect(() => {
    setQuantity(item.quantity)
  }, [item.quantity])

  const handleIncrement = () => {
    const newQty = +quantity + 1
    setQuantity(newQty)
    onUpdateQuantity?.(newQty)
  }

  const handleDecrement = () => {
    if (+quantity > 1) {
      const newQty = +quantity - 1
      setQuantity(newQty)
      onUpdateQuantity?.(newQty)
    } else {
      onRemove?.()
    }
  }

  const handleDirectInput = (text: string) => {
    const parsed = parseInt(text, 10)
    if (isNaN(parsed)) {
      setQuantity('')
      return
    }
    if (!isNaN(parsed) && parsed >= 0) {
      setQuantity(parsed)
      onUpdateQuantity?.(parsed)
    }
  }

  const unitPrice = parseFloat(item.price)
  const subtotal = unitPrice * (+quantity || 0)

  return (
    <Card style={styles.card}>
      <Card.Content style={{ paddingVertical: 12 }}>
        <Text variant='bodyMedium' style={styles.title}>Product #{item.productId}</Text>
        <Text variant='bodySmall' style={styles.meta}>Item ID: {item.id} • Cart: {item.cartId}</Text>
        <View style={styles.rowBetween}>
          <Text variant='labelSmall' style={styles.price}>${unitPrice.toFixed(2)} each</Text>
          <Text variant='labelSmall' style={styles.price}>Subtotal: ${subtotal.toFixed(2)}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <View style={styles.quantityContainer}>
          <IconButton
            icon="minus"
            size={20}
            onPress={handleDecrement}
            disabled={+quantity <= 0}
            iconColor={colors.onPrimary}
            containerColor={colors.primary + '20'}
            style={styles.iconBtn}
          />
          <TextInput
            style={[styles.input, { color: colors.onBackground }]}
            value={quantity.toString()}
            keyboardType="numeric"
            onChangeText={handleDirectInput}
          />
          <IconButton
            icon="plus"
            iconColor={colors.onPrimary}
            containerColor={colors.primary + '20'}
            size={20}
            style={styles.iconBtn}
            onPress={handleIncrement}
          />
        </View>
        <RNButton mode='outlined' onPress={onRemove} textColor={colors.error} style={styles.removeButton}>
          Remove
        </RNButton>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    opacity: 0.7,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    width: 40,
    height: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    textAlign: 'center',
    marginHorizontal: 8,
    padding: 0,
  },
  iconBtn: {
    borderRadius: 6,
  },
  removeButton: {
    borderColor: 'red',
    marginLeft: 8,
  },
})
