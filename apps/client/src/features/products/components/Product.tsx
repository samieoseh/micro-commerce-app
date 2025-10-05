import { Button } from "@/src/shared/components";
import { Button as RNButton } from "react-native-paper";
import * as React from "react";
import { Dimensions, TextInput, View } from "react-native";
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

const { width } = Dimensions.get("window");

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onUpdateCart,
  onRemoveCart,
  carts,
}) => {
  const { colors } = useTheme();

  const cartItem = carts?.find((c) => c.productId === product.id);
  const [quantity, setQuantity] = React.useState<number | string>(
    cartItem?.quantity ?? 0
  );

  React.useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleIncrement = () => {
    if (+quantity < product.stock) {
      const newQty = +quantity + 1;
      setQuantity(newQty);
      onUpdateCart?.(product.id, newQty);
    }
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
    if (isNaN(parsed)) {
      setQuantity("");
    }
    if (!isNaN(parsed) && parsed >= 0) {
      setQuantity(parsed);
      onUpdateCart?.(product.id, parsed);
    }
  };

  return (
    <Card className="rounded-xl" style={{ width: width / 2 - 20, elevation: 4, marginBottom: 10 }}>
      <Card.Cover source={{ uri: product.imageUrl }} />

      <Card.Content style={{paddingVertical: 8}}>
        <Text variant="bodySmall" style={{color: colors.primary,}}>{product.name}</Text>
        <Text variant="labelSmall" style={{fontWeight: "300"}}>
          {product.brand} • {product.category}
        </Text>
        <Text variant="bodySmall">{product.stock > 0 ? `${product.stock} left`: "Out of stock"}</Text>
        <Text variant="bodyMedium" style={{fontWeight:"bold", marginTop: 4}}>
          ${product.price}
        </Text>
      </Card.Content>

      <Card.Actions>
        {!cartItem ? (
          <Button
            size="sm"
            mode="contained"
            disabled={product.stock === 0}
            onPress={() => onAddToCart?.(product.id, 1)}
          >
            Add to Cart
          </Button>
        ) : (
          <View className="flex-row items-center flex-1 justify-center">
             <IconButton
              icon="minus"
              size={20}
              onPress={handleDecrement}
              iconColor={colors.onPrimary}
              containerColor={colors.primary + '20'}
              style={{
                borderRadius: 6
              }}
            />
            <TextInput
              style={{ 
                  width: 40,
                  height: 32,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 6,
                  textAlign: "center",
                  marginHorizontal: 8,
                  padding: 0,
                  color: colors.onBackground 
                }}
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
        <View style={{
           padding: 4, marginBottom: 12
        }}>
          <RNButton
            mode="outlined"
            onPress={handleRemove}
            className="ml-3 w-24 p-0"
            style={{ borderColor: colors.error, borderWidth: 1 }}
            textColor={colors.error}
          >
            Remove
          </RNButton>
        </View>
      )}
    </Card>
  );
};

export default ProductCard;