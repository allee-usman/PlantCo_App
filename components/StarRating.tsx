import { AntDesign } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const StarRating: React.FC<{
	rating: number;
	size?: number;
	showLabel?: boolean;
}> = ({ rating, size = 14, showLabel = false }) => {
	const clampedRating = Math.max(0, Math.min(5, rating));

	return (
		<View className="flex-row items-center gap-0.5">
			{[...Array(5)].map((_, i) => {
				const difference = clampedRating - i;
				return (
					<View key={i} className="relative">
						<AntDesign name="staro" size={size} color="#FFA500" />
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
			{showLabel && (
				<Text className="text-sm font-nexa-bold text-gray-700 dark:text-gray-300 ml-1">
					{clampedRating.toFixed(1)}
				</Text>
			)}
		</View>
	);
};
export default StarRating;
