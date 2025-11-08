import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext<'light' | 'dark'>('light');

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const scheme = useColorScheme();
	const theme = useMemo(() => (scheme === 'dark' ? 'dark' : 'light'), [scheme]);

	return (
		<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
