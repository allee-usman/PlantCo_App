import { router, useLocalSearchParams } from 'expo-router';
import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import LottieLoader from '@/components/LottieLoader';
import { animations } from '@/constants/animations';

const BookingConfirmationScreen = () => {
	const { bookingId, bookingNumber } = useLocalSearchParams<{
		bookingId: string;
		bookingNumber: string;
	}>();

	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			<CustomHeader
				title="Booking Confirmed"
				iconLeft={
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={isDark ? 'white' : 'black'}
					/>
				}
				onIconLeftPress={() => router.back()}
			/>

			<View className="flex-1 px-5 items-center justify-center">
				{/* Success Animation */}
				<View className="w-60 h-60 mb-5 items-center justify-center">
					<LottieLoader
						animation={animations.success}
						size={360}
						loop={false}
					/>
				</View>

				<Text className="text-2xl font-nexa-bold text-gray-900 dark:text-gray-100">
					Booking Successful 🎉
				</Text>

				<Text className="text-center mt-2 text-gray-600 dark:text-gray-400 font-nexa">
					Your booking has been placed successfully.
				</Text>

				{/* Booking Meta Box */}
				<View className="mt-6 w-full bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
					<Text className="text-sm text-gray-500 dark:text-gray-400 font-nexa">
						Booking Number
					</Text>

					<Text className="text-xl font-nexa-bold text-gray-900 dark:text-gray-100 mt-1">
						{bookingNumber || '—'}
					</Text>

					<View className="mt-3 h-[1px] bg-gray-200 dark:bg-gray-800" />

					<Text className="text-xs text-gray-500 dark:text-gray-400 mt-3">
						Keep this number for future reference.
					</Text>
				</View>

				{/* Action Buttons */}
				<View className="mt-8 w-full gap-y-3">
					<CustomButton
						label="View Booking Details"
						onPress={() =>
							router.push({
								pathname: '/(root)/plant-care/booking/details',
								params: { bookingId },
							})
						}
					/>

					<CustomButton
						label="Back to Home"
						bgVariant="secondary"
						onPress={() => router.replace('/(root)/home')}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default BookingConfirmationScreen;
