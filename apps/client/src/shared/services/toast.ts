import { Platform, ToastAndroid } from 'react-native';

export const toast = (message: string) => {
  if (Platform.OS != 'android') {
    // Snackbar.show({
    //   text: message,
    //   duration: Snackbar.LENGTH_SHORT,
    // });
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
};