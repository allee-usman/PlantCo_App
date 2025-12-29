import ProductCard from '@/components/TestingCard';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { listProducts } from '@/services/product.services';
import { IBaseProduct } from '@/types/product.types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SEARCH_HISTORY_KEY = 'product_search_history';
const MAX_HISTORY_ITEMS = 10;

interface SearchFilters {
	category?: string;
	type?: string;
	minPrice?: number;
	maxPrice?: number;
	sortBy?: 'price_asc' | 'price_desc' | 'featured' | 'newest';
}

const SearchScreen = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	// States
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<IBaseProduct[]>([]);
	const [searchHistory, setSearchHistory] = useState<string[]>([]);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState<SearchFilters>({});
	const [hasSearched, setHasSearched] = useState(false);
	const [totalCount, setTotalCount] = useState(0);

	// Popular categories
	const popularCategories = [
		{ id: '68ff015e3f8dc708b3b552f9', label: 'Outdoor Plants' },
		{ id: '68ff01f43f8dc708b3b55303', label: 'Indoor Plants' },
		{ id: '68ff03ae3f8dc708b3b55308', label: 'Succulents' },
		{ id: '68ff046d3f8dc708b3b5530e', label: 'Flowering Plants' },
		{ id: 'herbs', label: 'Herbs' },
		{ id: 'accessories', label: 'Accessories' },
	];

	// Load search history on mount
	useEffect(() => {
		loadSearchHistory();
	}, []);

	const loadSearchHistory = async () => {
		try {
			const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
			if (history) {
				const parsed = JSON.parse(history);
				setSearchHistory(parsed);
				setRecentSearches(parsed.slice(0, 5));
			}
		} catch (error) {
			console.error('Failed to load search history:', error);
		}
	};

	const saveSearchToHistory = useCallback(
		async (query: string) => {
			try {
				const trimmedQuery = query.trim();
				if (!trimmedQuery) return;

				let updatedHistory = [
					trimmedQuery,
					...searchHistory.filter((q) => q !== trimmedQuery),
				];
				updatedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

				await AsyncStorage.setItem(
					SEARCH_HISTORY_KEY,
					JSON.stringify(updatedHistory)
				);
				setSearchHistory(updatedHistory);
				setRecentSearches(updatedHistory.slice(0, 5));
			} catch (error) {
				console.error('Failed to save search history:', error);
			}
		},
		[searchHistory]
	);

	const clearSearchHistory = async () => {
		try {
			await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
			setSearchHistory([]);
			setRecentSearches([]);
		} catch (error) {
			console.error('Failed to clear search history:', error);
		}
	};

	const handleSearch = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				setSearchResults([]);
				setHasSearched(false);
				setTotalCount(0);
				return;
			}

			setLoading(true);
			setHasSearched(true);

			try {
				// Save to history
				await saveSearchToHistory(query);

				// Prepare sort parameter based on sortBy filter
				let sort = '-createdAt'; // Default: newest first
				if (filters.sortBy === 'price_asc') sort = 'price';
				else if (filters.sortBy === 'price_desc') sort = '-price';
				else if (filters.sortBy === 'featured') sort = '-featured,-createdAt';

				// Make API call with filters
				const response = await listProducts({
					search: query,
					category: filters.category,
					type: filters.type,
					minPrice: filters.minPrice,
					maxPrice: filters.maxPrice,
					sort,
					limit: 20,
					page: 1,
					inStock: true, // Only show in-stock products
				});

				setSearchResults(response.products || []);
				setTotalCount(response.totalCount || 0);
			} catch (error) {
				console.error('Search failed:', error);
				setSearchResults([]);
				setTotalCount(0);
			} finally {
				setLoading(false);
			}
		},
		[filters, saveSearchToHistory]
	);

	const handleCategoryPress = ({
		label,
		categoryId,
	}: {
		label: string;
		categoryId: string;
	}) => {
		setFilters({ ...filters, category: categoryId });
		setSearchQuery(label);
		handleSearch(label); // <-- use label, not searchQuery
	};

	const handleHistoryPress = (query: string) => {
		setSearchQuery(query);
		handleSearch(query);
	};

	const renderProductItem = ({ item }: { item: IBaseProduct }) => {
		// // Get primary image or first image
		// const primaryImage =
		// 	item.images?.find((img) => img.isPrimary) || item.images?.[0];

		// return (
		// 	<TouchableOpacity
		// 		onPress={() => handleProductPress(item._id!)}
		// 		className="bg-white dark:bg-gray-900 rounded-xl p-3 mb-3 mx-4 border border-gray-100 dark:border-gray-800"
		// 		activeOpacity={0.7}
		// 	>
		// 		<View className="flex-row gap-3">
		// 			{/* Product Image */}
		// 			<View className="relative">
		// 				{primaryImage?.url ? (
		// 					<Image
		// 						source={{ uri: primaryImage.url }}
		// 						className="w-20 h-20 rounded-lg"
		// 						resizeMode="cover"
		// 					/>
		// 				) : (
		// 					<View className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 items-center justify-center">
		// 						<Ionicons
		// 							name="image-outline"
		// 							size={32}
		// 							color={COLORS.gray[400]}
		// 						/>
		// 					</View>
		// 				)}

		// 				{/* Featured Badge */}
		// 				{item.featured && (
		// 					<View className="absolute top-1 left-1 bg-primary px-2 py-0.5 rounded">
		// 						<Text className="text-white font-nexa-bold text-[10px]">
		// 							Featured
		// 						</Text>
		// 					</View>
		// 				)}

		// 				{/* Stock Badge */}
		// 				{item.stockStatus === 'out-of-stock' && (
		// 					<View className="absolute bottom-1 right-1 bg-red-600 px-2 py-0.5 rounded">
		// 						<Text className="text-white font-nexa-bold text-[10px]">
		// 							Out of Stock
		// 						</Text>
		// 					</View>
		// 				)}
		// 			</View>

		// 			{/* Product Details */}
		// 			<View className="flex-1">
		// 				<Text
		// 					className="text-base font-nexa-bold text-gray-900 dark:text-gray-100 mb-1"
		// 					numberOfLines={2}
		// 				>
		// 					{item.name}
		// 				</Text>

		// 				{/* Category & Type */}
		// 				{/* <View className="flex-row items-center gap-2 mb-1">
		// 					{item.category && (
		// 						<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa">
		// 							{item.category}
		// 						</Text>
		// 					)}
		// 					{item.type && (
		// 						<>
		// 							<View className="w-1 h-1 rounded-full bg-gray-400" />
		// 							<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa">
		// 								{item.type}
		// 							</Text>
		// 						</>
		// 					)}
		// 				</View> */}

		// 				<Text
		// 					className="text-xs text-gray-500 dark:text-gray-400 font-nexa mb-2"
		// 					numberOfLines={2}
		// 				>
		// 					{item.description}
		// 				</Text>

		// 				<View className="flex-row items-center justify-between">
		// 					{/* <View className="flex-row items-center gap-1">
		// 						<Text className="text-base font-nexa-extrabold text-light-pallete-500">
		// 							Rs. {item.price}
		// 						</Text>
		// 						{item.discountedPrice && item.discountedPrice < item.price && (
		// 							<>
		// 								<Text className="text-xs text-gray-400 dark:text-gray-500 font-nexa line-through ml-1">
		// 									Rs. {item.discountedPrice}
		// 								</Text>
		// 								<View className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded ml-1">
		// 									<Text className="text-xs text-green-600 dark:text-green-400 font-nexa-bold">
		// 										{Math.round(
		// 											((item.price - item.discountedPrice) / item.price) *
		// 												100
		// 										)}
		// 										% OFF
		// 									</Text>
		// 								</View>
		// 							</>
		// 						)}
		// 					</View> */}

		// 					{/* Stock Info */}
		// 					{item.stockStatus !== undefined &&
		// 						item.stockStatus === 'in-stock' && (
		// 							<View className="flex-row items-center gap-1">
		// 								<Ionicons
		// 									name="checkmark-circle"
		// 									size={14}
		// 									color="#10B981"
		// 								/>
		// 								<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa">
		// 									{item.stock} in stock
		// 								</Text>
		// 							</View>
		// 						)}
		// 				</View>
		// 			</View>
		// 		</View>
		// 	</TouchableOpacity>
		// );
		return (
			<ProductCard
				key={item._id}
				image={item.images?.[0]?.url ?? ''}
				title={item.name}
				description={item.shortDescription ?? item.description}
				price={item.price}
				rating={item.reviewStats?.averageRating ?? 0}
				reviewCount={item.reviewStats?.totalReviews ?? 0}
				compareAtPrice={item.compareAtPrice}
				discount={
					item.compareAtPrice
						? Math.round(
								((item.compareAtPrice - item.price) / item.compareAtPrice) * 100
						  )
						: 0
				}
				// isWishlisted={wishlistSet.has(item._id)}
				// inStock={typeof item.stock === 'number' ? item.stock > 0 : true}
				onPress={() =>
					router.push({
						pathname: '/(root)/home/product/[id]',
						params: { id: item._id, product: JSON.stringify(item) },
					})
				}
				// onAddToCart={() => handleAddToCart(item._id)}
				// onWishlistToggle={() => handleWishlistToggle(item._id)}
				// width={config. ?? 180}
				// height={(config.cardWidth ?? 180) * 1.3}
			/>
		);
	};

	const renderEmptyState = () => {
		if (loading) return null;

		if (!hasSearched) {
			return (
				<View className="flex-1 items-center justify-center px-6 py-12">
					<View className="bg-gray-100 dark:bg-gray-800 rounded-full size-24 items-center justify-center mb-4">
						<Image
							source={icons.search}
							className="size-12"
							tintColor={COLORS.gray[400]}
						/>
					</View>
					<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 text-center mb-2">
						Search for Products
					</Text>
					<Text className="text-sm text-gray-500 dark:text-gray-400 font-nexa text-center">
						Find plants, accessories, tools, and more
					</Text>
				</View>
			);
		}

		return (
			<View className="flex-1 items-center justify-center px-6 py-12">
				<View className="bg-gray-100 dark:bg-gray-800 rounded-full size-24 items-center justify-center mb-4">
					<Ionicons name="sad-outline" size={48} color={COLORS.gray[400]} />
				</View>
				<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 text-center mb-2">
					No Products Found
				</Text>
				<Text className="text-sm text-gray-500 dark:text-gray-400 font-nexa text-center">
					Try adjusting your search query or filters
				</Text>
			</View>
		);
	};

	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['top']}
		>
			{/* Header with Search Bar */}
			<View className="px-4 py-3">
				<View className="flex-row items-center gap-3">
					{/* Back Button */}
					<TouchableOpacity
						onPress={() => router.back()}
						className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 items-center justify-center"
						activeOpacity={0.7}
					>
						<Ionicons
							name="arrow-back"
							size={20}
							color={isDark ? 'white' : 'black'}
						/>
					</TouchableOpacity>

					{/* Search Input */}
					<View className="flex-1 flex-row items-center bg-white dark:bg-gray-900 rounded-xl px-4 h-12 border border-gray-100 dark:border-gray-800">
						<Image
							source={icons.search}
							className="size-6"
							tintColor={COLORS.gray[400]}
						/>
						<TextInput
							value={searchQuery}
							onChangeText={setSearchQuery}
							onSubmitEditing={() => handleSearch(searchQuery)}
							placeholder="Search products..."
							placeholderTextColor={COLORS.gray[400]}
							className="flex-1 ml-2 text-gray-900 dark:text-white font-nexa text-base"
							autoFocus
							returnKeyType="search"
						/>
						{searchQuery.length > 0 && (
							<TouchableOpacity
								onPress={() => {
									setSearchQuery('');
									setSearchResults([]);
									setHasSearched(false);
									setTotalCount(0);
								}}
								activeOpacity={0.7}
							>
								<Ionicons
									name="close-circle"
									size={20}
									color={COLORS.gray[400]}
								/>
							</TouchableOpacity>
						)}
					</View>

					{/* Filter Button */}
					<TouchableOpacity
						onPress={() => setShowFilters(!showFilters)}
						className={`w-12 h-12 rounded-full items-center justify-center ${
							showFilters ? 'bg-primary' : 'bg-white dark:bg-gray-900'
						}`}
						activeOpacity={0.7}
					>
						<Ionicons
							name="options-outline"
							size={20}
							color={showFilters ? 'white' : isDark ? 'white' : 'black'}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Filters Panel */}
			{showFilters && (
				<View className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
					<Text className="text-sm font-nexa-bold text-gray-900 dark:text-white mb-3">
						Filters
					</Text>

					{/* Sort By */}
					<View className="mb-3">
						<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa mb-2">
							Sort By
						</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View className="flex-row gap-2">
								{[
									{ value: 'featured', label: 'Featured' },
									{ value: 'newest', label: 'Newest' },
									{ value: 'price_asc', label: 'Price: Low to High' },
									{ value: 'price_desc', label: 'Price: High to Low' },
								].map((sort) => (
									<TouchableOpacity
										key={sort.value}
										onPress={() =>
											setFilters({ ...filters, sortBy: sort.value as any })
										}
										className={`px-4 py-2 rounded-full ${
											filters.sortBy === sort.value
												? 'bg-primary'
												: 'bg-gray-100 dark:bg-gray-800'
										}`}
										activeOpacity={0.7}
									>
										<Text
											className={`text-xs font-nexa-bold ${
												filters.sortBy === sort.value
													? 'text-white'
													: 'text-gray-600 dark:text-gray-400'
											}`}
										>
											{sort.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</ScrollView>
					</View>

					{/* Clear Filters */}
					{(filters.sortBy || filters.category || filters.type) && (
						<TouchableOpacity
							onPress={() => {
								setFilters({});
								if (searchQuery) {
									handleSearch(searchQuery);
								}
							}}
							className="self-end"
							activeOpacity={0.7}
						>
							<Text className="text-sm font-nexa-bold text-primary">
								Clear Filters
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}

			{/* Content */}
			<FlatList
				data={searchResults}
				keyExtractor={(item) => item._id!}
				numColumns={2}
				columnWrapperStyle={{
					paddingHorizontal: 16,
					marginTop: 12,
					gap: 12,
				}}
				renderItem={renderProductItem}
				contentContainerStyle={{
					paddingTop: 16,
					paddingBottom: 20,
					flexGrow: 1,
				}}
				// contentContainerStyle={{
				// 	paddingBottom: 8,
				// }}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					!loading && searchQuery.length === 0 ? (
						<View>
							{/* Popular Categories */}
							<View className="px-4 mb-6">
								<Text className="text-base font-nexa-bold text-gray-900 dark:text-white mb-3">
									Popular Categories
								</Text>
								<View className="flex-row flex-wrap gap-2">
									{popularCategories.map((category) => (
										<TouchableOpacity
											key={category.id}
											onPress={() =>
												handleCategoryPress({
													label: category.label,
													categoryId: category.id,
												})
											}
											className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3"
											activeOpacity={0.7}
										>
											<Text className="text-sm font-nexa-bold text-gray-900 dark:text-white">
												{category.label}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>

							{/* Recent Searches */}
							{recentSearches.length > 0 && (
								<View className="px-4">
									<View className="flex-row items-center justify-between mb-3">
										<Text className="text-base font-nexa-bold text-gray-900 dark:text-white">
											Recent Searches
										</Text>
										<TouchableOpacity
											onPress={clearSearchHistory}
											activeOpacity={0.7}
										>
											<Text className="text-sm font-nexa-extrabold text-primary">
												Clear
											</Text>
										</TouchableOpacity>
									</View>

									{recentSearches.map((query, index) => (
										<TouchableOpacity
											key={index}
											onPress={() => handleHistoryPress(query)}
											className="flex-row items-center py-3"
											activeOpacity={0.7}
										>
											<Ionicons
												name="time-outline"
												size={18}
												color={COLORS.gray[400]}
											/>
											<Text className="flex-1 ml-2 text-sm font-nexa text-gray-900 dark:text-white">
												{query}
											</Text>
											<Ionicons
												name="arrow-forward-outline"
												size={18}
												color={COLORS.gray[400]}
											/>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>
					) : (
						renderEmptyState()
					)
				}
				ListHeaderComponent={
					loading ? (
						<View className="py-12">
							<ActivityIndicator
								size="large"
								color={COLORS.light.pallete[500]}
							/>
							<Text className="text-center text-sm text-gray-500 dark:text-gray-400 font-nexa mt-4">
								Searching products...
							</Text>
						</View>
					) : null
				}
			/>

			{/* Results Count */}
			{hasSearched && !loading && searchResults.length > 0 && (
				<View className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
					<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa text-center">
						Found {totalCount} result{totalCount !== 1 ? 's' : ''}
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

export default SearchScreen;
