import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import React from 'react';
import { EmptyState, LoadingIndicator } from '@/src/shared/components';
import ProductCard from './Product';
import { useProducts } from '../hooks';
import { useCarts, useCartsMutation } from '../../carts/hooks';

export function Products() {
  const { data: products, isLoading } = useProducts();
  const {data: carts} = useCarts();
  const {addToCart, updateItemInCart, removeItemFromCart } = useCartsMutation()


  if (isLoading) return <LoadingIndicator />;

  if (!products || products.length === 0) {
    return (
      <EmptyState 
        title="No products found." 
        subtitle="Please check back later" 
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ProductCard 
            product={item} 
            onAddToCart={(id) => addToCart.mutate({
                productId: id,
                price: item.price,
                quantity: 1
            })}
            onUpdateCart={(id, quantity) => updateItemInCart.mutate({
                itemId: carts?.items.find(c => c.productId === id)?.id ?? 0,
                item : {productId: id,
                price: item.price,
                quantity
                }
            })}
            onRemoveCart={(id) => removeItemFromCart.mutate(
                 carts?.items.find(c => c.productId === id)?.id ?? 0,
            )}
            carts={carts?.items ?? []}
          />
        </View>
      )}
      numColumns={2}                        
      columnWrapperStyle={styles.row}      
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  row: {
    justifyContent: 'space-between',
    gap: 10,
  },
  item: {
    flex: 1,
    
  },
});
