
import { SignUpPasswordForm } from '@/src/features/auth/components/forms/SignUpPasswordForm';
import { SignUpFooter, SignUpHeader } from '@/src/features/auth/components/ui';
import { Container } from '@/src/shared/components';
import React from 'react';
import { View } from 'react-native';

export default function SignUp() {
  return (
    <Container>
      <View style={{ gap: 10 }}>
        <SignUpHeader />
        <SignUpPasswordForm />
        <SignUpFooter />
      </View>
    </Container>
  );
}