import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { Stack } from 'expo-router';
import { useMemo } from 'react';
import { Platform } from 'react-native';

export default function AuthLayout() {
	const { pendingEmail } = useAppSelector((state: RootState) => state.auth);

	// Memoize the initial screen so it doesn't flip-flop and break navigation
	const initialRoute = useMemo(() => {
		return pendingEmail ? 'login' : 'welcome';
	}, [pendingEmail]);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: Platform.OS !== 'web',
				animation: 'slide_from_right',
				presentation: 'card',
			}}
			initialRouteName={initialRoute}
		>
			<Stack.Screen name="welcome" options={{ headerShown: false }} />
			<Stack.Screen name="signup" options={{ headerShown: false }} />
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="verify-otp" options={{ headerShown: false }} />
			<Stack.Screen name="forgot-password" options={{ headerShown: false }} />
			<Stack.Screen name="reset-password" options={{ headerShown: false }} />
		</Stack>
	);
}
