import { View, Text } from 'react-native'
import React from 'react'
import { Button } from '@/src/shared/components'
import { router } from 'expo-router'

export default function Home() {
  return (
     <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Button onPress={() => router.push("/sign-in")}>Go to sign in</Button>
    </View>
  )
}