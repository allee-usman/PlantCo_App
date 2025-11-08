// src/theme/AppThemeProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

type ThemePref = 'system' | 'light' | 'dark';
const THEME_KEY = 'USER_THEME_PREFERENCE';

interface ThemeContextValue {
	preference: ThemePref;
	setPreference: (p: ThemePref) => Promise<void>;
	resolved: 'light' | 'dark' | null;
	ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
	preference: 'system',
	setPreference: async () => {},
	resolved: null,
	ready: false,
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// nativewind hook: gives current resolved colorScheme and functions to change it.
	// `colorScheme` will be 'light' | 'dark' depending on resolved scheme.
	const { colorScheme, setColorScheme } = useNativewindColorScheme();

	const [preference, setPreferenceState] = useState<ThemePref>('system');
	const [ready, setReady] = useState(false);

	// load saved preference once
	useEffect(() => {
		(async () => {
			try {
				const saved = await AsyncStorage.getItem(THEME_KEY);
				if (saved === 'light' || saved === 'dark' || saved === 'system') {
					setPreferenceState(saved);
					// tell NativeWind about the preference (light/dark/system)
					setColorScheme(saved as 'light' | 'dark' | 'system');
				} else {
					// default: follow system (do nothing; nativewind will follow system)
					setColorScheme('system');
				}
			} catch (e) {
				console.warn('Failed to load theme preference', e);
			} finally {
				setReady(true); // ready to render children
			}
		})();
		// we intentionally run this only once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// helper to update preference (persist + update nativewind)
	const setPreference = async (p: ThemePref) => {
		try {
			setPreferenceState(p);
			await AsyncStorage.setItem(THEME_KEY, p);
			setColorScheme(p as 'light' | 'dark' | 'system');
		} catch (e) {
			console.warn('Failed to save theme preference', e);
		}
	};

	// Memoized context to avoid unnecessary re-renders
	const contextValue = useMemo(
		() => ({
			preference,
			setPreference,
			resolved: colorScheme ?? null,
			ready,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[preference, colorScheme, ready]
	);

	const barStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';

	// `colorScheme` is the resolved theme that NativeWind uses right now
	return (
		<ThemeContext.Provider value={contextValue}>
			{/* Render StatusBar only when ready to prevent flash */}
			{ready && <StatusBar backgroundColor="transparent" barStyle={barStyle} />}

			{/* Splash screen / loader until ready */}
			{ready ? (
				children
			) : (
				<View style={styles.loaderContainer}>
					<ActivityIndicator size="large" color="#555" />
				</View>
			)}
		</ThemeContext.Provider>
	);
};

export const useAppTheme = () => useContext(ThemeContext);
const styles = StyleSheet.create({
	loaderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff', // or match your app default background
	},
});