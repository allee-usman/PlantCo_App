import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import ProductCard from '@/components/ProductCard';
import { useRecentlyViewedProducts } from '@/hooks/useRecentlyViewedProducts';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import SectionHeader from './SectionHeader';

export const RecentlyViewedProducts = () => {
	const { products, loading } = useRecentlyViewedProducts();

	return (
		<View className="mb-4">
			<View className="mb-4" style={{ paddingHorizontal: 16 }}>
				<SectionHeader label="Recently Viewed" />
			</View>
			{loading ? (
				<LottieLoadingIndicator />
			) : (
				<FlatList
					data={products}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item._id}
					contentContainerStyle={{
						gap: 12,
						paddingHorizontal: 16,
						marginBottom: 12,
					}}
					renderItem={({ item }) => (
						<ProductCard
							product={{
								id: item._id,
								name: item.name,
								price: item.price,
								compareAtPrice: item.compareAtPrice,
								image: item.images?.[0]?.url,
								rating: item.reviewStats?.averageRating,
								description: item.description,
								reviewCount: item.reviewStats?.totalReviews,
								isWishlisted: false,
							}}
						/>
					)}
					ListEmptyComponent={
						!loading && (
							<Text className="text-gray-500 dark:text-gray-400">
								No recently viewed products yet.
							</Text>
						)
					}
				/>
			)}
		</View>
	);
};
