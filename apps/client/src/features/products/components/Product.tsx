import { Button } from "@/src/shared/components";
import { Button as RNButton } from "react-native-paper"
import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Card, Text, IconButton, useTheme } from "react-native-paper";
import { Product } from "../types/products";
import { CartItem } from "../../carts/types/cart";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: number, quantity?: number) => void;
  onUpdateCart?: (id: number, quantity: number) => void;
  onRemoveCart?: (id: number) => void;
  carts?: CartItem[];
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onUpdateCart, onRemoveCart, carts, }) => {
    const {colors} = useTheme()
  const cartItem = carts?.find((c) => c.productId === product.id);
  const [quantity, setQuantity] = React.useState<number | string>(cartItem?.quantity ?? 0);

  React.useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleIncrement = () => {
    const newQty = +quantity + 1;
    setQuantity(newQty);
    onUpdateCart?.(product.id, newQty);
  };

  const handleDecrement = () => {
    if (+quantity > 1) {
      const newQty = +quantity - 1;
      setQuantity(newQty);
      onUpdateCart?.(product.id, newQty);
    } else {
      onRemoveCart?.(product.id);
    }

  };

  const handleRemove = () => {
    setQuantity(0);
    onRemoveCart?.(product.id);
  };

  const handleDirectInput = (text: string) => {
    const parsed = parseInt(text, 10);
    if(isNaN(parsed)) {
        setQuantity("");
    }
    if (!isNaN(parsed) && parsed >= 0) {
      setQuantity(parsed);
      onUpdateCart?.(product.id, parsed);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: product.imageUrl }} />

      <Card.Content style={{ paddingVertical: 8 }}>
        <Text variant="bodySmall">{product.name}</Text>
        <Text variant="labelSmall">{product.brand} • {product.category}</Text>
        <Text variant="bodyMedium" style={styles.price}>${product.price}</Text>
      </Card.Content>

      <Card.Actions>
        {!cartItem || quantity === 0 ? (
          <Button
            size="sm"
            mode="contained"
            onPress={() => onAddToCart?.(product.id, 1)}
          >
            Add to Cart
          </Button>
        ) : (
          <View style={styles.quantityContainer}>
            <IconButton
              icon="minus"
              size={20}
              onPress={handleDecrement}
              disabled={+quantity <= 0}
              iconColor={colors.onPrimary}
              containerColor={colors.primary + '20'}
              style={{
                borderRadius: 6
              }}
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
              style={{
                borderRadius: 6
              }}
              onPress={handleIncrement}
            />
            
          </View>
        )}
      </Card.Actions>
      {cartItem && +quantity > 0 && (
        <View className="px-3 pb-3 w-full flex flex-row justify-end">
        <RNButton
        mode="outlined"
        
        onPress={handleRemove}
        style={styles.removeButton}
        textColor={colors.error}
        >
            Remove
        </RNButton>
      </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 10,
  },
  price: {
    fontWeight: "bold",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    width: 40,
    height: 32,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    textAlign: "center",
    marginHorizontal: 8,
    padding: 0,
  },
  removeButton: {
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 6,
    marginLeft: 12,
    width: 100,
    padding: 0,
  },
});

export default ProductCard;
