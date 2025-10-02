import {Button} from '@/src/shared/components';
import {FormTextInput} from '@/src/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { useAuth } from '../../hooks';
import { SignUpFormData, signUpSchema } from '../../schemas/sign-up-schema';

export function SignUpPasswordForm() {
  const { signUp } = useAuth();
  const defaultValues = {
    first_name: 'Samuel',
    last_name: 'Oseh',
    email_address: 'samieoseh@gmail.com',
    password: 'Password@123',
    confirm_password: 'Password@123',
    mobile_number: '+2348131623310',
    referral_code: '',
    terms_and_condition: true,
  };
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const onSignup = async (data: SignUpFormData) => {
    const response = await signUp(data);

    if (response) {
      //router.push('/verify-email');
    }
  };

  // TODO: ADD Keyboard Aware Controller
  return (
    <View>
      <View style={{ marginTop: 10 }}>
        <FormTextInput
          control={control}
          label="First Name"
          name="first_name"
          required={true}
        />
        <FormTextInput
          control={control}
          name="last_name"
          label="Last Name"
          required={true}
        />
        <FormTextInput
          control={control}
          label="Email Address"
          name="email_address"
          required={true}
        />
        <FormTextInput
          control={control}
          name="password"
          label="Password"
          placeholder="********"
          secureTextEntry={true}
          required={true}
        />


        
        <Controller
          control={control}
          name="terms_and_condition"
          render={({ field: { value, onChange } }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
              />
              <View>
                {/* Replace with your Text component */}
                <Text variant="bodySmall">
                  By checking this box, you agree to Terms and Conditions and
                  Privacy Policy
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <Button isLoading={isSubmitting} onPress={handleSubmit(onSignup)}>
        Sign up
      </Button>
    </View>
  );
}