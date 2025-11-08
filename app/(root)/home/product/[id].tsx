import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import { ExpandableSection } from '@/components/ExpandableSection';
import ImageSwiper from '@/components/ImageSwiper';
import { ProductInfoSection } from '@/components/ProductInfoSection';
import { QuantitySelector } from '@/components/QuantitySelector';
import { RecentlyViewedProducts } from '@/components/RecentlyViewedProducts';
import ReviewsSection from '@/components/ReviewsSection';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cartSlice';
import {
	addRecentlyViewedProduct,
	toggleWishlist,
} from '@/services/user.product.services';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useReducer } from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	View,
	useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface ProductDetailsState {
	isScrolled: boolean;
	isWishlisted: boolean;
	quantity: number;
	expandedSections: {
		description: boolean;
		care: boolean;
		shipping: boolean;
	};
}

const initialState: ProductDetailsState = {
	isScrolled: false,
	isWishlisted: false,
	quantity: 1,
	expandedSections: {
		description: true,
		care: false,
		shipping: false,
	},
};

type ProductDetailsAction =
	| { type: 'INCREASE_QUANTITY' }
	| { type: 'DECREASE_QUANTITY' }
	| {
			type: 'TOGGLE_SECTION';
			section: keyof ProductDetailsState['expandedSections'];
	  }
	| { type: 'SET_SCROLLED'; payload: boolean }
	| { type: 'TOGGLE_WISHLIST' };

function reducer(
	state: ProductDetailsState,
	action: ProductDetailsAction
): ProductDetailsState {
	switch (action.type) {
		case 'INCREASE_QUANTITY':
			return { ...state, quantity: state.quantity + 1 };

		case 'DECREASE_QUANTITY':
			return { ...state, quantity: Math.max(1, state.quantity - 1) };

		case 'TOGGLE_SECTION':
			return {
				...state,
				expandedSections: {
					...state.expandedSections,
					[action.section]: !state.expandedSections[action.section],
				},
			};

		case 'SET_SCROLLED':
			return { ...state, isScrolled: action.payload };

		case 'TOGGLE_WISHLIST':
			return { ...state, isWishlisted: !state.isWishlisted };

		default:
			return state;
	}
}

