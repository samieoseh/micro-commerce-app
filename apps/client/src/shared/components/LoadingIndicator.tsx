import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function LoadingIndicator({
  size = 'large',
}: {
  size?: 'small' | 'large' | number;
}) {
  return (
    <View>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
}