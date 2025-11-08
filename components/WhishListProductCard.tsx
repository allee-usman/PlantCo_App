import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { WhishlistProduct } from '@/interfaces/interface';
import React from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) + gap (16)

interface ProductCardProps {
	product: WhishlistProduct;
	onRemoveFromWishlist: (productId: string) => void;
	onAddToCart: (productId: string) => void;
}

export const WhishlistProductCard: React.FC<ProductCardProps> = ({
	product,
	onRemoveFromWishlist,
	onAddToCart,
}) => {
	const handleRemoveFromWishlist = () => {
		console.log(
			`ProductCard: Remove from wishlist - ${product.name} (${product.id})`
		);
		onRemoveFromWishlist(product.id);
	};

	const handleAddToCart = () => {
		console.log(`ProductCard: Add to cart - ${product.name} (${product.id})`);
		onAddToCart(product.id);
	};

	const handleProductPress = () => {
		console.log(
			`ProductCard: Product pressed - ${product.name} (${product.id})`
		);

		//  router.push({
		// 		pathname: '/(root)/product-details',
		// 		params: { productId: product.id },
		// 	});
	};

	return (
		<TouchableOpacity
			onPress={handleProductPress}
			activeOpacity={0.9}
			className="w-full p-2 bg-light-surface rounded-2xl mb-3 dark:bg-gray-950 flex-row gap-x-3"
			style={{
				// iOS shadow
				shadowColor: COLORS.gray[700],
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.05,
				shadowRadius: 10,
				// Android shadow
				elevation: 4,
			}}
		>
			{/* image container */}
			<View className="w-[130px] h-[130px] relative">
				<Image
					// source={{ uri: product.image }}
					source={{ uri: product.image }}
					className="w-full h-full rounded-xl"
					resizeMode="cover"
				/>
				{/* action button container */}
				<Pressable
					className="w-[30px] z-10 h-[30px] absolute right-[5px] top-[5px] rounded-full bg-light-surface/90 justify-center items-center"
					onPress={() => {
						console.log('Toggle favourite pressed!');
					}}
				>
					<Image source={icons.heart} className="w-5 h-5" tintColor="#ef4444" />
				</Pressable>
			</View>
			{/* description container */}
			<View className="flex-1 p-1 justify-between">
				<Text
					numberOfLines={1}
					className="font-nexa-extrabold text-body text-gray-950 dark:text-gray-50"
				>
					{product.name}
				</Text>
				{/* price */}
				<Text
					className="font-nexa text-body-sm text-gray-500 dark:text-gray-400 leading-5"
					numberOfLines={2}
				>
					{product.description}
				</Text>
				{/* ratings */}
				<View className="flex-row items-center gap-x-1">
					<Image source={icons.star} className="w-5 h-5" />
					<Text className="text-gray-950 dark:text-gray-50 font-nexa-bold text-body-sm">
						{product.rating}
					</Text>
					<Text className="text-gray-500 text-body-xs">
						({product.reviewCount})
					</Text>
				</View>

				{/* price & add to cart */}
				<Pressable
					className="flex-row justify-between items-center"
					onPress={() => {
						console.log('Add to cart pressed!');
					}}
				>
					<Text className="font-nexa-extrabold text-body-sm text-gray-950 dark:text-gray-50">
						Rs. {product.price}
					</Text>

					<View className="border border-gray-200 p-1 flex-row gap-x-1 items-center rounded-full">
						<View className="justify-center items-center w-[28px] h-[28px] rounded-full bg-light-pallete-500 dark:bg-light-pallete-400">
							<Image
								source={icons.basketOutline}
								className="size-[16px]"
								tintColor={COLORS.gray[100]}
							/>
						</View>
						<Text className="text-body-xs font-nexa-bold me-1 text-gray-950 dark:text-gray-50">
							Shop
						</Text>
					</View>
				</Pressable>
			</View>
		</TouchableOpacity>
	);
};
