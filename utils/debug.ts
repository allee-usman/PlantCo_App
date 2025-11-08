import { resetAuth } from '@/redux/slices/authSlice';
import { store } from '@/redux/store';
import * as SecureStore from 'expo-secure-store';

export const resetAppData = async () => {
	try {
		// List all keys you use in SecureStore
		const keys = [
			'token',
			'authToken',
			'hasSeenOnboarding',
			'otpExpiresAt',
			'pendingEmail',
		]; // Add any other keys if you have
		for (const key of keys) {
			await SecureStore.deleteItemAsync(key);
		}
		console.log('✅ Secure storage cleared');

		// Reset Redux auth state
		store.dispatch(resetAuth());
		console.log('✅ Redux auth state reset');
	} catch (error) {
		console.error('Error resetting app data:', error);
	}
};
