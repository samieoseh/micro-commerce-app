
import { SignInPasswordForm } from '@/src/features/auth/components/forms/SignInPasswordForm';
import { SignInFooter, SignInHeader } from '@/src/features/auth/components/ui';
import { Container } from '@/src/shared/components';
import React from 'react';
import { View } from 'react-native';

export default function SignIn() {
  return (
    <Container>
      <View style={{ gap: 10 }}>
        <SignInHeader />
        <SignInPasswordForm />
        <SignInFooter />
      </View>
    </Container>
  );
}