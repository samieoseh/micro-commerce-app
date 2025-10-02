import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  ButtonProps,
  Button as RNPButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { withOpacity } from '../utils/color';

interface CustomButtonProps {
  size?: 'sm' | 'lg' | 'xl' | 'xxl';
  rounded?: 'sm' | 'lg';
  color?: 'success' | 'primary' | 'secondary' | 'error' | 'gray';
  isLoading?: boolean;
  loader?: React.ReactNode; // optional custom loader
}

export function Button(props: ButtonProps & CustomButtonProps) {
  const {
    size = 'lg',
    rounded = 'lg',
    color = 'primary',
    style,
    children,
    isLoading = false,
    loader,
    disabled,
    mode = 'contained',
    ...rest
  } = props;

  const { colors } = useTheme();

  // Size map (padding + font size)
  const sizeMap = {
    sm: { paddingVertical: 4, paddingHorizontal: 12, fontSize: 12 },
    lg: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
    xl: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16 },
    xxl: { paddingVertical: 16, paddingHorizontal: 28, fontSize: 18 },
  };

  // Rounded map (border radius)
  const roundedMap = {
    sm: 8,
    lg: 100, // pill shape
  };

  // Color map (background + text color)
  const colorMap = {
    primary: { backgroundColor: colors.primary, color: colors.onPrimary },
    secondary: { backgroundColor: colors.secondary, color: colors.onSecondary },
    success: { backgroundColor: '#11CA71', color: '#fff' },
    error: { backgroundColor: colors.error, color: colors.onError },
    gray: { backgroundColor: '#e0e0e0', color: '#333' },
  };

  const isDisabled = isLoading || disabled;

  // Handle opacity for disabled/loading state
  const backgroundColor = isDisabled
    ? withOpacity(colors.primary, 0.7)
    : colors.primary;

  const labelColor = isDisabled
    ? `${colorMap[color].color}80`
    : colorMap[color].color;

  return (
    <RNPButton
      {...rest}
      mode={mode}
      style={[
        {
          borderRadius: roundedMap[rounded],
          backgroundColor,
          paddingVertical: sizeMap[size].paddingVertical,
          paddingHorizontal: sizeMap[size].paddingHorizontal,
        },
        style,
      ]}
      disabled={isDisabled}
      labelStyle={{
        fontSize: sizeMap[size].fontSize,
        color: labelColor,
        fontWeight: '600',
      }}
      contentStyle={{ flexDirection: 'row', alignItems: 'center' }}
    >
      {isLoading ? (
        loader ? (
          loader
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator
              size="small"
              color={labelColor}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: labelColor }}>Please wait...</Text>
          </View>
        )
      ) : (
        children
      )}
    </RNPButton>
  );
}