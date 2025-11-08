import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WishlistHeaderProps {
	itemCount: number;
	onBack?: () => void;
	onShare?: () => void;
}

export const WishlistHeader: React.FC<WishlistHeaderProps> = ({
	itemCount,
	onBack,
	onShare,
}) => {
	const handleBack = () => {
		console.log('WishlistHeader: Back button pressed');
		// TODO: Implement navigation back functionality
		// navigation.goBack();
		onBack?.();
	};

	const handleShare = () => {
		console.log('WishlistHeader: Share wishlist button pressed');
		// TODO: Implement share wishlist functionality
		// Share.share({
		//   message: 'Check out my wishlist!',
		//   url: 'https://yourapp.com/wishlist/shared'
		// });
		onShare?.();
	};

	return (
		<View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
			<TouchableOpacity
				onPress={handleBack}
				className="p-2 -ml-2"
				activeOpacity={0.7}
			>
				<Ionicons name="arrow-back" size={24} color="#000" />
			</TouchableOpacity>

			<View className="flex-1 items-center">
				<Text className="text-lg font-semibold text-gray-900">Wishlist</Text>
				{itemCount > 0 && (
					<Text className="text-sm text-gray-500 mt-1">
						{itemCount} {itemCount === 1 ? 'item' : 'items'}
					</Text>
				)}
			</View>

			<TouchableOpacity
				onPress={handleShare}
				className="p-2 -mr-2"
				activeOpacity={0.7}
			>
				<Ionicons name="share-outline" size={24} color="#000" />
			</TouchableOpacity>
		</View>
	);
};
