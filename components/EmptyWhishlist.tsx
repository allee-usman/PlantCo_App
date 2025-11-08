import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import CustomButton from './CustomButton';

export const EmptyWishlist: React.FC = () => {
	const handleExplore = () => {
		console.log('EmptyWishlist: Explore button pressed');
	};

	return (
		<View className="flex-1 justify-center items-center px-8">
			{/* Empty Box Illustration */}
			<View className="mb-8">
				<Image
					source={icons.wishlist}
					className="h-[150px] w-[150px]"
					tintColor={COLORS.light.pallete[400]}
				/>
			</View>

			{/* Text Content */}
			<Text className="text-2xl font-nexa-heavy text-gray-900 dark:text-gray-50 mb-3 text-center">
				Your Wishlist is Empty!
			</Text>

			<Text className="text-gray-500 text-lip dark:text-gray-600 text-center mb-8 leading-5 font-nexa">
				Tap heart button to start saving{'\n'}your favorite items.
			</Text>

			{/* Explore Button */}
			<CustomButton
				label="Explore"
				bgVariant="primary"
				textVariant="primary"
				className="w-[130px] h-[50px]"
			/>
		</View>
	);
};
