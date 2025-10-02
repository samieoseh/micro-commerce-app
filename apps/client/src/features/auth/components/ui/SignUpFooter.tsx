import { router } from 'expo-router';
import React, { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function SignUpFooter() {
  const { colors } = useTheme();
  return (
    <Fragment>
      <View className="flex-row justify-center items-center mt-6">
        <Text
          variant="bodyMedium"
          style={{ color: colors.outline, fontWeight: 600 }}
        >
          Already have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push('/sign-in');
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              color: colors.primary,
              fontWeight: 700,
              textDecorationLine: 'underline',
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}