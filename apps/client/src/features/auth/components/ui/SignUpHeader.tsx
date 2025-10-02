//import Logo from '@/src/shared/components/ui/Logo';
import React, { Fragment } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function SignUpHeader() {
  const { colors } = useTheme();

  return (
    <Fragment>
      {/* <CoownixLogo /> */}
      <View>
        <Text variant="headlineMedium">Sign up</Text>
        <Text
          variant="bodySmall"
          className="text-center text-gray-700 mt-2"
          style={{ color: colors.outline }}
        >
          Join Coownix today! Fill in your details to set up your account.
        </Text>
      </View>
    </Fragment>
  );
}