import React, { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from './ThemedView';

export function Container({
  children,
  scroll = false,
}: {
  children: ReactNode;
  className?: string;
  scroll?: boolean;
}) {
  const { colors } = useTheme();

  if (scroll) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.surface, flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            width: '100%',
            alignSelf: 'center',
            backgroundColor: colors.surface,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView
            style={{ flex: 1 }}
            lightColor={colors.background}
            darkColor={colors.background}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 20,
                    width: '92%',
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <ThemedView
        style={{ flex: 1 }}
        lightColor={colors.background}
        darkColor={colors.background}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          > */}
            <View
              style={{
                flex: 1,
                width: '92%',
                alignSelf: 'center',
              }}
            >
              {children}
            </View>
          {/* </KeyboardAvoidingView> */}
        {/* </TouchableWithoutFeedback> */}
      </ThemedView>
    </SafeAreaView>
  );
}