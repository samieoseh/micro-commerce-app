import {Button} from '@/src/shared/components';
import {FormTextInput} from '@/src/shared/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useAuth } from '../../hooks';
import { SignInFormData, signInSchema } from '../../schemas';

export function SignInPasswordForm() {
  const { signInWithPassword } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'Password@123',
    },
  });

  const onSignin = async (data: SignInFormData) => {
    const response = await signInWithPassword(data);

    if (response) {
      router.push('/');
    }
  };

  return (
    <View style={{ paddingTop: 10 }}>
      <View>
        <FormTextInput
          control={control}
          label="Email Address"
          name="email"
          placeholder="E.g example@gmail.com"
        />
        <FormTextInput
          control={control}
          name="password"
          label="Password"
          placeholder="********"
          secureTextEntry={true}
        />
      </View>
      <Button isLoading={isSubmitting} onPress={handleSubmit(onSignin)}>
        Sign in
      </Button>
    </View>
  );
}