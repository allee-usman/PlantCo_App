import { COLORS } from '@/constants/colors';
import LottieView from 'lottie-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Text, View } from 'react-native';

interface LottieLoadingIndicatorProps {
	message?: string;
	fullScreen?: boolean;
	size?: number; // width & height
}

const LottieLoadingIndicator: React.FC<LottieLoadingIndicatorProps> = ({
	message = 'Loading...',
	fullScreen = true,
	size = 200,
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
			<LottieView
				source={require('@/assets/animations/loading.json')}
				autoPlay
				loop
				style={{ width: size, height: size }}
			/>
			{message && (
				<Text
					className={`-mt-[80px] text-center text-body-sm ${
						isDark ? 'text-gray-300' : 'text-gray-700'
					}`}
				>
					{message}
				</Text>
			)}
		</View>
	);
};

export default LottieLoadingIndicator;
