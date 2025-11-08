import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';
import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { useColorScheme } from 'nativewind';
export default function ProfileLayout() {
	// const { colors } = useTheme();
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const rednerIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] dark:bg-gray-900 rounded-full items-center justify-center dark:border dark:border-gray-800">
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
				headerShadowVisible: false,
				gestureEnabled: Platform.OS !== 'web',
				animation: 'slide_from_right',
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<CustomHeader
							title="Addresses"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={
								<View className="w-[40px] h-[40px] bg-light-surface dark:bg-gray-900 rounded-full items-center justify-center dark:border dark:border-gray-800">
									<Ionicons
										name="chevron-back-outline"
										size={24}
										color={isDark ? COLORS.gray[100] : COLORS.gray[950]}
									/>
								</View>
							}
							iconRight={
								<View className="w-[40px] h-[40px] rounded-full items-center justify-center dark:border dark:border-gray-800">
									<Ionicons
										name="add-circle-outline"
										size={24}
										color={isDark ? COLORS.gray[100] : COLORS.gray[950]}
									/>
								</View>
							}
							onIconRightPress={() =>
								router.push(`/(root)/account/addresses/add`)
							}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="add"
				options={{
					header: () => (
						<CustomHeader
							title="Add Address"
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="edit"
				options={{
					header: () => (
						<CustomHeader
							title="Edit Address"
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/>
		</Stack>
	);
}
