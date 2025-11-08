// components/BookingCard.tsx - Individual booking card component
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { BookingDetails } from '@/interfaces/interface';
import { formatDate, formatDuration, formatTime } from '@/utils/formatDate';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface BookingCardProps {
	booking: BookingDetails;
	onRemindToggle?: (id: number) => void;
	onDetailsPress: (id: number) => void;
	onBookAgain?: (id: number) => void;
	onCancelBooking?: (id: number) => void;
	onViewDetails?: (id: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
	booking,
	onRemindToggle,
	onDetailsPress,
	onBookAgain,
	onCancelBooking,
	onViewDetails,
}) => {
	// const getStatusColor = () => {
	// 	switch (booking.status) {
	// 		case 'completed':
	// 			return 'bg-green-100 dark:bg-green-900';
	// 		case 'upcoming':
	// 			return 'bg-blue-100 dark:bg-blue-900';
	// 		case 'canceled':
	// 			return 'bg-red-100 dark:bg-red-900';
	// 		default:
	// 			return 'bg-gray-100 dark:bg-gray-800';
	// 	}
	// };

	const getStatusBadge = () => {
		switch (booking.status) {
			case 'completed':
				return (
					<View
						className="justify-center items-center px-4 py-[6px] max-h-[30px] bg-green-100 dark:bg-green-900/40"
						style={{ borderRadius: 99 }}
					>
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-green-600 dark:text-green-500">
							{booking.status}
						</Text>
					</View>
				);
			case 'upcoming':
				return (
					<View
						className="justify-center  items-center px-4 py-[6px] max-h-[30px] bg-light-pallete-100/70 dark:bg-light-pallete-900/50"
						style={{ borderRadius: 99 }}
					>
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-light-pallete-600 dark:text-light-pallete-400">
							{booking.status}
						</Text>
					</View>
				);
			case 'cancelled':
				return (
					<View
						className="justify-center items-center px-4 py-[6px] max-h-[30px] dark:bg-red-950/30 bg-red-100"
						style={{ borderRadius: 99 }}
					>
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-red-600 dark:text-red-500">
							{booking.status}
						</Text>
					</View>
				);
			default:
				return null;
		}
	};

	return (
		<View className="mx-4 mb-4 p-4 rounded-xl shadow-md bg-light-surface dark:bg-gray-800 ">
			{/* Header with date and status */}
			<View className="flex-row items-center justify-between mb-4 pb-3 border-b-[1.5px] border-dashed border-gray-100 dark:border-gray-700">
				<View className="flex-row items-center justify-center gap-x-2">
					<Image
						source={icons.calendar}
						className="w-7 h-7"
						tintColor={COLORS.light.pallete[600]}
					/>
					<View>
						<Text className="text-gray-900 dark:text-white text-body-xs font-nexa-bold leading-5">
							{formatDate(booking.startTime)}
						</Text>
						<Text className="text-gray-900 dark:text-gray-200 text-body-xs font-nexa">
							{formatTime(booking.startTime)}
						</Text>
					</View>
				</View>
				{getStatusBadge()}
			</View>

			{/* Service details */}
			<View className="mb-4 pb-5 border-b-[1.5px] border-dashed border-gray-100 dark:border-gray-700 flex-row justify-between">
				<View className="flex-col flex-1 gap-y-1 items-start justify-center border-e-[1.5px] border-gray-200 dark:border-gray-700 ">
					<Text className="text-body font-nexa-extrabold text-gray-900 dark:text-gray-50">
						{booking.serviceName}
					</Text>
					<View className="flex-row items-center gap-x-1">
						<Image
							source={icons.locationOutline}
							className="w-5 h-5"
							tintColor={COLORS.gray[500]}
						/>
						<Text className="text-body-xs font-nexa text-wrap text-gray-500 dark:text-gray-400">
							{booking.address}
						</Text>
					</View>
				</View>
				<View className="flex-col ps-4 pe-2 items-center justify-center">
					<Text className="font-nexa-extrabold text-body-sm text-gray-900 dark:text-gray-50">
						Duration
					</Text>
					<Text className="font-nexa text-body-xs text-gray-500 dark:text-gray-300">
						{formatDuration(booking.duration)}
					</Text>
				</View>
			</View>

			{/* Remind me toggle for upcoming bookings */}
			{/* {booking.status === 'upcoming' && (
				<View className="flex-row items-center justify-between mb-4">
					<Text className="text-gray-600 dark:text-gray-400">Remind me</Text>
					<Switch
						value={booking.remindMe || false}
						onValueChange={() => onRemindToggle?.(booking.id)}
						trackColor={{ false: '#e5e7eb', true: '#10B981' }}
						thumbColor={booking.remindMe ? '#ffffff' : '#f3f4f6'}
						ios_backgroundColor="#e5e7eb"
					/>
				</View>
			)} */}

			{/* Action buttons */}
			<View className="flex-row gap-x-3">
				{booking.status === 'upcoming' && (
					<>
						<TouchableOpacity
							onPress={() => onCancelBooking?.(booking.id)}
							className="flex-1 h-[44px] justify-center items-center border border-red-500 dark:border-red-500 rounded-full"
						>
							<Text className="text-red-500 dark:text-red-500 font-medium text-center text-body-sm">
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onViewDetails?.(booking.id)}
							className="flex-1 h-[44px] justify-center items-center bg-light-pallete-400 rounded-full"
						>
							<Text className="dark:text-gray-950 text-gray-700 text-body-sm font-nexa-bold text-center">
								View Details
							</Text>
						</TouchableOpacity>
					</>
				)}

				{(booking.status === 'completed' || booking.status === 'cancelled') && (
					<>
						<TouchableOpacity
							onPress={() => onDetailsPress(booking.id)}
							className="flex-1 h-[44px] justify-center items-center border border-light-pallete-400 rounded-full"
						>
							<Text className="text-light-pallete-500 dark:text-light-pallete-400 font-medium text-center text-body-sm font-nexa">
								Details
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onBookAgain?.(booking.id)}
							className="flex-1 h-[44px] justify-center items-center bg-light-pallete-400 rounded-full"
						>
							<Text className="dark:text-gray-950 text-gray-700 text-body-sm font-nexa-bold text-center">
								Book Again
							</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
};

export default BookingCard;
