import { IRecentReview } from '@/types/product.types';
import { formatCompactDate } from '@/utils/formatDate';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	FlatList,
	Pressable,
	Text,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import CustomButton from './CustomButton';

interface IReviewStats {
	averageRating: number;
	totalReviews: number;
	ratingDistribution: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

interface ReviewsSectionProps {
	reviewStats: IReviewStats;
	reviews: IRecentReview[];
}

const StarRating: React.FC<{ rating: number; size?: number }> = ({
	rating,
	size = 16,
}) => {
	return (
		<View className="flex-row gap-0.5">
			{[...Array(5)].map((_, i) => {
				const starValue = i + 1;
				const difference = rating - i;

				let iconName: 'star' | 'staro' = 'staro';
				if (difference >= 1) {
					iconName = 'star';
				}

				return (
					<View key={i} className="relative">
						{/* Background (empty star) */}
						<AntDesign name="staro" size={size} color="#FFA500" />

						{/* Foreground (filled star or half-filled) */}
						{difference > 0 && (
							<View
								style={{
									position: 'absolute',
									width: difference >= 1 ? '100%' : `${difference * 100}%`,
									overflow: 'hidden',
								}}
							>
								<AntDesign name="star" size={size} color="#FFA500" />
							</View>
						)}
					</View>
				);
			})}
		</View>
	);
};

const RatingBar: React.FC<{
	stars: number;
	count: number;
	total: number;
}> = ({ stars, count, total }) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const percentage = total > 0 ? (count / total) * 100 : 0;
	const barWidth = `${percentage}%`;

	return (
		<View className="flex-row items-center gap-3 mb-1">
			{/* Stars */}
			<Text className="text-sm font-nexa-extrabold text-gray-700 dark:text-gray-300 w-6 text-center">
				{stars}
			</Text>

			{/* Progress Bar */}
			<View className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
				<View
					style={{ width: barWidth }}
					className="h-full bg-gray-700 dark:bg-gray-400 rounded-full"
				/>
			</View>
		</View>
	);
};

const ReviewCard: React.FC<{ review: IRecentReview }> = ({ review }) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<View className="pb-2 border-b border-gray-200 dark:border-gray-700 mb-4">
			{/* User Info */}
			<View className="flex-row items-center gap-2 mb-2">
				<View className="w-[32px] h-[32px] bg-gray-300 dark:bg-gray-700 rounded-full items-center justify-center">
					<Ionicons
						name="person"
						size={16}
						color={isDark ? '#9CA3AF' : '#666'}
					/>
				</View>
				<View className="">
					<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
						{review.customer?.name}
					</Text>
					<View className="flex-row items-center gap-x-2 mb-2">
						<StarRating rating={review.rating} size={12} />
						<Text className="text-xs text-gray-400 dark:text-gray-500 font-nexa">
							{formatCompactDate(review.createdAt)}
						</Text>
					</View>
				</View>
			</View>

			{/* Title */}
			<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100 mb-1">
				{review.title}
			</Text>

			{/* Content */}
			<Text
				numberOfLines={isExpanded ? 0 : 3}
				className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-5 mb-2"
			>
				{review.comment}
			</Text>

			{/* Show More Button */}
			{review.comment.length > 100 && (
				<Pressable onPress={() => setIsExpanded(!isExpanded)}>
					<Text className="text-sm font-nexa-bold text-light-pallete-500 dark:text-light-pallete-400">
						{isExpanded ? 'Show less' : 'Show more'}
					</Text>
				</Pressable>
			)}
		</View>
	);
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
	reviewStats,
	reviews,
}) => {
	const { width: screenWidth } = useWindowDimensions();
	const [viewMore, setViewMore] = useState(false);

	const displayedReviews = viewMore ? reviews : reviews.slice(0, 2);

	// Calculate rating distribution for display
	const ratingArray = [
		{ stars: 5, count: reviewStats.ratingDistribution[5] },
		{ stars: 4, count: reviewStats.ratingDistribution[4] },
		{ stars: 3, count: reviewStats.ratingDistribution[3] },
		{ stars: 2, count: reviewStats.ratingDistribution[2] },
		{ stars: 1, count: reviewStats.ratingDistribution[1] },
	];

	return (
		<View className="px-4 mb-8">
			{/* Header */}
			<Text className="text-body font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-2">
				Ratings & Reviews
			</Text>
			<Text className="text-xs leading-4 font-nexa text-gray-500 dark:text-gray-400 mb-4">
				Ratings and reviews are from customers who have purchased this product.
			</Text>

			<View className="flex-row items-center justify-center">
				<View className="mb-6 items-center">
					<View className="items-center gap-2">
						<Text className="text-5xl font-nexa-extrabold text-gray-900 dark:text-gray-100 leading-10">
							{reviewStats.averageRating.toFixed(1)}
						</Text>
						<StarRating rating={reviewStats.averageRating} size={12} />
					</View>
					<Text className="font-nexa text-xs mt-1 dark:text-gray-400">
						{reviewStats.totalReviews}
					</Text>
				</View>

				{/* Rating Distribution */}
				<View className="mb-6 pb-6  px-4 w-[80%]">
					{ratingArray.map((rating) => (
						<RatingBar
							key={rating.stars}
							stars={rating.stars}
							count={rating.count}
							total={reviewStats.totalReviews}
						/>
					))}
				</View>
			</View>

			{/* Individual Reviews */}
			<View>
				{displayedReviews.length > 0 ? (
					<>
						<FlatList
							data={displayedReviews}
							renderItem={({ item }) => <ReviewCard review={item} />}
							keyExtractor={(item) => item._id}
							scrollEnabled={false}
							contentContainerStyle={{ paddingBottom: 12 }}
						/>

						{reviews.length > 2 && (
							<CustomButton
								label={
									viewMore
										? 'Show less reviews'
										: `View all ${reviews.length} reviews`
								}
								onPress={() => setViewMore(!viewMore)}
								bgVariant="secondary"
							/>
						)}
					</>
				) : (
					<Text className="text-sm text-gray-500 dark:text-gray-400 font-nexa text-center py-6">
						No reviews yet. Be the first to review!
					</Text>
				)}
			</View>
		</View>
	);
};

export default ReviewsSection;
