import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { toggleWishlist } from '@/services/user.product.services';
import { getResponsiveDimensions } from '@/utils/product.card.dimmensions';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	Image,
	Pressable,
	Text,
	View,
	useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';

export interface Product {
	id: string;
	name: string;
	description: string;
	image?: string;
	price: number;
	compareAtPrice?: number;
	rating?: number;
	reviewCount?: number;
	badge?: string;
	isWishlisted: boolean;
}

interface ProductCardProps {
	product: Product;
	onPress?: (id: string) => void;
	onWishlistPress?: (id: string) => void;
	onQuantityChange?: (id: string, quantity: number) => void;
	width?: number;
	variant?: 'compact' | 'standard' | 'expanded';
}

const ProductCard: React.FC<ProductCardProps> = ({
	product,
	onPress,
	onWishlistPress,
	onQuantityChange,
	width,
	variant = 'standard',
}) => {
	const { width: screenWidth } = useWindowDimensions();
	const [isWishlisted, setIsWishlisted] = useState<boolean>(
		product.isWishlisted ?? false
	);

	// console.log(product);

	const dimensions = getResponsiveDimensions(variant, screenWidth, width);
	if (dimensions.width === 0 || dimensions.height === 0) return null;

	const handleWishlistPress = async () => {
		try {
			await toggleWishlist(product.id, isWishlisted);
			setIsWishlisted(!isWishlisted);
			onWishlistPress?.(product.id); // still keep parent callback if needed
			Toast.show({
				type: 'success',
				text1: isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
			});
		} catch (error) {
			console.error('Failed to update wishlist:', error);
		}
	};

	const handleAddToCart = () => {
		// onQuantityChange?.(product.id, (product.quantity || 0) + 1);
		console.log('Handle/Implement Add to Cart Feature!');
	};

	const cardWidth = (screenWidth - 44) / 1.6;

	// console.log(product.shortDescription);

	// const formattedPrice = product.price.toFixed(0);
	return (
		<Pressable
			onPress={() => onPress?.(product.id)}
			android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
			// style={({ pressed }) => [
			// 	{
			// 		width: dimensions.width,
			// 		height: dimensions.height,
			// 		opacity: pressed ? 0.9 : 1,
			// 		// alignSelf: 'flex-start',
			// 	},
			// ]}
			style={{
				// width: 200, // 👈 fixed card width
				// height: 240, // 👈 fixed card height
				width: cardWidth,
				height: cardWidth * 1.4,
				alignSelf: 'flex-start',
				shadowColor: COLORS.gray[700],
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.08,
				shadowRadius: 10,
				elevation: 4, // for Android
			}}
			className="rounded-2xl bg-white dark:bg-gray-800 overflow-hidden"
			accessibilityLabel={`View details for ${product.name}`}
			accessibilityRole="button"
		>
			{/* Image Container */}
			<View
				style={{
					height: dimensions.height * dimensions.imageRatio,
				}}
				className="relative bg-gray-100 dark:bg-gray-800"
			>
				<Image
					source={{ uri: product.image }}
					style={{ width: '100%', height: '100%' }}
					resizeMode="cover"
					// style={{ width: '100%', height: 150 }}
					accessibilityLabel={`${product.name} image`}
				/>

				{/* Badge */}
				{product.badge && (
					<View
						style={{
							top: dimensions.imageSpacing,
							left: dimensions.imageSpacing,
						}}
						className="absolute bg-gradient-to-r from-orange-500 to-orange-600 px-2.5 py-1.5 rounded-lg shadow-md"
					>
						<Text
							style={{ fontSize: dimensions.titleSize * 0.7 }}
							className="text-white font-nexa-bold"
						>
							{product.badge.toUpperCase()}
						</Text>
					</View>
				)}

				{/* Wishlist Button */}
				<Pressable
					onPress={handleWishlistPress}
					style={{
						top: dimensions.imageSpacing,
						right: dimensions.imageSpacing,
						width: dimensions.iconSize * 2,
						height: dimensions.iconSize * 2,
					}}
					className="absolute rounded-full bg-white dark:bg-red-100 shadow-md items-center justify-center"
					accessibilityLabel={
						isWishlisted
							? `Remove ${product.name} from wishlist`
							: `Add ${product.name} to wishlist`
					}
					accessibilityRole="button"
				>
					<AntDesign
						name={isWishlisted ? 'heart' : 'hearto'}
						size={dimensions.iconSize}
						color={isWishlisted ? '#ff4757' : COLORS.gray[900]}
					/>
				</Pressable>
			</View>

			{/* Content Container */}
			<View
				style={{
					flex: 1,
					padding: dimensions.padding,
				}}
				className="justify-between"
			>
				{/* Product Title */}
				<Text
					numberOfLines={1}
					style={{ fontSize: dimensions.titleSize }}
					className="text-gray-900 dark:text-gray-50 font-nexa-extrabold leading-5 mb-1"
				>
					{product.name}
				</Text>
				<Text
					className="font-nexa text-body-xs text-gray-500 dark:text-gray-400 leading-5"
					numberOfLines={2}
				>
					{product.description}
				</Text>
				{/* Product description */}
				{/* {product.shortDescription && (
					<Text
						numberOfLines={2}
						className="text-gray-900 dark:text-gray-50 font-nexa leading-5 text-body-sm"
					>
						{product.shortDescription}
					</Text>
				)} */}

				{/* Rating Section */}
				{product.rating !== undefined ? (
					<View className="flex-row items-center mt-1.5">
						<View className="flex-row items-center bg-yellow-50 dark:bg-gray-800 px-2 py-1 rounded-full">
							<AntDesign
								name="star"
								size={dimensions.ratingSize * 0.9}
								color="#FFB800"
							/>
							<Text
								style={{ fontSize: dimensions.ratingSize }}
								className="text-gray-700 dark:text-gray-300 ml-1 font-nexa-bold"
							>
								{product.rating.toFixed(1)}
							</Text>
						</View>
						{product.reviewCount !== undefined && (
							<Text
								style={{ fontSize: dimensions.ratingSize * 0.95 }}
								className="text-gray-400 dark:text-gray-500 ml-1 font-nexa"
							>
								({product.reviewCount})
							</Text>
						)}
					</View>
				) : null}

				{/* Price and Add to Cart */}
				<View className="flex-row items-center justify-between gap-2">
					{/* Price Badge */}
					<View className="flex-1 flex-row gap-x-2 items-center">
						<Text
							style={{ fontSize: dimensions.priceSize }}
							className="text-gray-900 dark:text-gray-100 font-nexa-bold"
						>
							Rs. {product.price}
						</Text>
						{product.compareAtPrice && (
							<Text
								style={{ fontSize: dimensions.priceSize - 2 }}
								className="text-gray-300 text-[10px] dark:text-gray-500 font-nexa-bold line-through"
							>
								{product.compareAtPrice}
							</Text>
						)}
					</View>

					{/* Add to Cart Button */}
					<Pressable
						onPress={handleAddToCart}
						style={{
							width: dimensions.iconSize * 2,
							height: dimensions.iconSize * 2,
						}}
						className="rounded-full bg-light-pallete-400 dark:bg-light-pallete-300 items-center justify-center shadow-md"
						accessibilityLabel={`Add ${product.name} to cart`}
						accessibilityRole="button"
						android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
						// style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
					>
						<Image
							source={icons.basketOutline}
							className="size-5"
							tintColor={COLORS.gray[700]}
						/>
					</Pressable>
				</View>
			</View>
		</Pressable>
	);
};

export default ProductCard;
