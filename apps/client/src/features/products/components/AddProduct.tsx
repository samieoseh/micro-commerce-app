import React from 'react'
import { IconButton, useTheme } from 'react-native-paper'

export default function AddProduct() {
    const {colors} =useTheme();
  return (
    <IconButton
          icon="plus"
          size={20}
          iconColor={colors.onPrimary}
          containerColor={colors.primary + '20'}
          style={{ borderRadius: 6 }}
          onPress={() => {
            // TODO: navigate to create-product flow
          }}
        />
  )
}