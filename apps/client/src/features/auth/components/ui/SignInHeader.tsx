//import Logo from '@/src/shared/components/ui/Logo';
import React, { Fragment } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function SignInHeader() {
  const { colors } = useTheme();

  return (
    <Fragment>
      {/* <CoownixLogo /> */}
      <View>
        <Text variant="headlineMedium">Sign in</Text>
        <Text
          variant="bodySmall"
          className="text-center text-gray-700 mt-2"
          style={{ color: colors.outline }}
        >
          Welcome back! Enter your credentials to access your account.
        </Text>
      </View>
    </Fragment>
  );
}