const PlantDetailsScreen: React.FC = () => {
	const router = useRouter();
	const { product } = useLocalSearchParams();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	// Redux dispatch for cart actions
	const reduxDispatch = useAppDispatch();

	// Parse product data
	const parsedProduct = useMemo(
		() => (product ? JSON.parse(product as string) : null),
		[product]
	);

	// Local state with useReducer
	const [state, localDispatch] = useReducer(reducer, {
		...initialState,
		isWishlisted: parsedProduct?.isWishlisted ?? false,
	});

	// Add to recently viewed
	React.useEffect(() => {
		if (parsedProduct?._id) {
			addRecentlyViewedProduct(parsedProduct._id).catch(console.error);
		}
	}, [parsedProduct?._id]);

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const scrollY = event.nativeEvent.contentOffset.y;
			localDispatch({ type: 'SET_SCROLLED', payload: scrollY >= 50 });
		},
		[]
	);

	const handleWishlistToggle = useCallback(async () => {
		try {
			await toggleWishlist(parsedProduct._id, state.isWishlisted);
			localDispatch({ type: 'TOGGLE_WISHLIST' });
			Toast.show({
				type: 'success',
				text1: state.isWishlisted
					? 'Removed from wishlist'
					: 'Added to wishlist',
			});
		} catch (err) {
			console.error('Failed to toggle wishlist:', err);
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Failed to update wishlist',
			});
		}
	}, [parsedProduct._id, state.isWishlisted]);

	const handleAddToCart = useCallback(async () => {
		try {
			// Check if product has stock
			if (
				parsedProduct.stock !== undefined &&
				parsedProduct.stock < state.quantity
			) {
				Toast.show({
					type: 'error',
					text1: 'Out of Stock',
					text2: `Only ${parsedProduct.stock} items available`,
				});
				return;
			}

			// Dispatch addToCart thunk
			// console.log('Adding to cart:', {
			// 	productId: parsedProduct._id,
			// 	quantity: state.quantity,
			// });

			await reduxDispatch(
				addToCart({
					productId: parsedProduct._id,
					quantity: state.quantity,
				})
			).unwrap();

			Toast.show({
				type: 'success',
				text1: 'Added to Cart',
				text2: `${state.quantity}x ${parsedProduct.name}`,
			});

			// Optional: Navigate to cart
			// router.push('/(root)/cart');
		} catch (err: any) {
			const message =
				err?.message ||
				err?.data?.message ||
				'Failed to add item to cart. Please try again.';

			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: message,
			});

			console.error('Add to cart error:', err);
		}
	}, [reduxDispatch, parsedProduct, state.quantity]);

	const handleBuyNow = useCallback(async () => {
		try {
			// Add to cart first
			await reduxDispatch(
				addToCart({
					productId: parsedProduct._id,
					quantity: state.quantity,
				})
			).unwrap();

			// Navigate to cart/checkout
			router.push('/(root)/cart');
		} catch (err: any) {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Failed to proceed to checkout',
			});
		}
	}, [reduxDispatch, parsedProduct._id, state.quantity, router]);

	if (!parsedProduct) {
		return (
			<View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
				<Text className="text-gray-600 dark:text-gray-400">
					Product not found
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			<View
				className="absolute top-0 left-0 right-0 z-10"
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 6,
					elevation: 5,
				}}
			>
				<CustomHeader
					title="Details"
					iconLeft={
						<Ionicons
							name="chevron-back-outline"
							size={24}
							color={isDark ? 'white' : 'black'}
						/>
					}
					iconRight={
						<Ionicons
							name={state.isWishlisted ? 'heart' : 'heart-outline'}
							size={24}
							color={
								state.isWishlisted
									? COLORS.light.error.text
									: isDark
									? 'white'
									: 'black'
							}
						/>
					}
					onIconLeftPress={() => router.back()}
					onIconRightPress={handleWishlistToggle}
					style={{
						backgroundColor: state.isScrolled
							? isDark
								? '#030712'
								: COLORS.light.screen
							: 'transparent',
						paddingBottom: 10,
					}}
				/>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				<ImageSwiper
					images={parsedProduct.images?.map((img: any) => img.url) || []}
				/>
				<ProductInfoSection product={parsedProduct} />

				<View className="px-4">
					<QuantitySelector
						quantity={state.quantity}
						onIncrease={() => localDispatch({ type: 'INCREASE_QUANTITY' })}
						onDecrease={() => localDispatch({ type: 'DECREASE_QUANTITY' })}
					/>
				</View>

				{/* Stock indicator */}
				{parsedProduct.stock !== undefined && (
					<View className="px-4 mb-2">
						<Text
							className={`text-sm font-nexa ${
								parsedProduct.stock > 0
									? 'text-green-600 dark:text-green-400'
									: 'text-red-600 dark:text-red-400'
							}`}
						>
							{parsedProduct.stock > 0
								? `${parsedProduct.stock} items in stock`
								: 'Out of stock'}
						</Text>
					</View>
				)}

				<View className="px-4">
					<CustomButton
						label="Add to Cart"
						onPress={handleAddToCart}
						bgVariant="outline"
						icon={icons.cartOutline}
						disabled={parsedProduct.stock === 0}
					/>

					<CustomButton
						label="Buy it now"
						onPress={handleBuyNow}
						disabled={parsedProduct.stock === 0}
					/>
				</View>

				<View className="px-4 mb-6">
					<ExpandableSection
						title="Description"
						expanded={state.expandedSections.description}
						onToggle={() =>
							localDispatch({ type: 'TOGGLE_SECTION', section: 'description' })
						}
					>
						<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6">
							{parsedProduct.description ||
								'High-quality plant perfect for indoor decoration.'}
						</Text>
					</ExpandableSection>

					<ExpandableSection
						title="Care Instructions"
						expanded={state.expandedSections.care}
						onToggle={() =>
							localDispatch({ type: 'TOGGLE_SECTION', section: 'care' })
						}
					>
						<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6">
							• Water when soil is dry{'\n'}• Keep in bright, indirect light
							{'\n'}• Temperature: 15-25°C{'\n'}• Humidity: 40-60%
						</Text>
					</ExpandableSection>

					<ExpandableSection
						title="Shipping & Returns"
						expanded={state.expandedSections.shipping}
						onToggle={() =>
							localDispatch({ type: 'TOGGLE_SECTION', section: 'shipping' })
						}
					>
						<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa leading-6">
							Free shipping on orders over Rs. 500{'\n'}
							Returns accepted within 7 days{'\n'}
							Full refund for damaged items
						</Text>
					</ExpandableSection>
				</View>

				<ReviewsSection
					reviewStats={parsedProduct.reviewStats}
					reviews={parsedProduct.recentReviews}
				/>

				<RecentlyViewedProducts />
			</ScrollView>
		</SafeAreaView>
	);
};

export default PlantDetailsScreen;
