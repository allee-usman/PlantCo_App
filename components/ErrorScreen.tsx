import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';
import CustomHeader from './CustomHeader';

interface ErrorScreenProps {
	error: string;
	headerTitle: string;
}

const ErrorScreen = ({ error, headerTitle }: ErrorScreenProps) => {
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
			<View className="flex-1 items-center justify-center px-6">
				<Ionicons
					name="alert-circle-outline"
					size={64}
					color={COLORS.gray[400]}
				/>
				<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 mt-4 text-center">
					{error || 'Network Error, Pleade try again!'}
				</Text>
				<CustomButton
					label="Go Back"
					onPress={() => router.back()}
					className="mt-6 w-40"
				/>
			</View>
		</SafeAreaView>
	);
};
export default ErrorScreen;
