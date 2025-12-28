import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import StarRating from './StarRating';

interface Review {
	id: string;
	userName: string;
	userImage: string | ImageSourcePropType;
	rating: number;
	date: string;
	comment: string;
	helpful: number;
}

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
	const imageSource = useMemo(() => {
		return typeof review.userImage === 'string'
			? { uri: review.userImage }
			: review.userImage;
	}, [review.userImage]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	return (
		<View className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-3 border border-gray-100 dark:border-gray-800">
			{/* User Info */}
			<View className="flex-row items-center mb-3">
				<Image
					source={imageSource}
					className="size-10 rounded-full bg-gray-100 dark:bg-gray-800"
					resizeMode="cover"
				/>
				<View className="flex-1 ml-3">
					<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
						{review.userName}
					</Text>
					<Text className="text-xs font-nexa text-gray-500 dark:text-gray-400">
						{formatDate(review.date)}
					</Text>
				</View>
				<StarRating rating={review.rating} size={12} showLabel />
			</View>

			{/* Review Comment */}
			<Text className="text-sm font-nexa text-gray-700 dark:text-gray-300 mb-3 leading-5">
				{review.comment}
			</Text>

			{/* Helpful Count */}
			<View className="flex-row items-center">
				<Ionicons name="thumbs-up-outline" size={14} color="#6B7280" />
				<Text className="text-xs font-nexa text-gray-500 dark:text-gray-400 ml-1">
					Helpful ({review.helpful})
				</Text>
			</View>
		</View>
	);
};
export default ReviewCard;
