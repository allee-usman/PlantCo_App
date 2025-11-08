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
							title="Cart"
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
						/>
					),
				}}
			/>
			<Stack.Screen
				name="select-address"
				options={{
					header: () => (
						<CustomHeader
							title="Select Address"
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="add-address"
				options={{
					header: () => (
						<CustomHeader
							title="Add New Address"
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="confirm-order"
				options={{
					header: () => (
						<CustomHeader
							title="Confirm Your Order"
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="payment"
				options={{
					header: () => (
						<CustomHeader
							title="Payment"
							iconLeft={rednerIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/>
			<Stack.Screen
				name="success"
				options={{
					header: () => (
						<CustomHeader
							title="Success"
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
