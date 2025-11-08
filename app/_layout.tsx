// app/layout.tsx
import { AppThemeProvider } from '@/hooks/ThemeProvider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loadUserFromStorage } from '@/redux/slices/authSlice';
import { RootState, store } from '@/redux/store';
import { useToastConfig } from '@/utils/toastConfig';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import './globals.css';

SplashScreen.preventAutoHideAsync();

function AppContent() {
	const dispatch = useAppDispatch();
	const { token, isInitialized } = useAppSelector((s: RootState) => s.auth);
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const [fontsLoaded] = useFonts({
		'Nexa-100': require('../assets/fonts/NexaThin.otf'),
		'Nexa-300': require('../assets/fonts/Nexa-Light.otf'),
		'Nexa-400': require('../assets/fonts/NexaRegular.otf'),
		'Nexa-400-Italic': require('../assets/fonts/Nexa-Regular-Italic.otf'),
		'Nexa-500': require('../assets/fonts/Nexa-Book.otf'),
		'Nexa-600': require('../assets/fonts/Nexa-Bold.otf'),
		'Nexa-700': require('../assets/fonts/Nexa-XBold.otf'),
		'Nexa-800': require('../assets/fonts/NexaHeavy.otf'),
		'Nexa-900': require('../assets/fonts/NexaBlack.otf'),
	});

	useEffect(() => {
		dispatch(loadUserFromStorage());
	}, [dispatch]);

	// Hide splash when both fonts and auth are ready
	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded && isInitialized) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, isInitialized]);

	// While splash is visible, render nothing
	if (!fontsLoaded || !isInitialized) {
		return null;
	}

	const MyDarkTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			background: '#030712',
		},
	};

	const MyLightTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: '#f7f7ff',
		},
	};

	return (
		<View style={{ flex: 1 }} onLayout={onLayoutRootView}>
			<AppThemeProvider>
				<NavigationThemeProvider value={isDark ? MyDarkTheme : MyLightTheme}>
					<Stack
						initialRouteName={token ? '(root)' : '(auth)'} //TODO: Change once development of all screen finished
						screenOptions={{
							contentStyle: { backgroundColor: isDark ? '#030712' : '#f7f7ff' },
						}}
					>
						<Stack.Screen name="(auth)" options={{ headerShown: false }} />
						<Stack.Screen name="(root)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" options={{ headerShown: false }} />
					</Stack>
				</NavigationThemeProvider>
			</AppThemeProvider>
		</View>
	);
}

export default function RootLayout() {
	const toastConfig = useToastConfig();
	return (
		<Provider store={store}>
			<AppContent />
			<Toast />
			{/* <Toast config={toastConfig} /> */}
		</Provider>
	);
}
