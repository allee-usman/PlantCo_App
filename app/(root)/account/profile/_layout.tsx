import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, View } from 'react-native';
export default function ProfileLayout() {
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const renderLeftIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] bg-light-surface dark:bg-gray-900 rounded-full items-center justify-center border border-gray-200 dark:border-gray-800">
				<Ionicons
					name={src as any} //TODO: Change type
					size={24}
					color={isDark ? COLORS.gray[100] : COLORS.gray[950]}
				/>
			</View>
		);
	};

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: '#FFFFFF',
				},
				headerTintColor: '#000000',
				headerTitleStyle: {
					fontFamily: 'Nexa-Heavy',
					fontSize: 20,
				},
				headerShadowVisible: true,
				gestureEnabled: Platform.OS !== 'web',
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<CustomHeader
							title="Personal Information"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="edit-profile"
				options={{
					header: () => (
						<CustomHeader
							title="Edit"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderLeftIcon('chevron-back-outline')}
						/>
					),
				}}
			/>
		</Stack>
	);
}
