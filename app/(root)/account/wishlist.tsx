import { EmptyWishlist } from '@/components/EmptyWhishlist';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import { WhishlistProductCard } from '@/components/WhishListProductCard';
import { WhishlistProduct } from '@/interfaces/interface';
import {
	getWishlistProducts,
	removeFromWishlist,
} from '@/services/user.product.services';
import React, { useCallback, useEffect, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	Text,
	View,
} from 'react-native';

const WishlistScreen: React.FC = () => {
	const [wishlistItems, setWishlistItems] = useState<WhishlistProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 🔹 Load wishlist on mount
	useEffect(() => {
		loadWishlist();
	}, []);

	const loadWishlist = async (isRefresh = false) => {
		try {
			if (!isRefresh) setLoading(true);
			setError(null);

			const items = await getWishlistProducts();
			// Map backend response to your UI interface if needed
			const mappedItems: WhishlistProduct[] = items.map((item) => ({
				id: item._id,
				name: item.name,
				price: item.price,
				image: item.images?.[0]?.url,
				category: item.type === 'plant' ? 'Plants' : 'Accessories',
				inStock:
					item.stockStatus === 'in-stock' || item.stockStatus === 'low-stock',
				description: item.description,
				rating: item.reviewStats?.averageRating ?? 0,
				reviewCount: item.reviewStats?.totalReviews ?? 0,
			}));

			setWishlistItems(mappedItems);
		} catch (err) {
			console.error('Error loading wishlist:', err);
			setError('Failed to load wishlist');
		} finally {
			setLoading(false);
			if (isRefresh) setRefreshing(false);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadWishlist(true);
	}, []);

	// 🗑️ Remove item from wishlist
	const handleRemoveFromWishlist = async (productId: string) => {
		try {
			// Optimistic UI update
			setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

			await removeFromWishlist(productId);
		} catch (err) {
			console.error('Error removing item from wishlist:', err);
			setWishlistItems((prev) => [...prev]); // revert
		}
	};

	const handleAddToCart = async (productId: string) => {
		console.log('Adding to cart', productId);
		// integrate your add-to-cart API here later
	};

	const handleExplore = () => {
		console.log('Navigate to explore/shop screen');
		// TODO: navigation logic
	};

	const renderProductItem = ({ item }: { item: WhishlistProduct }) => (
		<View className="flex-1 px-4 flex-col">
			<WhishlistProductCard
				product={item}
				onRemoveFromWishlist={handleRemoveFromWishlist}
				onAddToCart={handleAddToCart}
			/>
		</View>
	);

	const renderEmptyComponent = useCallback(() => <EmptyWishlist />, []);
	const renderFooter = useCallback(() => <View className="h-4" />, []);

	// ⏳ Loading state
	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
				<LottieLoadingIndicator />
			</SafeAreaView>
		);
	}

	// ❌ Error state
	if (error && wishlistItems.length === 0) {
		return (
			<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
				<View className="flex-1 justify-center items-center px-6">
					<Text className="text-red-500 dark:text-red-400 text-center mb-4">
						{error}
					</Text>
					<Text
						className="text-blue-500 dark:text-blue-400"
						onPress={() => loadWishlist()}
					>
						Retry
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<FlatList
				data={wishlistItems}
				renderItem={renderProductItem}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					flexGrow: 1,
					paddingTop: 16,
				}}
				ListEmptyComponent={renderEmptyComponent}
				ListFooterComponent={renderFooter}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={['#059669']}
						tintColor="#059669"
					/>
				}
				keyboardShouldPersistTaps="handled"
			/>
		</SafeAreaView>
	);
};

export default WishlistScreen;
