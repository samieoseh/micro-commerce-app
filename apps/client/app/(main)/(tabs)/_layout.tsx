import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import TabBarBackground from '@/components/ui/tabbar-background';
import { useTheme } from 'react-native-paper';
import { useCarts } from '@/src/features/carts/hooks';

export default function TabLayout() {
  const { colors } = useTheme();
  const {data: carts} = useCarts();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'BricolarFont',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

       <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
          tabBarBadge: carts?.items.length ? carts?.items?.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: 'white',
            fontSize: 12,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            textAlign: 'center',
            lineHeight: 16,
          },
        }}
        
      />
     
    </Tabs>
  );
}