import React from 'react'
import { Container } from '@/src/shared/components'
import { Carts } from '@/src/features/carts/components'
import { Text } from 'react-native-paper'

export default function Cart() {
  return (
    <Container>
        <Text variant='bodyLarge' className='py-6'>My Cart</Text>
        <Carts />
    </Container>
  )
}