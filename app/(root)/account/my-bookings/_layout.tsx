import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';
import CustomHeader from '@/components/CustomHeader';
import { COLORS } from '@/constants/colors';
import { useColorScheme } from 'nativewind';

export default function MyBookingsLayout() {
	// const { colors } = useTheme();
	const router = useRouter();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const renderIcon = (src: string) => {
		return (
			<View className="w-[40px] h-[40px] bg-light-surface dark:bg-gray-900 rounded-full items-center justify-center dark:border dark:border-gray-800">
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
				gestureEnabled: Platform.OS !== 'web',
				animation: 'slide_from_right',
			}}
		>
			{/* Main My Bookings Screen */}
			<Stack.Screen
				name="index"
				options={{
					header: () => (
						<CustomHeader
							title="My Bookings"
							onIconLeftPress={() => {
								router.back();
							}}
							iconLeft={renderIcon('chevron-back-outline')}
							iconRight={
								<View className="w-[40px] h-[40px] bg-light-surface dark:bg-gray-900 rounded-full items-center justify-center dark:border dark:border-gray-800">
									<Ionicons
										name="search-outline"
										size={24}
										color={isDark ? COLORS.gray[100] : COLORS.gray[950]}
									/>
								</View>
							}
							onIconRightPress={() => {
								// Handle search functionality
								console.log('Search bookings');
							}}
						/>
					),
				}}
			/>

			{/* Dynamic Booking Details Screen */}
			<Stack.Screen
				name="[id]"
				options={{
					header: () => (
						<CustomHeader
							title="Booking Details"
							iconLeft={renderIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
							iconRight={renderIcon('ellipsis-horizontal-outline')}
							onIconRightPress={() => {
								// Handle more options (share, report, etc.)
								console.log('More options');
							}}
						/>
					),
				}}
			/>

			{/* Optional: Reschedule Screen */}
			{/* <Stack.Screen
				name="reschedule/[id]"
				options={{
					header: () => (
						<CustomHeader
							title="Reschedule Booking"
							iconLeft={renderIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/> */}

			{/* Optional: Cancel Booking Screen */}
			{/* <Stack.Screen
				name="cancel/[id]"
				options={{
					header: () => (
						<CustomHeader
							title="Cancel Booking"
							iconLeft={renderIcon('chevron-back-outline')}
							onIconLeftPress={() => {
								router.back();
							}}
						/>
					),
				}}
			/> */}
		</Stack>
	);
}
