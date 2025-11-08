import BookingInfoCard from '@/components/BookingInfoCard';
import BookingPaymentSummaryCard from '@/components/BookingPaymentSummaryCard';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { bookingData } from '@/constants/mockData';
import { BookingDetails } from '@/interfaces/interface';
import { generateBookingReceipt } from '@/utils/generateRecipet';
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
	const { id } = useLocalSearchParams<{ id?: string }>();
	const mockID = id ? parseInt(id, 10) : 1;
	const [booking, setBooking] = useState<BookingDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	// Mock data - In real app, fetch from API using the id
	useEffect(() => {
		const fetchBookingDetails = () => {
			// Simulate API call
			setTimeout(() => {
				const mockBookingDetails =
					bookingData.find((b) => b.id === mockID) || null;
				setBooking(mockBookingDetails);
				setLoading(false);
			}, 1000);
		};

		fetchBookingDetails();
	}, [mockID]);

	const handleCancelBooking = () => {
		Alert.alert(
			'Cancel Booking',
			'Are you sure you want to cancel this booking?',
			[
				{ text: 'No', style: 'cancel' },
				{
					text: 'Yes',
					style: 'destructive',
					onPress: () => {
						// Handle cancel logic
						console.log('Booking canceled');
						router.back();
					},
				},
			]
		);
	};

	const handleReschedule = () => {
		// Navigate to reschedule screen
		console.log('Reschedule booking');
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
				<View className="flex-1 items-center justify-center">
					<Text className="text-gray-600 dark:text-gray-400">Loading...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!booking) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
				<View className="flex-1 items-center justify-center">
					<Text className="text-gray-600 dark:text-gray-400">
						Booking not found
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="pt-4 bg-light-screen dark:bg-gray-950">
					<Text className="text-body-sm font-nexa-extrabold px-4 mb-2 text-gray-900 dark:text-white ">
						Service Details
					</Text>

					<BookingInfoCard booking={booking} />
					<ServiceProviderCard provider={booking.serviceProvider} />
					{/* <PaymentSummaryCard data={{}}/> */}
					<BookingPaymentSummaryCard
						ratePerHour={booking.serviceProvider.ratePerHour}
						duration={booking.duration}
						tip={booking?.tip ?? 0}
						discount={booking?.discount ?? 0}
						taxes={booking?.taxes ?? 0}
						paymentMethod={booking.paymentMethod.type}
						status={booking.serviceDetails.paymentStatus}
					/>
					{/* <ServiceDetailsCard details={booking.serviceDetails} /> */}
				</View>
			</ScrollView>

			{/* Action buttons for upcoming bookings */}
			{booking.status === 'upcoming' && (
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
