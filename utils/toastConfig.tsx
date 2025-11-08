import { useColorScheme } from 'nativewind';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const useToastConfig = (): ToastConfig => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	return {
		success: (props) => (
			<BaseToast
				{...props}
				style={{
					borderLeftColor: '#22c55e', // Tailwind green-500
					minHeight: 70,
					backgroundColor: isDark ? '#1f2937' : '#ffffff', // dark: gray-800, light: white
				}}
				text1Style={{
					fontSize: 18,
					fontFamily: 'Nexa-Heavy',
					color: isDark ? '#f9fafb' : '#111827', // dark: gray-50, light: gray-900
				}}
				text2Style={{
					fontSize: 14,
					color: isDark ? '#d1d5db' : '#4b5563', // dark: gray-300, light: gray-600
				}}
			/>
		),
		error: (props) => (
			<ErrorToast
				{...props}
				style={{
					borderLeftColor: '#ef4444', // Tailwind red-500
					minHeight: 70,
					backgroundColor: isDark ? '#1f2937' : '#ffffff',
				}}
				text1Style={{
					fontSize: 18,
					fontFamily: 'Nexa-400',
					color: isDark ? '#f9fafb' : '#111827',
				}}
				text2Style={{
					fontSize: 14,
					color: isDark ? '#d1d5db' : '#4b5563',
				}}
			/>
		),
	};
};
