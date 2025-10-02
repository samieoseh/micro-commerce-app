import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type EmptyStateProps = {
  title: string;
  subtitle: string;
  iconName?: keyof typeof MaterialIcons.glyphMap; // optional
  iconSize?: number;
  iconColor?: string;
};

export function EmptyState({
  title,
  subtitle,
  iconName, // no default → optional
  iconSize = 48,
  iconColor,
}: EmptyStateProps) {
  const { dark, colors } = useTheme();

  return (
    <View
      style={{
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {iconName && (
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={iconColor ?? (dark ? '#8c8c8c' : colors.outline)}
          style={{ marginBottom: 12 }}
        />
      )}

      <Text
        style={{
          textAlign: 'center',
          color: dark ? '#b0b0b0' : '#929292',
          fontWeight: '600',
          marginBottom: 4,
        }}
        variant="bodyLarge"
      >
        {title}
      </Text>

      <Text
        style={{
          textAlign: 'center',
          color: dark ? '#8c8c8c' : '#747373',
        }}
        variant="bodySmall"
      >
        {subtitle}
      </Text>
    </View>
  );
}