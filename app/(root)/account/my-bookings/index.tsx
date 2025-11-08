import BookingCard from '@/components/BookingCard';
import TabSelector from '@/components/TabSelector';
import { bookingData } from '@/constants/mockData';
import { BookingDetails, TabType } from '@/interfaces/interface';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, View } from 'react-native';

const MyBookingsScreen: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>('all');
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const [bookings, setBookings] = useState<BookingDetails[]>(bookingData);

	const filteredBookings =
		activeTab === 'all'
			? bookings
			: bookings.filter((b) => b.status === activeTab);

	const handleRemindToggle = (id: number) => {
		setBookings((prev) =>
			prev.map((booking) =>
				booking.id === id
					? { ...booking, remindMe: !booking.remindMe }
					: booking
			)
		);
	};

	const handleDetailsPress = (id: number) => {
		router.push(`/account/my-bookings/${id}`);
		// console.log('View Details pressed for booking:', id);
	};

	const handleBookAgain = (id: number) => {
		console.log('Book again pressed for booking:', id);
	};

	const handleCancelBooking = (id: number) => {
		console.log('Cancel booking pressed for booking:', id);
	};

	const handleViewDetails = (id: number) => {
		router.push(`/account/my-bookings/${id}`);
		console.log('View details pressed for booking:', id);
	};

	const renderBooking = ({ item }: { item: BookingDetails }) => (
		<BookingCard
			booking={item}
			onRemindToggle={handleRemindToggle}
			onDetailsPress={handleDetailsPress}
			onBookAgain={handleBookAgain}
			onCancelBooking={handleCancelBooking}
			onViewDetails={handleViewDetails}
		/>
	);

	const keyExtractor = (item: BookingDetails): string => item.id.toString();

	const renderEmptyListContent = () => {
		const messages: Record<TabType, string> = {
			all: "You haven't booked any service yet!",
			upcoming: 'No upcoming bookings found.',
			completed: "Your bookings haven't completed any bookings yet.",
			cancelled: 'No cancelled bookings to show.',
		};

		return (
			<View className="flex-1 justify-start items-center px-4 py-10 bg-light-surface dark:bg-gray-950">
				<Text className="text-body text-gray-800 dark:text-gray-200 font-nexa-extrabold text-center">
					{messages[activeTab]}
				</Text>
			</View>
		);
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			<TabSelector activeTab={activeTab} onTabPress={setActiveTab} />

			<View className="flex-1">
				<FlatList<BookingDetails>
					data={filteredBookings}
					renderItem={renderBooking}
					keyExtractor={keyExtractor}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
					ListEmptyComponent={renderEmptyListContent}
				/>
			</View>
		</SafeAreaView>
	);
};

export default MyBookingsScreen;
