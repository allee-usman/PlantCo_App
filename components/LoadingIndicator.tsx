// components/LoadingIndicator.tsx
import { COLORS } from '@/constants/colors';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingIndicatorProps {
	message?: string; // optional text below spinner
	size?: 'small' | 'large';
	color?: string;
	fullScreen?: boolean; // center on full screen
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
	message = 'Loading...',
	size = 'large',
	color,
	fullScreen = true,
}) => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<View
			className={`${
				fullScreen
					? 'flex-1 justify-center items-center'
					: 'justify-center items-center'
			}`}
			style={{
				backgroundColor: fullScreen
					? isDark
						? COLORS.gray[950]
						: COLORS.light.screen
					: 'transparent',
			}}
		>
			<ActivityIndicator
				size={size}
				color={
					color ||
					(isDark ? COLORS.light.pallete[500] : COLORS.light.pallete[500])
				}
			/>
			{message && (
				<Text
					className={`mt-3 text-center text-sm ${
						isDark ? 'text-gray-300' : 'text-gray-700'
					}`}
				>
					{message}
				</Text>
			)}
		</View>
	);
};

export default LoadingIndicator;
