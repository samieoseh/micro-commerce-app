import {Button} from '@/src/shared/components';
import { FormTextInput } from '@/src/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useAuth } from '../../hooks';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../../schemas';

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email_address: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log({ data });
    const result = await forgotPassword(data);

    if (result) {
      //router.push('/reset-password');
    }
  };

  return (
    <View>
      <FormTextInput
        control={control}
        name="email_address"
        label="Email Address"
        placeholder="Email Address"
      />
      <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting}>
        Forgot Password
      </Button>
    </View>
  );
}