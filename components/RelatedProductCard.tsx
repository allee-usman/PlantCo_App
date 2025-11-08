import { COLORS } from '@/constants/colors';
import { images } from '@/constants/images';
import { toggleWishlist } from '@/services/user.product.services';
import { IBaseProduct } from '@/types/product.types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface ProductCardProps {
	product: IBaseProduct & { isWishlisted?: boolean };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const router = useRouter();
	const [isWishlisted, setIsWishlisted] = useState<boolean>(
		product.isWishlisted ?? false
	);

	const discount = product.compareAtPrice
		? Math.round(
				((product.compareAtPrice - product.price) / product.compareAtPrice) *
					100
		  )
		: 0;

	const handleWishlistToggle = async () => {
		try {
			await toggleWishlist(product._id, isWishlisted);
			setIsWishlisted(!isWishlisted);
		} catch (error) {
			console.error('Failed to update wishlist:', error);
		}
	};

	return (
		<Pressable
			style={{
				width: 170, // 👈 fixed card width
				height: 280, // 👈 fixed card height
			}}
			className="flex-1 bg-light-surface rounded-2xl overflow-hidden"
			onPress={() =>
				router.push({
					pathname: '/(root)/home/product/[id]',
					params: {
						id: product._id,
						product: JSON.stringify(product),
					},
				})
			}
		>
			{/* Image */}
			<View className="relative">
				<Image
					// source={{ uri: product.images?.[0]?.url }}
					source={images.plant3}
					style={{ width: '100%', height: 150 }}
					resizeMode="cover"
				/>
				{discount > 0 && (
					<View className="absolute top-2 left-2 bg-orange-500 px-2 py-1 rounded-full">
						<Text className="text-white text-xs font-nexa-bold">
							{discount}% off
						</Text>
					</View>
				)}
				<Pressable
					className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow"
					onPress={handleWishlistToggle}
				>
					<Ionicons
						name={isWishlisted ? 'heart' : 'heart-outline'}
						size={20}
						color={isWishlisted ? COLORS.light.error.text : COLORS.gray[500]}
					/>
				</Pressable>
			</View>

			{/* Info */}
			<View className="p-3">
				<Text
					className="text-sm font-nexa-bold text-gray-900"
					numberOfLines={1}
				>
					{product.name}
				</Text>
				<Text
					className="text-xs text-gray-600 font-nexa mb-2"
					numberOfLines={1}
				>
					{product.shortDescription ?? '—'}
				</Text>

				{/* Rating */}
				<View className="flex-row items-center gap-1 mb-2">
					<AntDesign name="star" size={12} color="#FFB800" />
					<Text className="text-xs font-nexa-bold text-gray-700">
						{product.reviewStats?.averageRating?.toFixed(1) ?? 'N/A'}
					</Text>
					<Text className="text-xs text-gray-500 font-nexa">
						({product.reviewStats?.totalReviews ?? 0})
					</Text>
				</View>

				{/* Price */}
				<View className="flex-row gap-1 items-center">
					<Text className="text-sm font-nexa-bold text-gray-900">
						Rs. {product.price}
					</Text>
					{product.compareAtPrice && (
						<Text className="text-sm text-gray-400 font-nexa line-through">
							Rs. {product.compareAtPrice}
						</Text>
					)}
				</View>
			</View>
		</Pressable>
	);
};

export default ProductCard;
