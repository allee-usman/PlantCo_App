import { COLORS } from '@/constants/colors'; // adjust path
import LottieView from 'lottie-react-native';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface LottieLoaderProps {
	animation: any; // Lottie JSON
	size?: number; // width & height
	color?: string; // overlay color
	style?: ViewStyle; // extra styling if needed
	loop?: boolean;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({
	animation,
	size = 40,
	loop = true,
	color = COLORS.gray[900],
	style,
}) => {
	return (
		<View style={[{ width: size, height: size }, style]}>
			<LottieView
				source={animation}
				autoPlay
				loop={loop}
				style={{ width: size, height: size }}
				// colorFilters={[
				// 	{
				// 		keypath: '*',
				// 		color: color,
				// 	},
				// ]}
			/>
		</View>
	);
};

export default LottieLoader;
