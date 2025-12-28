import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { IProviderRef } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';

interface ServiceProviderCardProps {
	provider: IProviderRef;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
	provider,
}) => {
	const handleCall = () => {
		Linking.openURL(`tel:${provider.phone}`);
	};

	const handleEmail = () => {
		Linking.openURL(`mailto:${provider.email}`);
	};

	return (
		<View>
			<Text className="text-body-sm font-nexa-extrabold text-gray-900 dark:text-white mb-2">
				Provider Details
			</Text>
			<View className="bg-light-surface dark:bg-gray-800 rounded-xl p-4 mb-4">
				<View className="flex-row items-center mb-3">
					<View className="w-[48px] h-[48px] mr-3" style={{ borderRadius: 99 }}>
						<Image
							source={images.avatar}
							className="w-full h-full rounded-full"
							resizeMode="cover"
						/>
					</View>
					<View className="flex-1 gap-y-1">
						<Text className="font-nexa-extrabold text-body text-gray-900 dark:text-white">
							{provider.serviceProviderProfile?.businessName}
						</Text>
						<View className="flex-row items-center">
							<Image
								source={icons.star}
								className="w-4 h-4"
								resizeMode="cover"
								// tintColor="#FFD700"
							/>
							<Text className="text-gray-600 dark:text-gray-400 ml-1 text-body-xs">
								{provider?.serviceProviderProfile?.stats?.averageRating} (
								{provider.serviceProviderProfile?.stats?.totalReviews} reviews)
							</Text>
						</View>
					</View>
				</View>

				{/* action buttons */}
				<View className="flex-row gap-x-3">
					<TouchableOpacity
						onPress={handleCall}
						className="flex-1 flex-row items-center justify-center py-3 border border-light-pallete-500 rounded-full"
					>
						<Image
							source={icons.call}
							className="w-5 h-5"
							resizeMode="cover"
							tintColor={COLORS.light.pallete[500]}
						/>
						<Text className="text-light-pallete-500 text-body-sm font-nexa-bold ml-2">
							Call
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleEmail}
						className="flex-1 flex-row items-center justify-center py-3 bg-light-pallete-500 rounded-full"
					>
						{/* //TODO: Change icon */}
						<Ionicons name="mail" size={18} color="#ffffff" />
						<Text className="text-white text-body-sm font-nexa-bold ml-2">
							Message
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default ServiceProviderCard;
