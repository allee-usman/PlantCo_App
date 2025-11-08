import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export const notify = {
	success: (
		title: string = 'Success',
		message?: string,
		useToast: boolean = true
	) => {
		if (useToast) {
			Toast.show({
				type: 'success',
				text1: title,
				text2: message,
			});
		} else {
			Alert.alert(title, message || '');
		}
	},

	error: (title: string, message?: string, useToast: boolean = true) => {
		if (useToast) {
			Toast.show({
				type: 'error',
				text1: title,
				text2: message,
			});
		} else {
			Alert.alert(title, message || '');
		}
	},

	info: (title: string, message?: string, useToast: boolean = true) => {
		if (useToast) {
			Toast.show({
				type: 'info',
				text1: title,
				text2: message,
			});
		} else {
			Alert.alert(title, message || '');
		}
	},
};
