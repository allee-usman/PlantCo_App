import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { AntDesign } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
	Image,
	ImageSourcePropType,
	Pressable,
	Text,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import LottieLoader from './LottieLoader';

interface ProductCardProps {
	// Required props
	image: string | ImageSourcePropType;
	title: string;
	price: number;
	rating?: number;
	reviewCount?: number;

	// Optional props
	description?: string;
	compareAtPrice?: number;
	discount?: number;
	isWishlisted?: boolean;
	inStock?: boolean;
	added?: boolean;

	// Dimension props
	width?: number;
	height?: number;
	fullWidth?: boolean;

	// Callback props
	onPress?: () => void;
	onAddToCart?: () => void;
	onWishlistToggle?: () => void;

	// Loading state
	addingToCart?: boolean;

	// Style props
	className?: string;
	imageClassName?: string;

	// Accessibility
	accessibilityLabel?: string;
}

const StarRating: React.FC<{
	rating: number;
	reviewCount?: number;
	size?: number;
}> = ({ rating, reviewCount, size = 12 }) => {
	return (
		<View className="flex-row items-center gap-1">
			<View className="flex-row gap-0.5">
				{[...Array(5)].map((_, i) => {
					const difference = rating - i;

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
			</View>
			<Text className="text-xs font-nexa text-gray-600 dark:text-gray-400">
				{rating.toFixed(1)}{' '}
				{reviewCount !== undefined ? `(${reviewCount})` : ''}
			</Text>
		</View>
	);
};

const ProductCard: React.FC<ProductCardProps> = ({
	image,
	title,
	description,
	price,
	rating = 0,
	reviewCount,
	compareAtPrice,
	discount,
	isWishlisted = false,
	inStock = true,
	added = false,
	width,
	height,
	fullWidth = false,
	onPress,
	onAddToCart,
	onWishlistToggle,
	addingToCart = false,
	className,
	imageClassName,
	accessibilityLabel,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { width: screenWidth } = useWindowDimensions();

	// Calculate default dimensions
	const cardWidth = useMemo(() => {
		if (fullWidth) return screenWidth - 32; // Full width with padding
		return width || (screenWidth - 44) / 1.6;
	}, [width, fullWidth, screenWidth]);

	const cardHeight = useMemo(() => {
		return height || cardWidth * 1.4;
	}, [height, cardWidth]);

	const imageSource = useMemo(() => {
		if (typeof image === 'string') {
			return { uri: image };
		}
		return image;
	}, [image]);

	const handleAddToCart = (e: any) => {
		e.stopPropagation();
		if (onAddToCart && !addingToCart && inStock) {
			onAddToCart();
		}
	};

	const handleWishlistToggle = (e: any) => {
		e.stopPropagation();
		if (onWishlistToggle) {
			onWishlistToggle();
		}
	};

	return (
		<Pressable
			onPress={onPress}
			style={{
				width: cardWidth,
				height: cardHeight,
				// iOS shadow
				shadowColor: '#000',
				shadowOpacity: 0.08,
				shadowOffset: { width: 0, height: 2 },
				shadowRadius: 6,

				// Android shadow
				elevation: 3,
			}}
			className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm ${
				className || ''
			}`}
			accessibilityLabel={accessibilityLabel || `${title} product card`}
			accessibilityRole="button"
			accessibilityState={{ disabled: !inStock }}
		>
			{/* Image Container */}
			<View className="relative" style={{ height: cardHeight * 0.6 }}>
				<Image
					source={imageSource}
					style={{ width: '100%', height: '100%' }}
					className={`bg-gray-100 dark:bg-gray-800 ${imageClassName || ''}`}
					resizeMode="cover"
				/>

				{/* Wishlist Button */}
				{onWishlistToggle && (
					<Pressable
						onPress={handleWishlistToggle}
						className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full items-center justify-center shadow-md"
						hitSlop={8}
						accessibilityLabel={
							isWishlisted
								? `Remove ${title} from wishlist`
								: `Add ${title} to wishlist`
						}
						accessibilityRole="button"
					>
						<AntDesign
							name={isWishlisted ? 'heart' : 'hearto'}
							size={16}
							color={isWishlisted ? '#ff4757' : isDark ? '#F3F4F6' : '#374151'}
						/>
					</Pressable>
				)}

				{/* Discount Badge */}
				{discount && discount > 0 && (
					<View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-full">
						<Text className="text-xs font-nexa-bold text-white">
							-{discount}%
						</Text>
					</View>
				)}

				{/* Out of Stock Overlay */}
				{!inStock && (
					<View className="absolute inset-0 bg-black/50 items-center justify-center">
						<View className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full">
							<Text className="text-xs font-nexa-bold text-gray-900 dark:text-gray-100">
								Out of Stock
							</Text>
						</View>
					</View>
				)}
			</View>

			{/* Content Container */}
			<View className="flex-1 p-3 min-h-[200px]">
				{/* Title and Description */}
				<View className="mb-2">
					<Text
						className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100 mb-1"
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{title}
					</Text>

					{description && (
						<Text
							className="text-xs font-nexa text-gray-600 dark:text-gray-400"
							numberOfLines={2}
							ellipsizeMode="tail"
						>
							{description}
						</Text>
					)}
				</View>

				{/* Rating */}
				{rating !== undefined && (
					<View className="mb-2">
						<StarRating rating={rating} reviewCount={reviewCount} />
					</View>
				)}

				{/* Price and Add to Cart */}
				<View className="flex-row items-center justify-between">
					<View className="flex-1 mr-2">
						<View className="flex-row items-center gap-2">
							<Text className="text-sm font-nexa-extrabold text-gray-900 dark:text-gray-100">
								Rs. {price.toLocaleString()}
							</Text>
							{compareAtPrice && compareAtPrice > price && (
								<Text className="text-xs font-nexa text-gray-500 dark:text-gray-500 line-through">
									Rs. {compareAtPrice.toLocaleString()}
								</Text>
							)}
						</View>
					</View>

					{/* Add to Cart Button */}
					{/* {onAddToCart && (
						<Pressable
							onPress={handleAddToCart}
							disabled={addingToCart || !inStock}
							className={`size-[30px] rounded-full items-center justify-center shadow-sm ${
								addingToCart || !inStock
									? 'bg-gray-300 dark:bg-gray-700'
									: 'bg-light-pallete-300 dark:bg-light-pallete-400'
							}`}
							hitSlop={8}
							accessibilityLabel="Add to cart"
							accessibilityRole="button"
						>
							{addingToCart ? (
								<LottieLoader
									animation={animations.spinner}
									color={COLORS.gray[600]}
								/>
							) : (
								<Image
									source={icons.cartOutline}
									className="size-[16px]"
									tintColor={
										inStock ? COLORS.gray[600] : isDark ? '#4B5563' : '#9CA3AF'
									}
								/>
								// <Ionicons
								// 	name="cart-outline"
								// 	size={20}
								// 	color={inStock ? '#fff' : isDark ? '#4B5563' : '#9CA3AF'}
								// />
							)}
						</Pressable>
					)} */}
					{onAddToCart && (
						<Pressable
							onPress={handleAddToCart}
							disabled={addingToCart || !inStock}
							className={`size-[30px] rounded-full items-center justify-center shadow-sm ${
								addingToCart || !inStock
									? 'bg-gray-300 dark:bg-gray-700'
									: 'bg-light-pallete-300 dark:bg-light-pallete-400'
							}`}
							hitSlop={8}
							accessibilityLabel="Add to cart"
							accessibilityRole="button"
						>
							{/* show spinner while adding; show checkmark on success; otherwise show cart */}
							{addingToCart ? (
								<LottieLoader
									animation={animations.spinner}
									color={COLORS.gray[600]}
								/>
							) : added ? (
								// CHECKMARK: use AntDesign check or a small Lottie
								<AntDesign name="checkcircle" size={18} color={'#16A34A'} />
							) : (
								<Image
									source={icons.cartOutline}
									className="size-[16px]"
									tintColor={
										inStock ? COLORS.gray[600] : isDark ? '#4B5563' : '#9CA3AF'
									}
								/>
							)}
						</Pressable>
					)}
				</View>
			</View>
		</Pressable>
	);
};

export default ProductCard;
