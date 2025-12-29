import BookingInfoCard from '@/components/BookingInfoCard';
import BookingPaymentSummaryCard from '@/components/BookingPaymentSummaryCard';
import CustomHeader from '@/components/CustomHeader';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { bookingService } from '@/services/booking.services';
import { IBooking } from '@/types/booking.types';
import { generateBookingReceipt } from '@/utils/generateRecipet';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const BookingDetailsScreen: React.FC = () => {
	const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
	const [booking, setBooking] = useState<IBooking | null>(null);
	const [loading, setLoading] = useState(true);
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	useEffect(() => {
		if (!bookingId) return;

		const fetchBookingDetails = async () => {
			setLoading(true);
			try {
				const res = await bookingService.getBookingById(bookingId);
				// console.log('API response: ', res.data);

				setBooking(res.data);
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : 'Something went wrong';
				alert(message);
			} finally {
				setLoading(false);
			}
		};

		fetchBookingDetails();
	}, [bookingId]);

	const handleCancelBooking = () => {
		Alert.prompt(
			'Cancel Booking',
			'Please enter the reason for cancellation (min 10 characters)',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Submit',
					onPress: async (reason) => {
						if (!reason || reason.trim().length < 10) {
							alert('Reason must be at least 10 characters long.');
							return;
						}

						try {
							const res = await bookingService.cancelBooking(
								bookingId!,
								reason
							);
							console.log('Booking cancelled:', res.data);
							setBooking((prev) =>
								prev
									? {
											...prev,
											status: 'cancelled',
											cancellation: res.data.cancellation,
									  }
									: prev
							);
						} catch (err: unknown) {
							const message =
								err instanceof Error ? err.message : 'Something went wrong';
							alert(message);
						}
					},
				},
			],
			'plain-text'
		);
	};

	const handleReschedule = () => {
		// Navigate to reschedule screen
		console.log('Reschedule booking');
	};

	if (loading) {
		return (
			<LoadingScreen
				headerTitle="Booking Details"
				description="Loading booking details..."
			/>
		);
	}

	if (!booking) {
		return (
			<ErrorScreen
				error="No such booking found!"
				headerTitle="Booking Details"
			/>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<CustomHeader
				title="Booking Details"
				iconLeft={
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={isDark ? 'white' : 'black'}
					/>
				}
				onIconLeftPress={() => router.back()}
			/>
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="pt-4 bg-light-screen dark:bg-gray-950">
					<Text className="text-body-sm font-nexa-extrabold px-4 mb-2 text-gray-900 dark:text-white ">
						Booking Summary
					</Text>

					<BookingInfoCard booking={booking} />
					<View className="mx-4">
						<ServiceProviderCard provider={booking.provider} />
					</View>
					{/* <PaymentSummaryCard data={{}}/> */}
					<BookingPaymentSummaryCard
						ratePerHour={booking?.service?.hourlyRate}
						duration={booking.duration}
						// tip={booking?.tip ?? 0}
						discount={0}
						// taxes={booking?.taxes ?? 0}
						paymentMethod={'cash'}
						status={booking.status === 'completed'}
					/>
					{/* <ServiceDetailsCard details={booking.serviceDetails} /> */}
				</View>
				{booking.status === 'cancelled' && booking.cancellation && (
					<View className="px-4 py-2 bg-red-50 dark:bg-red-900 rounded-lg mb-3">
						<Text className="text-red-600 dark:text-red-200 font-nexa-bold">
							Cancelled: {booking.cancellation.reason}
						</Text>
						<Text className="text-gray-500 dark:text-gray-400 text-sm">
							By: {booking.cancellation.cancelledBy}, At:{' '}
							{new Date(
								booking.cancellation.cancelledAt as string
							).toLocaleString()}
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Action buttons for upcoming bookings */}
			{(booking.status === 'pending' || booking.status === 'confirmed') && (
				<View className="px-4 pb-5 pt-3 bg-light-screen dark:bg-gray-950">
					<View className="flex-row gap-x-3">
						<TouchableOpacity
							onPress={handleCancelBooking}
							className="flex-1 justify-center items-center py-4 border-[1.5px] border-red-600 rounded-full"
						>
							<Text className="font-nexa-bold text-red-600 text-center">
								Cancel Booking
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleReschedule}
							className="flex-1 justify-center items-center py-4 bg-light-pallete-500 rounded-full"
						>
							<Text className="text-gray-50 font-nexa-bold text-center">
								Reschedule
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{booking.status === 'cancelled' && (
				<View className="px-5 pt-3 pb-5 bg-light-screen dark:bg-gray-950">
					<View className="flex-row gap-x-3">
						<TouchableOpacity
							onPress={handleReschedule}
							className="flex-1 justify-center items-center py-4 bg-light-pallete-500 rounded-full"
						>
							<Text className="text-white text-body font-nexa-bold text-center">
								Book Again
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
			{booking.status === 'completed' && (
				<View className="px-5 pt-3 pb-5 bg-light-screen dark:bg-gray-950">
					<View className="flex-row gap-x-3">
						<TouchableOpacity
							onPress={() => generateBookingReceipt(booking)}
							className="flex-1 justify-center items-center py-4 border-[1.5px] dark:border-gray-200 border-gray-500 rounded-full"
						>
							<Text className="text-gray-500 dark:text-gray-200 text-body-sm  font-nexa-bold text-center">
								Download Receipt
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleReschedule}
							className="flex-1 justify-center items-center py-4 bg-light-pallete-500 rounded-full"
						>
							<Text className="text-white text-body-sm font-nexa-bold text-center">
								Book Again
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
};

export default BookingDetailsScreen;
