import CartItemCard from '@/components/CartItemCard';
import CustomButton from '@/components/CustomButton';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Address } from '@/interfaces/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
	fetchCart,
	removeFromCart,
	removeItemLocal,
	updateCartItem,
	updateQuantityLocal,
} from '@/redux/slices/cartSlice';
import { RootState } from '@/redux/store';
import { AddressService } from '@/services/address.services';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Alert,
	Image,
	RefreshControl,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

// CHANGED: import AddressService and useFocusEffect

interface CartSummary {
	subtotal: number;
	shippingFee: number;
	discount: number;
	total: number;
}

const FOOTER_HEIGHT = 200;
const SHIPPING_FEE = 150; // Fixed shipping fee
const FREE_SHIPPING_THRESHOLD = 5000; // Free shipping above this amount

const Cart: React.FC = () => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const dispatch = useAppDispatch();

	// Redux state
	const {
		items: cartItems,
		isLoading,
		error,
	} = useAppSelector((state: RootState) => state.cart);
	const { token } = useAppSelector((state: RootState) => state.auth);

	const [isProcessing, setIsProcessing] = useState(false);

	// CHANGED: pull-to-refresh state
	const [refreshing, setRefreshing] = useState(false);

	// CHANGED: local state for default address
	const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

	// CHANGED: refresh handler - dispatches fetchCart and shows toast on error
	const onRefresh = useCallback(async () => {
		if (!token) {
			// nothing to refresh if user not logged in
			return;
		}
		setRefreshing(true);
		try {
			// unwrap so errors from thunk are thrown
			await dispatch(fetchCart()).unwrap();
		} catch (err: any) {
			Toast.show({
				type: 'error',
				text1: 'Refresh Failed',
				text2: err?.message || err || 'Failed to refresh cart',
			});
		} finally {
			setRefreshing(false);
		}
	}, [dispatch, token]);

	// Fetch cart on mount
	useEffect(() => {
		if (token) {
			dispatch(fetchCart());
		}
	}, [dispatch, token]);
	// Show error toast if any
	useEffect(() => {
		if (error) {
			Toast.show({
				type: 'error',
				text1: 'Cart Error',
				text2: error,
			});
		}
	}, [error]);

	// Calculate cart summary
	const summary = useMemo((): CartSummary => {
		const subtotal = cartItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);
		const shippingFee =
			subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
		const discount = 0; // You can add discount logic here
		const total = subtotal + shippingFee - discount;

		return { subtotal, shippingFee, discount, total };
	}, [cartItems]);

	// Update quantity with optimistic update
	const updateQuantity = useCallback(
		async (id: string, change: number) => {
			const item = cartItems.find((item) => item.id === id);
			if (!item) return;

			const newQuantity = Math.max(1, item.quantity + change);

			// Check stock availability if available
			if (item.stock && newQuantity > item.stock) {
				Toast.show({
					type: 'error',
					text1: 'Stock Limit',
					text2: `Only ${item.stock} items available`,
				});
				return;
			}

			// Optimistic update
			dispatch(updateQuantityLocal({ id, quantity: newQuantity }));

			// API call
			try {
				await dispatch(
					updateCartItem({ productId: item.id, quantity: newQuantity })
				).unwrap();
			} catch (error: any) {
				// Revert on error
				dispatch(updateQuantityLocal({ id, quantity: item.quantity }));
				Toast.show({
					type: 'error',
					text1: 'Update Failed',
					text2: error || 'Failed to update quantity',
				});
			}
		},
		[cartItems, dispatch]
	);

	// Remove item with confirmation
	const removeItem = useCallback(
		(id: string) => {
			Alert.alert('Remove Item', 'Remove this item from your cart?', [
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: async () => {
						// Optimistic update
						dispatch(removeItemLocal(id));

						try {
							await dispatch(removeFromCart(id)).unwrap();
							Toast.show({
								type: 'success',
								text1: 'Item removed from cart',
							});
						} catch (error: any) {
							// Revert on error - refetch cart
							dispatch(fetchCart());
							Toast.show({
								type: 'error',
								text1: 'Remove Failed',
								text2: error || 'Failed to remove item',
							});
						}
					},
				},
			]);
		},
		[dispatch]
	);

	// Proceed to checkout
	const proceedNext = async () => {
		if (cartItems.length === 0) {
			Toast.show({ type: 'error', text1: 'Cart is empty' });
			return;
		}

		// require login? optional check:
		// if (!token) {
		// 	Toast.show({ type: 'error', text1: 'Please login to continue' });
		// 	// optionally navigate to login
		// 	router.push('/auth/login');
		// 	return;
		// }

		setIsProcessing(true);
		try {
			// await the async call and avoid shadowing the state var name
			const defaultAddr = await AddressService.getDefaultAddress();
			setShippingAddress(defaultAddr ?? null);

			if (!defaultAddr) {
				// no default address -> go to add address screen
				router.push('/cart/add-address');
			} else {
				// navigate to confirm-order screen
				router.push('/cart/confirm-order');
				// optionally pass the address id/query param:
				// router.push(`/cart/confirm-order?addressId=${defaultAddr.id}`);
			}
		} catch (err: any) {
			console.error('Failed to proceed to checkout:', err);
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: err?.message ?? 'Failed to proceed to checkout',
			});
		} finally {
			setIsProcessing(false);
		}
	};

	// Loading state
	if (isLoading && cartItems.length === 0) {
		return (
			<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
				<View className="flex-1 justify-center items-center">
					<LottieLoadingIndicator message="Loading Cart..." />
				</View>
			</SafeAreaView>
		);
	}

	// Empty cart state
	if (cartItems.length === 0) {
		return (
			<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
				<View className="flex-1 justify-center items-center px-5">
					<Image
						source={icons.basketOutline}
						className="w-[100px] h-[100px] mb-4"
						tintColor={
							isDark ? COLORS.light.pallete[400] : COLORS.light.pallete[500]
						}
					/>
					<Text className="text-xl font-nexa-extrabold text-gray-900 dark:text-gray-100 mt-4 mb-2">
						Nothing in your cart?
					</Text>
					<Text className="text-gray-600 text-body-sm dark:text-gray-400 text-center mb-6 leading-5">
						That&apos;s okay, take your time and browse{'\n'} through our
						products until you find what{'\n'} you&apos;re looking for.
					</Text>
					<CustomButton
						label="Continue Shopping"
						onPress={() => router.back()}
						bgVariant="primary"
						className="px-5 w-[180px] h-[50px] py-4"
					/>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			{/* Cart Items List */}
			<KeyboardAwareFlatList
				data={cartItems}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				keyExtractor={(item) => item.id}
				contentContainerStyle={{
					paddingBottom: FOOTER_HEIGHT,
					paddingHorizontal: 16,
				}}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={
							isDark ? COLORS.light.pallete[400] : COLORS.light.pallete[500]
						}
					/>
				}
				renderItem={({ item }) => (
					<CartItemCard
						item={item}
						onRemove={removeItem}
						onUpdateQuantity={updateQuantity}
					/>
				)}
				ListHeaderComponent={
					// CHANGED: show delivery address summary in header (if loaded)
					<View>
						<View className="py-2">
							<Text className="text-lg font-nexa-bold text-gray-900 dark:text-white">
								Shopping Cart ({cartItems.length}{' '}
								{cartItems.length === 1 ? 'item' : 'items'})
							</Text>
						</View>
					</View>
				}
			/>

			{/* Footer - Summary & Checkout */}
			<View
				className="px-4 pb-5 mt-4 bg-light-surface dark:bg-gray-800 rounded-t-3xl absolute bottom-0 left-0 w-full"
				style={{ height: FOOTER_HEIGHT }}
			>
				<View className="px-2 bg-light-surface dark:bg-gray-800">
					{/* Payment Summary */}
					<View className="px-1 bg-light-surface dark:bg-gray-800 mt-2">
						<View className="py-3 flex-row justify-between">
							<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
								Subtotal
							</Text>
							<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
								Rs. {summary.subtotal.toFixed(2)}
							</Text>
						</View>
						<View className="py-3 flex-row justify-between">
							<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
								Shipping Fee
								{summary.shippingFee === 0 && summary.subtotal > 0 && (
									<Text className="text-green-500"> (Free)</Text>
								)}
							</Text>
							<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
								Rs. {summary.shippingFee.toFixed(2)}
							</Text>
						</View>
						{summary.discount > 0 && (
							<View className="py-3 flex-row justify-between">
								<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
									Discount
								</Text>
								<Text className="font-nexa-bold text-body-xs text-red-500 dark:text-red-400">
									- Rs. {summary.discount.toFixed(2)}
								</Text>
							</View>
						)}
						<View className="pb-3 flex-row justify-between border-t border-dashed border-gray-200 dark:border-gray-700 mt-2 pt-4">
							<Text className="font-nexa text-body-sm text-gray-950 dark:text-white">
								Total Amount
							</Text>
							<Text className="font-nexa-extrabold text-body-sm text-gray-950 dark:text-white">
								Rs. {summary.total.toFixed(2)}
							</Text>
						</View>
					</View>
				</View>
				<View className="pt-2">
					<CustomButton
						label="Proceed to Checkout"
						onPress={proceedNext}
						loading={isProcessing}
						disabled={isProcessing || cartItems.length === 0}
						bgVariant="primary"
						textVariant="secondary"
						className="py-4"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Cart;
