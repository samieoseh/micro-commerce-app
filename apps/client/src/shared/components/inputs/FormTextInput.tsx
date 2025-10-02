import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { KeyboardTypeOptions, StyleSheet, View } from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';

interface InputProps {
  name?: string; // required when using Controller
  control?: Control<any>; // from react-hook-form
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: object; // validation rules for react-hook-form
  error?: FieldError; // can be passed manually or from formState
  value?: string; // when used standalone
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
}

export function FormTextInput(props: InputProps) {
  const {
    name,
    control,
    label,
    placeholder,
    rules,
    error,
    required = false,
    value,
    onChangeText,
    autoFocus,
    keyboardType = 'default',
    secureTextEntry = false,
  } = props;

  const { colors } = useTheme();

  // if control and name are provided -> hook-form mode
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <View style={styles.container}>
            <TextInput
              label={required ? `${label} *` : label}
              placeholder={placeholder}
              mode="outlined"
              value={value}
              keyboardType={keyboardType}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              error={!!fieldState.error}
              theme={{
                colors: {
                  onSurfaceVariant: colors.outlineVariant,
                },
                roundness: 12,
              }}
              autoFocus={autoFocus ?? false}
              outlineColor={error ? colors.error : colors.outlineVariant}
              activeOutlineColor={error && colors.error}
            />
            {fieldState.error && (
              <HelperText type="error" visible={true}>
                {fieldState.error.message}
              </HelperText>
            )}
          </View>
        )}
      />
    );
  }

  // standalone mode
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        placeholder={placeholder}
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        error={!!error}
        theme={{
          colors: {
            onSurfaceVariant: colors.outlineVariant,
          },
          roundness: 12,
        }}
        keyboardType={keyboardType}
        autoFocus={autoFocus ?? false}
        outlineColor={error ? colors.error : colors.outlineVariant}
        activeOutlineColor={error && colors.error}
      />
      {error && (
        <HelperText type="error" visible={true}>
          {error.message}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {},
});