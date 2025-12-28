// import { COLORS } from '@/constants/colors';
// import { icons } from '@/constants/icons';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { IBooking } from '@/types/booking.types';
import { formatDateTime, getFinishTime } from '@/utils/formatDate';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface BookingInfoCardProps {
	booking: IBooking;
}

const BookingInfoCard: React.FC<BookingInfoCardProps> = ({ booking }) => {
	const getStatusTextColor = () => {
		switch (booking.status) {
			case 'completed':
				return 'text-green-600 dark:text-green-600';
			case 'pending':
				return 'text-orange-400 dark:text-orange-300';
			case 'in_progress':
				return 'text-orange-400 dark:text-orange-300';
			case 'rejected':
				return 'text-orange-400 dark:text-orange-300';
			case 'cancelled':
				return 'text-red-600 dark:text-red-400';
			default:
				return 'text-gray-900 dark:text-gray-50';
		}
	};

	const finishTime = getFinishTime(
		booking.scheduledTime as string,
		booking.duration
	);

	return (
		<View className="bg-light-surface dark:bg-gray-800 rounded-xl p-4 mx-4 mb-4 ">
			{/* Header with status */}
			<View className="flex-row h-[80px] items-center justify-between mb-4">
				<View className="flex-row items-center gap-x-3">
					{/* Service Image */}
					<View className="w-[80px] h-[80px] rounded-xl bg-gray-300 dark:bg-gray-800">
						<Image
							source={
								booking.service.image && { uri: booking.service.image.url }
							}
							className="w-full h-full rounded-lg overflow-hidden"
							resizeMode="cover"
						/>
					</View>
					{/* Service Basic Details */}
					<View className="justify-between p-1 h-full">
						{/* Service Name */}
						<Text className="text-body font-nexa-extrabold text-gray-900 dark:text-white">
							{booking.service.title}
						</Text>
						{/* Booking ID */}

						<Text className="text-gray-600 dark:text-gray-400 font-nexa-bold text-body-xs">
							Booking ID:{' '}
							<Text className="font-nexa">{booking.bookingNumber}</Text>
						</Text>
						{/* Service Rate */}
						<Text className="font-nexa-extrabold text-gray-950 dark:text-white text-body-sm">
							Rs. {booking.service.hourlyRate}/hr
						</Text>
					</View>
				</View>
			</View>

			{/* meta data */}
			<View className="bg-light-screen/80 dark:bg-gray-900 rounded-xl px-3">
				{/* Start time */}
				<View className="py-3 border-b border-dashed border-gray-200 dark:border-gray-800 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Started At
					</Text>
					<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
						{formatDateTime(booking.scheduledTime as string)}
					</Text>
				</View>
				{/* finish time */}
				<View className="py-3 border-b border-dashed border-gray-200 dark:border-gray-800 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Finished At
					</Text>
					<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
						{finishTime}
					</Text>
				</View>
				{/* Duration */}
				<View className="py-3 border-b border-dashed border-gray-200 dark:border-gray-800 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Duration
					</Text>
					<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
						{booking.duration} hours
					</Text>
				</View>
				{/* Status */}
				<View className="py-3 flex-row justify-between">
					<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
						Status
					</Text>
					<Text
						className={`${getStatusTextColor()} font-nexa-bold text-body-sm capitalize`}
					>
						{booking.status}
					</Text>
				</View>
			</View>

			{/* Address */}
			<View className="flex-row mt-4 justify-center items-center">
				<Image
					source={icons.locationOutline}
					className="w-4 h-4"
					tintColor={COLORS.light.pallete[600]}
				/>
				<Text className="text-gray-900 text-wrap dark:text-gray-400 ml-2 flex-1 font-nexa-bold">
					{booking.address}
				</Text>
			</View>

			{/* Notes if available */}
			{booking.notes && (
				<View className="mt-4">
					<Text className="font-nexa-bold text-body-sm text-gray-900 dark:text-white mb-1">
						Notes:
					</Text>
					<Text className="font-nexa leading-4 text-body-xs text-gray-600 dark:text-gray-400">
						{booking.notes}
					</Text>
				</View>
			)}
		</View>
	);
};

export default BookingInfoCard;
