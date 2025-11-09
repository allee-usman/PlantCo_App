import CustomHeader from '@/components/CustomHeader';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import ProductCard from '@/components/TestingCard';
import { COLORS } from '@/constants/colors';
import { PLANT_SECTIONS } from '@/constants/constant';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/slices/authSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { RootState } from '@/redux/store';
import { listProducts } from '@/services/product.services';
import { toggleWishlist as toggleWishlistService } from '@/services/user.product.services';
import { IBaseProduct } from '@/types/product.types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	Text,
	View,
	useColorScheme,
	useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const SectionProductsScreen: React.FC = () => {
	const router = useRouter();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const dispatch = useAppDispatch();

	// Get section id and title from route params
	const { id: sectionId, title: sectionTitle } = useLocalSearchParams();

	const [products, setProducts] = useState<IBaseProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(
		new Set()
	);
	const { width: screenWidth } = useWindowDimensions();
	const cardWidth = screenWidth / 2 - 20;
	// Get user wishlist
	const { user } = useAppSelector((state: RootState) => state.auth);
	const wishlistSet = useMemo(() => {
		const wishlistIds = user?.customerProfile?.wishlist ?? [];
		return new Set(wishlistIds);
	}, [user?.customerProfile?.wishlist]);

	// Local wishlist for optimistic updates
	const [localWishlist, setLocalWishlist] = useState<Set<string>>(() => {
		const ids = wishlistSet;
		return new Set(ids);
	});

	// Sync local wishlist with store
	useEffect(() => {
		const ids = user?.customerProfile?.wishlist ?? [];
		setLocalWishlist(new Set(ids));
	}, [user?.customerProfile?.wishlist]);

	// Get section configuration
	const sectionConfig = useMemo(() => {
		const section = PLANT_SECTIONS.find((s) => s.id === sectionId);
		return section?.filters || {};
	}, [sectionId]);

	const fetchProducts = useCallback(
		async (isRefresh = false) => {
			try {
				if (isRefresh) {
					setRefreshing(true);
				} else {
					setLoading(true);
				}
				setError(null);

				// Build params from section config
				const params: Record<string, any> = { ...sectionConfig };

				// Convert arrays to comma-separated strings
				if (Array.isArray(params.tags)) params.tags = params.tags.join(',');
				if (Array.isArray(params.categories))
					params.categories = params.categories.join(',');

				// Fetch products
				const response = await listProducts(params);
				const fetchedProducts = Array.isArray(response?.products)
					? response.products
					: [];

				setProducts(fetchedProducts);
			} catch (err) {
				console.error('Failed to fetch section products:', err);
				setError('Failed to load products. Please try again.');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[sectionConfig]
	);

	useEffect(() => {
		fetchProducts();
	}, [sectionId, fetchProducts]);

	const handleRefresh = () => {
		fetchProducts(true);
	};

	const handleAddToCart = useCallback(
		async (productId: string, productName: string) => {
			try {
				setAddingToCartIds((prev) => new Set(prev).add(productId));

				await dispatch(
					addToCart({
						productId,
						quantity: 1,
					})
				).unwrap();

				Toast.show({
					type: 'success',
					text1: 'Added to Cart',
					text2: `${productName} added successfully`,
				});
			} catch (err: any) {
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: err?.message || 'Failed to add item to cart',
				});
				console.error('Add to cart error:', err);
			} finally {
				setAddingToCartIds((prev) => {
					const next = new Set(prev);
					next.delete(productId);
					return next;
				});
			}
		},
		[dispatch]
	);

	const handleWishlistToggle = useCallback(
		async (productId: string) => {
			const currentlyWishlisted = localWishlist.has(productId);

			// Optimistic update
			setLocalWishlist((prev) => {
				const next = new Set(prev);
				if (currentlyWishlisted) next.delete(productId);
				else next.add(productId);
				return next;
			});

			try {
				await toggleWishlistService(productId, currentlyWishlisted);

				// Update global user wishlist in store
				if (dispatch) {
					const updatedWishlist = currentlyWishlisted
						? (user?.customerProfile?.wishlist || []).filter(
								(id) => id !== productId
						  )
						: [...(user?.customerProfile?.wishlist || []), productId];

					const updatedUser = {
						...user,
						customerProfile: {
							...user?.customerProfile,
							wishlist: updatedWishlist,
						},
					} as any;

					dispatch(updateUser(updatedUser));
				}
			} catch (err) {
				console.error('Wishlist toggle failed', err);

				// Rollback optimistic update
				setLocalWishlist((prev) => {
					const next = new Set(prev);
					if (currentlyWishlisted) next.add(productId);
					else next.delete(productId);
					return next;
				});

				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: 'Failed to update wishlist',
				});
			}
		},
		[localWishlist, dispatch, user]
	);

	const renderProductItem = useCallback(
		({ item }: { item: IBaseProduct }) => (
			<View className="px-2 mb-4">
				<ProductCard
					image={item.images?.[0]?.url ?? ''}
					title={item.name}
					description={item.shortDescription ?? item.description}
					price={item.price}
					rating={item.reviewStats?.averageRating ?? 0}
					reviewCount={item.reviewStats?.totalReviews ?? 0}
					compareAtPrice={item.compareAtPrice}
					discount={
						item.compareAtPrice && item.compareAtPrice > item.price
							? Math.round(
									((item.compareAtPrice - item.price) / item.compareAtPrice) *
										100
							  )
							: undefined
					}
					isWishlisted={localWishlist.has(item._id)}
					// inStock={item.stock === undefined || item.stock > 0}
					addingToCart={addingToCartIds.has(item._id)}
					onPress={() =>
						router.push({
							pathname: '/(root)/home/product/[id]',
							params: { id: item._id, product: JSON.stringify(item) },
						})
					}
					onAddToCart={() => handleAddToCart(item._id, item.name)}
					onWishlistToggle={() => handleWishlistToggle(item._id)}
					width={cardWidth}
					height={cardWidth * 1.5}
				/>
			</View>
		),
		[
			localWishlist,
			addingToCartIds,
			handleAddToCart,
			handleWishlistToggle,
			router,
			cardWidth,
		]
	);

	const renderEmptyState = () => (
		<View className="flex-1 items-center justify-center py-20">
			<Text className="text-6xl mb-4">🌱</Text>
			<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 mb-2">
				No Products Found
			</Text>
			<Text className="text-sm font-nexa text-gray-600 dark:text-gray-400 text-center px-8">
				We couldn&apos;t find any products in this section. Check back later!
			</Text>
		</View>
	);

	const renderErrorState = () => (
		<View className="flex-1 items-center justify-center py-20">
			<Text className="text-6xl mb-4">⚠️</Text>
			<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 mb-2">
				Oops! Something went wrong
			</Text>
			<Text className="text-sm font-nexa text-gray-600 dark:text-gray-400 text-center px-8 mb-4">
				{error}
			</Text>
		</View>
	);

	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			<CustomHeader
				title={(sectionTitle as string) || 'Products'}
				iconLeft={
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={isDark ? 'white' : 'black'}
					/>
				}
				onIconLeftPress={() => router.back()}
			/>

			{loading ? (
				<View className="flex-1 items-center justify-center">
					<LottieLoadingIndicator />
				</View>
			) : error ? (
				renderErrorState()
			) : (
				<FlatList
					data={products}
					renderItem={renderProductItem}
					keyExtractor={(item) => item._id}
					numColumns={2}
					columnWrapperStyle={{
						paddingHorizontal: 8,
						// gap: 8,
					}}
					contentContainerStyle={{
						paddingTop: 16,
						paddingBottom: 24,
					}}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							tintColor={isDark ? COLORS.light.pallete[500] : COLORS.gray[600]}
							colors={[COLORS.light.pallete[500]]}
						/>
					}
					ListEmptyComponent={renderEmptyState}
					ListHeaderComponent={
						products.length > 0 ? (
							<View className="px-4 mb-4">
								<Text className="text-sm font-nexa text-gray-600 dark:text-gray-400">
									{products.length} product{products.length !== 1 ? 's' : ''}{' '}
									found
								</Text>
							</View>
						) : null
					}
				/>
			)}
		</SafeAreaView>
	);
};

export default SectionProductsScreen;
