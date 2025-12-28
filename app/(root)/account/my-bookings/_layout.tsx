import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';
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
					headerShown: false,
				}}
			/>

			{/* Dynamic Booking Details Screen */}
			<Stack.Screen
				name="[bookingId]"
				options={{
					headerShown: false,
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
