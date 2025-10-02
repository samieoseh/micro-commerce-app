import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function ForgotPasswordFooter() {
  const { colors } = useTheme();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          router.push('/sign-in');
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
          Back to signin
        </Text>
      </TouchableOpacity>
    </View>
  );
}