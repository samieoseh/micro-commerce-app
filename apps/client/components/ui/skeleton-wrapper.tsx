import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type SkeletonWrapperProps = {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * A wrapper that shows a skeleton UI while content is loading.
 */
export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  isLoading,
  skeleton,
  children,
  containerStyle,
}) => {
  return <View style={containerStyle}>{isLoading ? skeleton : children}</View>;
};