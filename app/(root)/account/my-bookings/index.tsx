import BookingCard from '@/components/BookingCard';
import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import CustomInputField from '@/components/CustomInputField';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import TabSelector from '@/components/TabSelector';
import { TabType } from '@/interfaces/interface';
import { bookingService } from '@/services/booking.services';
import { IBooking } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyBookingsScreen: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>('all');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const [bookings, setMyBookings] = useState<IBooking[]>([]);

	//Booking cancellation management
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState('');
	const [cancelLoading, setCancelLoading] = useState(false);

	// Fetch booking data
	useEffect(() => {
		const fetchMyBookings = async () => {
			setLoading(true);
			setError(null);

			try {
				const resp = await bookingService.getMyBookings();
				// console.log('API Response: ', resp);
				setMyBookings(resp.data);
			} catch (err) {
				console.error('Failed to fetch bookings histroy:', err);
				setError('Unable to load bookings histroy. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchMyBookings();
	}, []);

	const filteredBookings = bookings.filter((b) => {
		if (activeTab === 'all') return true;
		if (activeTab === 'upcoming')
			return b.status === 'pending' || b.status === 'confirmed';
		return b.status === activeTab;
	});

	const handleDetailsPress = (id: string) => {
		router.push(`/account/my-bookings/${id}`);
		// console.log('View Details pressed for booking:', id);
	};

	const handleBookAgain = (id: string) => {
		console.log('Book again pressed for booking:', id);
	};

	const handleCancelBooking = (id: string) => {
		setCancelBookingId(id);
		setCancelReason('');
		setShowCancelModal(true);
	};

	const handleViewDetails = (id: string) => {
		router.push(`/account/my-bookings/${id}`);
		console.log('View details pressed for booking:', id);
	};

	const handleSubmitCancel = async () => {
		if (!cancelBookingId) return;

		const trimmedReason = cancelReason.trim();

		if (trimmedReason.length < 10) {
			alert('Please provide a reason of at least 10 characters.');
			return;
		}

		setCancelLoading(true);
		try {
			const res = await bookingService.cancelBooking(
				cancelBookingId,
				cancelReason
			);
			console.log('Booking cancelled:', res.data);

			// Update local bookings list
			setMyBookings((prev) =>
				prev.map((b) =>
					b._id === cancelBookingId
						? { ...b, status: 'cancelled', cancellation: res.data.cancellation }
						: b
				)
			);

			setShowCancelModal(false);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : 'Something went wrong';
			alert(message);
		} finally {
			setCancelLoading(false);
			setShowCancelModal(false);
		}
	};

	const renderBooking = ({ item }: { item: IBooking }) => (
		<BookingCard
			booking={item}
			// onRemindToggle={handleRemindToggle}
			onDetailsPress={handleDetailsPress}
			onBookAgain={handleBookAgain}
			onCancelBooking={handleCancelBooking}
			onViewDetails={handleViewDetails}
		/>
	);

	const keyExtractor = (item: IBooking): string => item._id.toString();

	const renderEmptyListContent = () => {
		const messages: Record<TabType, string> = {
			all: 'Nothing here yet! Time to book your first service 🚀',
			upcoming: 'Your future bookings are hiding… none found for now 👀',
			in_progress: 'No service is in action at the moment ⚡',
			completed: "Looks like you haven't completed any bookings yet 🏁",
			cancelled: 'Cancelled bookings? None to see here ✨',
			rejected: 'No services have been rejected… everything’s still hopeful 🌱',
		};

		return (
			<View className="flex-1 justify-start items-center px-4 py-10 bg-light-surface dark:bg-gray-950">
				<Text className="text-body text-gray-800 dark:text-gray-200 font-nexa-extrabold text-center">
					{messages[activeTab]}
				</Text>
			</View>
		);
	};

	if (loading) {
		return (
			<LoadingScreen
				headerTitle="My Bookings"
				description="Loading booking history..."
			/>
		);
	}

	if (error) {
		return <ErrorScreen error={error} headerTitle="My Bookings" />;
	}

	return (
		<SafeAreaView
			edges={['bottom', 'left', 'right']}
			className="flex-1 bg-light-screen dark:bg-gray-950"
		>
			<CustomHeader
				title="My Bookings"
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
			<TabSelector activeTab={activeTab} onTabPress={setActiveTab} />
			<View className="flex-1">
				<FlatList<IBooking>
					data={filteredBookings}
					renderItem={renderBooking}
					keyExtractor={keyExtractor}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
					ListEmptyComponent={renderEmptyListContent}
				/>
			</View>

			{/* Cancel Reason Modal */}
			<Modal
				visible={showCancelModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowCancelModal(false)}
			>
				<View className="flex-1 justify-center items-center bg-black/40 p-4">
					<View className="w-full bg-white dark:bg-gray-900 p-6 rounded-xl">
						<Text className="text-lg font-nexa-extrabold text-gray-900 dark:text-gray-50 mb-4">
							Cancel Booking
						</Text>
						<CustomInputField
							placeholder="Reason for cancellation"
							placeholderTextColor="#888"
							value={cancelReason}
							onChangeText={setCancelReason}
							multiline
						/>
						{cancelReason.trim().length > 0 &&
							cancelReason.trim().length < 10 && (
								<Text className="text-xs font-nexa text-red-500 mb-3">
									Reason must be at least 10 characters
								</Text>
							)}

						<View className="flex-row justify-end gap-x-3">
							<CustomButton
								label="Close"
								onPress={() => setShowCancelModal(false)}
								bgVariant="secondary"
								textVariant="secondary"
								paddingHorizontal={8}
								height={36}
								width={80}
							/>

							<CustomButton
								label={cancelLoading ? 'Cancelling...' : 'Submit'}
								onPress={handleSubmitCancel}
								bgVariant="danger"
								textVariant="primary"
								disabled={cancelLoading || cancelReason.trim().length < 10}
								height={36}
								width={80}
							/>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default MyBookingsScreen;
