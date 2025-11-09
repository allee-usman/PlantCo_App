import CustomHeader from '@/components/CustomHeader';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import ProductCard from '@/components/TestingCard';
import { COLORS } from '@/constants/colors';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { listProducts } from '@/services/product.services';
import { IBaseProduct } from '@/types/product.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	RefreshControl,
	Text,
	View,
	useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SponsoredProductsScreen: React.FC = () => {
	const router = useRouter();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const screenWidth = useScreenWidth();
	const cardWidth = screenWidth / 2 - 20; // Subtracting padding/margins

	const [products, setProducts] = useState<IBaseProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSponsoredProducts = async (isRefresh = false) => {
		try {
			if (isRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}
			setError(null);

			// Fetch products with sponsored tag/filter
			const response = await listProducts({
				featured: true,
				limit: 20,
				inStock: true,
				sort: '-createdAt',
			});

			const fetchedProducts = Array.isArray(response?.products)
				? response.products
				: [];

			setProducts(fetchedProducts);
		} catch (err) {
			console.error('Failed to fetch sponsored products:', err);
			setError('Failed to load sponsored products. Please try again.');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchSponsoredProducts();
	}, []);

	const handleRefresh = () => {
		fetchSponsoredProducts(true);
	};

	const renderSponsoredProduct = ({ item }: { item: IBaseProduct }) => (
		<ProductCard
			key={item._id}
			title={item.name}
			description={item.shortDescription || item.description}
			image={item.images?.[0]?.url}
			price={item.price}
			width={cardWidth}
			height={cardWidth * 1.85}
		/>
	);

	const renderEmptyState = () => (
		<View className="flex-1 items-center justify-center py-20">
			<Text className="text-6xl mb-4">🎯</Text>
			<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 mb-2">
				No Sponsored Products
			</Text>
			<Text className="text-sm font-nexa text-gray-600 dark:text-gray-400 text-center px-8">
				Check back later for featured products and special offers
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
				title="Sponsored Products"
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
					renderItem={renderSponsoredProduct}
					keyExtractor={(item) => item._id}
					contentContainerStyle={{
						paddingTop: 16,
						paddingBottom: 24,
						paddingHorizontal: 12,
						justifyContent: 'space-between',
						alignItems: 'center',
						flexDirection: 'row',
						flexWrap: 'wrap',
						rowGap: 12,
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
							<View className="mb-0">
								<Text className="text-sm font-nexa text-gray-600 dark:text-gray-400">
									Discover our featured products and exclusive deals
								</Text>
							</View>
						) : null
					}
				/>
			)}
		</SafeAreaView>
	);
};

export default SponsoredProductsScreen;
