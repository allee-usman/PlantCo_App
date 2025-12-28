// components/BookingCard.tsx - Individual booking card component
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { IBooking } from '@/types/booking.types';
import { formatDate, formatDuration, formatTime } from '@/utils/formatDate';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import CancellationReasonModal from './CancellationReasonModal';

interface BookingCardProps {
	booking: IBooking;
	onRemindToggle?: (id: string) => void;
	onDetailsPress: (id: string) => void;
	onBookAgain?: (id: string) => void;
	onCancelBooking?: (id: string) => void;
	onViewDetails?: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
	booking,
	onRemindToggle,
	onDetailsPress,
	onBookAgain,
	onCancelBooking,
	onViewDetails,
}) => {
	const [showReasonModal, setShowReasonModal] = useState(false);
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
			case 'pending':
				return (
					<View className="justify-center items-center px-3 py-1 max-h-[30px] bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-yellow-700 dark:text-yellow-400">
							Pending
						</Text>
					</View>
				);

			case 'confirmed':
				return (
					<View className="justify-center items-center px-3 py-1 max-h-[30px] bg-blue-100 dark:bg-blue-900/40 rounded-full">
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-blue-700 dark:text-blue-400">
							Confirmed
						</Text>
					</View>
				);

			case 'in_progress':
				return (
					<View className="justify-center items-center px-3 py-1 max-h-[30px] bg-purple-100 dark:bg-purple-900/40 rounded-full">
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-purple-700 dark:text-purple-400">
							In Progress
						</Text>
					</View>
				);

			case 'completed':
				return (
					<View className="justify-center items-center px-3 py-1 max-h-[30px] bg-green-100 dark:bg-green-900/40 rounded-full">
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-green-700 dark:text-green-400">
							Completed
						</Text>
					</View>
				);

			case 'cancelled':
				return (
					<View className="justify-center items-center px-3 py-1 max-h-[30px] bg-red-100 dark:bg-red-900/40 rounded-full">
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-red-700 dark:text-red-400">
							Cancelled
						</Text>
					</View>
				);

			case 'rejected':
				return (
					<View className="justify-center items-center px-3 py-1 max-h-[30px] bg-gray-200 dark:bg-gray-800 rounded-full">
						<Text className="capitalize tracking-wider text-body-xs font-nexa-bold text-gray-700 dark:text-gray-300">
							Rejected
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
						className="w-5 h-5"
						tintColor={COLORS.light.pallete[600]}
					/>
					<View>
						<Text className="text-gray-900 dark:text-white text-body-xs font-nexa-bold leading-5">
							{formatDate(booking.scheduledDate as string)}
						</Text>
						<Text className="text-gray-900 dark:text-gray-200 text-body-xs font-nexa">
							{formatTime(booking.scheduledTime as string)}
						</Text>
					</View>
				</View>
				{getStatusBadge()}
			</View>

			{/* Service details */}
			{/* Service details */}
			<View className="mb-4 pb-4 border-b border-dashed border-gray-200 dark:border-gray-700">
				<View className="flex-row justify-between items-start">
					{/* Left: title + address */}
					<View className="flex-1 pr-3 gap-y-1">
						<Text className="text-base font-nexa-extrabold text-gray-900 dark:text-gray-50">
							{booking?.service?.title}
						</Text>

						<View className="flex-row items-start gap-x-1 mt-1">
							<Image
								source={icons.locationOutline}
								className="w-4 h-4 mt-0.5"
								tintColor={COLORS.gray[500]}
							/>
							<Text
								numberOfLines={2}
								className="text-body-xs font-nexa text-gray-500 dark:text-gray-400 leading-tight"
							>
								{booking?.address}
							</Text>
						</View>
					</View>

					{/* Right: duration chip */}
					<View className="items-end">
						<Text className="font-nexa-extrabold text-body-sm text-gray-900 dark:text-gray-50">
							Duration
						</Text>

						<View className="mt-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
							<Text className="font-nexa text-body-xs text-gray-700 dark:text-gray-200">
								{formatDuration(booking?.duration)}
							</Text>
						</View>
					</View>
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
				{/* PENDING or CONFIRMED → allow cancel + view */}
				{(booking.status === 'pending' || booking.status === 'confirmed') && (
					<>
						<TouchableOpacity
							onPress={() => onCancelBooking?.(booking._id)}
							className="flex-1 h-[44px] justify-center items-center border border-red-500 rounded-full"
						>
							<Text className="text-red-500 font-medium text-center text-body-sm">
								Cancel
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => onViewDetails?.(booking._id)}
							className="flex-1 h-[44px] justify-center items-center bg-light-pallete-400 rounded-full"
						>
							<Text className="text-gray-800 dark:text-gray-900 text-body-sm font-nexa-bold text-center">
								View Details
							</Text>
						</TouchableOpacity>
					</>
				)}

				{/* IN PROGRESS → only details */}
				{booking.status === 'in_progress' && (
					<TouchableOpacity
						onPress={() => onViewDetails?.(booking._id)}
						className="flex-1 h-[44px] justify-center items-center bg-light-pallete-400 rounded-full"
					>
						<Text className="text-gray-800 dark:text-gray-900 text-body-sm font-nexa-bold text-center">
							Track / Details
						</Text>
					</TouchableOpacity>
				)}

				{/* COMPLETED or CANCELLED → details + book again */}
				{(booking.status === 'completed' || booking.status === 'cancelled') && (
					<>
						<TouchableOpacity
							onPress={() => onDetailsPress?.(booking._id)}
							className="flex-1 h-[44px] justify-center items-center border border-light-pallete-400 rounded-full"
						>
							<Text className="text-light-pallete-600 dark:text-light-pallete-400 text-body-sm font-nexa">
								Details
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => onBookAgain?.(booking._id)}
							className="flex-1 h-[44px] justify-center items-center bg-light-pallete-400 rounded-full"
						>
							<Text className="text-gray-900 text-body-sm font-nexa-bold text-center">
								Book Again
							</Text>
						</TouchableOpacity>
					</>
				)}

				{/* REJECTED → details only */}
				{booking.status === 'rejected' && (
					<TouchableOpacity
						onPress={() => setShowReasonModal(true)}
						className="flex-1 h-[44px] justify-center items-center border border-gray-400 rounded-full"
					>
						<Text className="text-gray-500 text-body-sm font-nexa">
							View Reason
						</Text>
					</TouchableOpacity>
				)}
			</View>

			{booking.cancellation && (
				<CancellationReasonModal
					visible={showReasonModal}
					onClose={() => setShowReasonModal(false)}
					cancellation={booking.cancellation}
				/>
			)}
		</View>
	);
};

export default BookingCard;
