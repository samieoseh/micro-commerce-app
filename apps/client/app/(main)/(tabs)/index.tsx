import React from 'react'
import { Container } from '@/src/shared/components'
import { IconButton, Text } from 'react-native-paper'
import { View } from 'react-native'
import { useAuth } from '@/src/features/auth/hooks'
import { Products } from '@/src/features/products/components/Products'

export default function HomeScreen() {
  const {signOut}  = useAuth()
  return (
    <Container>
      <View className='flex-row justify-between items-center'>
        <Text variant='bodyLarge'>Welcome User!</Text>
        <IconButton icon='logout' size={20} onPress={() => {
          signOut()
        }} iconColor='red'/>
      </View>
      <Products />  
    </Container>
  )
}