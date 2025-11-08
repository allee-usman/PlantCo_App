import { IBaseProduct } from '@/types/product.types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface ProductInfoSectionProps {
	product: IBaseProduct;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
	product,
}) => {
	const discount = product.compareAtPrice
		? Math.round(
				((product.compareAtPrice - product.price) / product.compareAtPrice) *
					100
		  )
		: 0;

	// console.log(product.vendor);

	return (
		<View className="px-4 py-4">
			{/* Category Badge */}
			{product.isOnSale && (
				// TODO: Replace with badges when backend ready
				<View className="mb-3">
					<View className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full w-max">
						<Text className="text-xs font-nexa text-gray-700 dark:text-gray-200">
							{product.isOnSale}
						</Text>
					</View>
				</View>
			)}

			<Text className="text-2xl font-nexa-extrabold text-gray-900 dark:text-white mb-4">
				{product.name}
			</Text>

			{/* Rating */}
			<View className="flex-row items-center gap-3 mb-6">
				<View className="border border-gray-300 dark:border-gray-500 rounded-full px-2 py-1.5 flex-row gap-1 items-center">
					<View className="flex-row items-center">
						<AntDesign name="star" size={14} color="#FFB800" />
						<Text className="text-sm font-nexa-bold text-gray-700 dark:text-gray-400 ml-1">
							{product.reviewStats?.averageRating?.toFixed(1) || 'N/A'}
						</Text>
					</View>
					<Text className="text-sm text-gray-500 dark:text-gray-300 font-nexa">
						({product.reviewStats?.totalReviews || 0})
					</Text>
				</View>
				<View className="border border-gray-300 dark:border-gray-500 rounded-full px-2 py-1.5">
					<Text className="text-sm text-gray-500 dark:text-gray-300 font-nexa">
						Sold 200+
					</Text>
				</View>
				<View className="border border-gray-300 dark:border-gray-500 rounded-full px-2 py-1.5">
					<Text className="text-sm text-gray-500 dark:text-gray-300 font-nexa">
						Stock {product.stockStatus || 0}
					</Text>
				</View>
			</View>

			{/* Vendor */}
			{product.vendor && (
				<View className="flex-row items-center gap-2 mb-6">
					<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa">
						Vendor:{' '}
					</Text>
					<Text className="text-sm text-gray-900 dark:text-white font-nexa-bold">
						{product.vendor?.vendorProfile?.businessName ?? 'dummy_name'}
					</Text>
					<Ionicons name="chevron-forward" size={16} color="#999" />
				</View>
			)}

			{/* Price */}
			<View className="flex-row items-center gap-2 mb-2">
				<Text className="text-body font-nexa-extrabold text-gray-900 dark:text-white">
					Rs. {product.price}
				</Text>
				{product.compareAtPrice && (
					<>
						<Text className="text-body text-gray-400 dark:text-gray-500 font-nexa-bold line-through">
							Rs. {product.compareAtPrice}
						</Text>
						<View className="bg-red-100 dark:bg-red-700 px-3 py-1 rounded-full">
							<Text className="text-body-xs font-nexa-bold text-red-600 dark:text-red-300">
								{discount}% off
							</Text>
						</View>
					</>
				)}
			</View>

			<Text className="text-[10px] text-gray-400 dark:text-gray-500 font-nexa">
				Inc. Included. Shipping calculated at checkout.
			</Text>
		</View>
	);
};
