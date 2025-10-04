import React, { Fragment } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function SignUpHeader() {
  const { colors } = useTheme();

  return (
    <Fragment>
      <View style={{marginTop:64}}>
        <Text variant="headlineMedium">Sign up</Text>
        <Text
          variant="bodySmall"
          className="text-center text-gray-700 mt-2"
          style={{ color: colors.outline }}
        >
          Join today! Fill in your details to set up your account.
        </Text>
      </View>
    </Fragment>
  );
}