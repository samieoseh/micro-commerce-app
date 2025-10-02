import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { ThemedView } from '../themed-view';

export default function Loading() {
  const { colors } = useTheme();
  return (
    <ThemedView
      className="flex flex-1"
      lightColor={colors.background}
      darkColor={colors.background}
    >
      <View className="py-32 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </ThemedView>
  );
}