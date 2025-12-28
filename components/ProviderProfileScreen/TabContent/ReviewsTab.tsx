import ReviewCard from '@/components/ReviewCard';
import React from 'react';
import { ImageSourcePropType, Text, View } from 'react-native';

interface Review {
	id: string;
	userName: string;
	userImage: string | ImageSourcePropType;
	rating: number;
	date: string;
	comment: string;
	helpful: number;
}

interface ReviewsProps {
	reviews: Review[];
	onItemPress?: (review: Review) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, onItemPress }) => {
	return (
		<View>
			<Text className="text-base font-nexa-extrabold text-gray-900 dark:text-gray-100 mb-3">
				Customer Reviews
			</Text>
			{reviews.map((review) => (
				<ReviewCard key={review.id} review={review} />
			))}
		</View>
	);
};

export default Reviews;
