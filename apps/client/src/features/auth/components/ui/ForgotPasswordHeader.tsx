//import Logo from '@/src/shared/components/ui/Logo';
import { Fragment } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function ForgotPasswordHeader() {
  const { colors } = useTheme();
  return (
    <Fragment>
      {/* <CoownixLogo /> */}
      <View>
        <Text variant="headlineMedium">Forgot Password</Text>
        <Text
          variant="bodySmall"
          className="text-center text-gray-700 mt-2"
          style={{ color: colors.outline }}
        >
          Enter your email address below and we’ll send you instructions to
          reset your password.
        </Text>
      </View>
    </Fragment>
  );
}