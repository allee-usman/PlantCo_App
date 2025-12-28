import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'moti';
import { Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from './CustomHeader';
import LottieLoader from './LottieLoader';

interface LoadingScreenProps {
	headerTitle: string;
	description?: string;
}
const LoadingScreen = ({
	headerTitle,
	description = 'Loading...',
}: LoadingScreenProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			<CustomHeader
				title={headerTitle}
				iconLeft={
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={isDark ? 'white' : 'black'}
					/>
				}
				onIconLeftPress={() => router.back()}
			/>
			<View className="flex-1 items-center justify-center">
				<LottieLoader
					animation={animations.spinner}
					size={80}
					color={COLORS.light.pallete[400]}
				/>
				<Text className="text-gray-600 dark:text-gray-400 mt-4 font-nexa">
					{description}
				</Text>
			</View>
		</SafeAreaView>
	);
};
export default LoadingScreen;
