import { router } from 'expo-router';
import React, { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function SignInFooter() {
  const { colors } = useTheme();
  return (
    <Fragment>
      <TouchableOpacity
        onPress={() => {
          //router.push('/forgot-password');
        }}
        className="w-full items-center"
      >
        <Text
          style={{
            color: colors.primary,
            fontWeight: 900,
            textDecorationLine: 'underline',
          }}
        >
          I forgot my password
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center items-center mt-6">
        <Text
          variant="bodyMedium"
          style={{ color: colors.outline, fontWeight: 600 }}
        >
          Don’t have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push('/sign-up');
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
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}