import React from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';

interface SponsoredProductCardProps {
	product: {
		id: string;
		title: string;
		punchLine: string;
		image: string;
	};
}

const SponsoredProductsCard: React.FC<SponsoredProductCardProps> = ({
	product,
}) => {
	const { width: screenWidth } = useWindowDimensions();

	const cardWidth = (screenWidth - 56) / 3;
	return (
		<TouchableOpacity
			className="overflow-hidden gap-y-1"
			style={{ width: cardWidth, height: 130 }}
		>
			{/* Product Image */}
			<View className="bg-light-pallete-400 rounded-lg">
				<Image
					source={{ uri: product.image }}
					className="w-full h-[90px] rounded-lg"
					resizeMode="cover"
					style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
				/>
				<Text
					className="text-[10px] font-nexa p-1 text-gray-700 text-center"
					numberOfLines={1}
				>
					{product.punchLine}
				</Text>
			</View>
			<Text
				className="text-body-xs font-nexa-bold text-center text-gray-950 dark:text-gray-50"
				numberOfLines={1}
			>
				{product.title}
			</Text>
		</TouchableOpacity>
	);
};

export default SponsoredProductsCard;
