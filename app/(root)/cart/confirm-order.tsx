import AddressPickerModal from '@/components/AddressPickerModal';
import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import ShippingMethodSelector from '@/components/ShippingMethodSelector';
import { COLORS } from '@/constants/colors';
import { FREE_SHIPPING_THRESHOLD, shippingOptions } from '@/constants/constant';
import { icons } from '@/constants/icons';
import { Address } from '@/interfaces/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCartSubtotal } from '@/redux/selectors/cartSelectors';
import { clearCart, fetchCart } from '@/redux/slices/cartSlice';
import { RootState } from '@/redux/store';
import { createOrder } from '@/services/order.services';
import promoServices from '@/services/promo.services';
import { CreateOrderPayload } from '@/types/order.types';
import { formatCurrency } from '@/utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Easing,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';

//global variable
const FOOTER_HEIGHT = 315;

const ConfirmOrder = () => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const [promoCode, setPromoCode] = useState<string>('');
	const [promoError, setPromoError] = useState<string>('');
	const [isApplyingPromo, setIsApplyingPromo] = useState(false);
	const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

	const [selectedShipping, setSelectedShipping] = useState<string>('standard');
	const [selectedPayment, setSelectedPayment] = useState<string>('cod');
	const [showAddressModal, setShowAddressModal] = useState(false);

	const dispatch = useAppDispatch();
	const cartItems = useAppSelector(
		(state: RootState) => state.cart.items || []
	);
	const cartLoading = useAppSelector(
		(state: RootState) => state.cart.isLoading
	);
	// get addresses stored on the logged-in user
	const addresses = useAppSelector(
		(s: RootState) => s.auth.user?.customerProfile?.addresses ?? []
	);

	const [isProcessing, setIsProcessing] = useState(false);
	const [discountAmount, setDiscountAmount] = useState<number>(0); // absolute discount

	const [expanded, setExpanded] = useState(false);
	const animatedHeight = useRef(new Animated.Value(0)).current; // 1 = expanded, 0 = collapsed
	const scrollViewRef = useRef<ScrollView>(null);

	// hold selected cart address id (empty until API returns)
	const [selectedId, setSelectedId] = useState<string>('');

	// real delivery address returned from server
	const [deliveryAddr, setDeliveryAddr] = useState<Address | null>(null);
	const [addrLoading, setAddrLoading] = useState<boolean>(true);

	// subtotal
	const subtotal = useAppSelector(selectCartSubtotal);

	// shipping
	const shippingOption = useMemo(
		() => shippingOptions.find((opt) => opt.id === selectedShipping) ?? null,
		[selectedShipping]
	);

	const shippingFee = useMemo(() => {
		if (!shippingOption) return 0;
		// if subtotal qualifies for free shipping
		if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
		if (typeof (shippingOption as any).price === 'number')
			return (shippingOption as any).price;
		const label = (shippingOption as any).priceLabel ?? '';
		const digits = label.replace(/[^\d.-]/g, '');
		return Number(digits) || 0;
	}, [shippingOption, subtotal]);

	useMemo(() => {
		if (cartItems.length === 0 && appliedPromo) {
			setAppliedPromo(null);
			setDiscountAmount(0);
		}
	}, [cartItems.length, appliedPromo]);

	// discountAmount state updated by applyPromoCode; default 0
	// payable
	const payableAmount = useMemo(
		() => Math.max(0, subtotal + shippingFee - discountAmount),
		[subtotal, shippingFee, discountAmount]
	);

	useFocusEffect(
		React.useCallback(() => {
			let mounted = true;
			const init = async () => {
				setAddrLoading(true);
				try {
					const addrList = addresses || [];
					let defaultAddr = undefined;
					if (addrList.length > 0) {
						defaultAddr =
							addrList.find((a) => (a as any).isDefault === true) ??
							addrList.find((a) => (a as any).default === true) ??
							addrList.find((a) => (a as any).is_default === true) ??
							addrList[0];
					}
					if (!mounted) return;
					if (defaultAddr) {
						setDeliveryAddr(defaultAddr);
						setSelectedId(
							String(defaultAddr._id ?? (defaultAddr as any).id ?? '')
						);
					} else {
						setDeliveryAddr(null);
						setSelectedId('');
					}
				} catch (err) {
					console.warn('Failed to set default address from auth slice', err);
					if (mounted) {
						setDeliveryAddr(null);
						setSelectedId('');
					}
				} finally {
					if (mounted) setAddrLoading(false);
				}

				// optional: still fetch cart here
				try {
					await dispatch(fetchCart());
				} catch (_) {}
			};

			init();
			return () => {
				mounted = false;
			};
		}, [dispatch, addresses])
	);

	useEffect(() => {
		// if addresses are already present, we don't need loading
		if (Array.isArray(addresses)) setAddrLoading(false);
	}, [addresses]);

	const toggleOrderSummary = () => {
		const toValue = expanded ? 0 : 1;
		const newState = !expanded;
		setExpanded(!expanded);

		Animated.timing(animatedHeight, {
			toValue,
			duration: 300,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: false,
		}).start(() => {
			// after expansion, scroll down a bit
			if (newState) {
				scrollViewRef.current?.scrollTo({
					y: FOOTER_HEIGHT + 115,
					animated: true,
				});
			}
		});
	};

	// Interpolate height between collapsed & expanded
	const containerHeight = animatedHeight.interpolate({
		inputRange: [0, 1],
		outputRange: [0, FOOTER_HEIGHT - 160],
	});

	const rotateIcon = animatedHeight.interpolate({
		inputRange: [0, 1],
		outputRange: ['180deg', '0deg'],
	});

	const applyPromoCode = async () => {
		if (!promoCode.trim()) {
			setPromoError('Please enter a promo code');
			return;
		}
		if (cartItems.length === 0) {
			setPromoError('Your cart is empty');
			return;
		}
		setIsApplyingPromo(true);

		try {
			const resp = await promoServices.validatePromo(promoCode);
			if (resp.valid) {
				let discount = 0;
				if (resp.type === 'percent' && resp.value) {
					discount = +(subtotal * (resp.value / 100)).toFixed(2);
					setDiscountAmount(discount);
				} else if (resp.type === 'flat' && resp.value) {
					discount = Number(resp.value);
					setDiscountAmount(discount);
				} else {
					setDiscountAmount(0);
				}

				setAppliedPromo(resp.code ?? promoCode.trim().toUpperCase());
				setPromoError('');
				Toast.show({
					type: 'success',
					text1: 'Promo applied',
					text2: resp.message ?? `You saved Rs. ${formatCurrency(discount)}`,
				});
			} else {
				setAppliedPromo(null);
				setDiscountAmount(0);
				setPromoError(resp.message ?? 'Invalid promo code');
			}
		} catch (err) {
			setPromoError('Failed to validate promo');
		} finally {
			setIsApplyingPromo(false);
		}
	};

	// ... later in the component replace submitOrder with this:
	const submitOrder = async () => {
		if (!deliveryAddr) {
			Toast.show({
				type: 'error',
				text1: 'Select address',
				text2: 'Please select a delivery address',
			});
			return;
		}
		if (cartItems.length === 0) {
			Toast.show({
				type: 'error',
				text1: 'Cart empty',
				text2: 'Add items to cart before submitting',
			});
			return;
		}

		setIsProcessing(true);
		try {
			// defensive mapping of address shape to IAddress
			const mapAddress = (a: any) => ({
				fullName: a.name ?? a.fullName ?? a.recipientName ?? '',
				phone: a.phone ?? a.phoneNumber ?? a.contact ?? '',
				street:
					a.street ??
					a.addressLine1 ??
					a.address ??
					a.fullAddress ??
					a.address_1 ??
					'',
				city: a.city ?? a.town ?? '',
				state: a.state ?? a.province ?? '',
				postalCode: a.postalCode ?? a.zip ?? a.postal ?? '',
				country: a.country ?? 'Pakistan',
				...a, // keep any extra fields if backend can accept them
			});

			const addressPayload = mapAddress(deliveryAddr);

			// build items payload (server expects productId + quantity)
			const itemsPayload = cartItems.map((it) => ({
				productId: it.productId || it.id,
				quantity: Number(it.quantity ?? 1),
			}));

			// pricing object
			const pricing = {
				subtotal: Number(subtotal || 0),
				shipping: Number(shippingFee || 0),
				tax: 0, // replace with real tax calculation if needed
				discount: Number(discountAmount || 0),
				total: Number(payableAmount || 0),
				currency: 'PKR',
			};

			// shipping object
			const shipping = {
				address: addressPayload,
				method: selectedShipping,
				cost: Number(shippingFee || 0),
				// estimatedDelivery: optional - leave undefined unless you calculate it
			};

			// billing object - reuse same address for billing for now
			const billing = {
				address: addressPayload,
				paymentMethod: {
					type: selectedPayment as any, // e.g. 'cod' | 'credit_card' ...
					// if you have card info, include last4/brand/gateway here
				},
			};

			// discounts array (if promo applied)
			const discounts = appliedPromo
				? [
						{
							code: appliedPromo,
							type:
								discountAmount > 0 &&
								pricing.subtotal > 0 &&
								pricing.discount === 0
									? 'fixed'
									: discountAmount > 0 && pricing.subtotal > 0
									? 'percentage'
									: 'fixed',
							amount: Number(discountAmount || 0),
							description: `Applied promo ${appliedPromo}`,
						},
				  ]
				: [];

			const payload: CreateOrderPayload = {
				items: itemsPayload,
				pricing,
				shipping,
				billing,
				discounts,
				notes: undefined,
				customerNotes: undefined,
			};

			// call service
			await createOrder(payload);

			// clear cart and navigate
			await dispatch(clearCart());
			router.replace('/cart/success');
		} catch (err: any) {
			console.error('Order submission failed', err);
			Toast.show({
				type: 'error',
				text1: 'Order failed',
				text2:
					err?.response?.data?.message ||
					err?.message ||
					'Could not submit order',
			});
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950">
			{/* OrderSteps */}
			{/* <View className="flex-row items-center justify-center gap-x-3 py-4 border-b border-t border-gray-200 dark:border-gray-700 -mx-3">
				<OrderStep number={1} label="Select Address" />
				<Ionicons
					name="chevron-forward-outline"
					color={COLORS.gray[400]}
					size={16}
				/>
				<OrderStep number={2} label="Confirm Order" isActive />
			</View> */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				ref={scrollViewRef}
				contentContainerStyle={{
					paddingTop: 10,
					paddingBottom: expanded ? FOOTER_HEIGHT + 10 : 165,
					rowGap: 8,
				}}
			>
				{/* Delivery Address */}
				<View className="gap-y-3 bg-light-surface dark:bg-gray-800 px-4 py-3">
					<View className="flex-row justify-between items-center">
						<Text className="text-body-sm font-nexa-extrabold text-gray-900 dark:text-gray-100">
							Shipping Address
						</Text>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => setShowAddressModal(true)}
						>
							<Text className="text-body-sm font-nexa-extrabold text-light-pallete-500 dark:text-light-pallete-400">
								Change
							</Text>
						</TouchableOpacity>
					</View>
					<View className="flex-row items-center justify-between">
						{/* Location Icon */}
						{/* <Image
							source={icons.locationOutline}
							className="w-5 h-5"
							tintColor={
								isDark ? COLORS.light.pallete[400] : COLORS.light.pallete[500]
							}
						/> */}

						{/* Address Info */}
						<View className="flex-1">
							{addrLoading ? (
								<View className="py-3">
									<Text className="text-body-sm text-gray-500 dark:text-gray-400">
										Loading address...
									</Text>
								</View>
							) : deliveryAddr ? (
								<>
									<View className="flex-row gap-x-2 items-center">
										<Text className="text-body font-nexa-bold text-gray-900 dark:text-gray-50">
											{deliveryAddr?.name ?? 'No name'}
										</Text>
										{deliveryAddr?.phone ? (
											<Text className="text-body-sm font-nexa text-gray-500 dark:text-gray-400">
												{deliveryAddr.phone}
											</Text>
										) : null}
									</View>
									<Text className="text-body-xs text-gray-500 leading-5 dark:text-gray-400 mt-1">
										{deliveryAddr?.fullAddress ??
											'Please select a delivery address'}
									</Text>
								</>
							) : (
								<View className="py-2">
									<Text className="text-body-sm text-gray-500 dark:text-gray-400">
										No default address set. Please add or select one.
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>

				{/* Order Details */}
				<View className="gap-y-3 bg-light-surface dark:bg-gray-800 px-4 py-3">
					<View className="flex-row justify-between items-center">
						<Text className="text-body-sm font-nexa-extrabold text-gray-900 dark:text-gray-100">
							Order Details
						</Text>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => router.push('/cart')}
						>
							<Text className="text-body-sm font-nexa-extrabold text-light-pallete-500 dark:text-light-pallete-400">
								Edit
							</Text>
						</TouchableOpacity>
					</View>

					<View className="gap-y-2 justify-center bg-light-surface dark:bg-gray-800">
						{cartItems.length === 0 ? (
							<Text className="text-body-sm text-gray-500 dark:text-gray-400">
								Your cart is empty
							</Text>
						) : (
							cartItems.map((item) => (
								<View
									key={item.id}
									className="flex-row justify-between items-center pb-2"
								>
									<Text className="text-body-sm text-gray-950 dark:text-gray-50 font-nexa">
										{item.quantity}x {item.name ?? item.name ?? 'Item'}
									</Text>
									<Text className="text-body-sm text-gray-950 dark:text-gray-50 font-nexa">
										Rs. {Number(item.price ?? 0) * Number(item.quantity ?? 1)}
									</Text>
								</View>
							))
						)}
					</View>
				</View>

				{/* Shipping Method */}
				<View className="gap-y-3 bg-light-surface dark:bg-gray-800 px-4 py-3">
					{subtotal >= FREE_SHIPPING_THRESHOLD ? (
						<Text className="text-body-xs text-green-600 dark:text-green-400 mt-1">
							Congrats — you qualify for free shipping!
						</Text>
					) : (
						<Text className="text-body-xs text-gray-500 dark:text-gray-400 mt-1">
							Add Rs. {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more
							for free shipping.
						</Text>
					)}

					<View className="flex-row justify-between items-center">
						<Text className="text-body-sm font-nexa-extrabold ml-1 text-gray-900 dark:text-gray-100">
							Shipping Method
						</Text>
					</View>
					<View className="gap-y-3">
						<ShippingMethodSelector
							selected={selectedShipping}
							onSelect={setSelectedShipping}
						/>
					</View>
				</View>

				{/* Payment Method */}
				<View className="gap-y-3 bg-light-surface dark:bg-gray-800 px-4 py-3">
					<View className="flex-row justify-between items-center">
						<Text className="text-body-sm font-nexa-extrabold text-gray-900 dark:text-gray-100">
							Payment Method
						</Text>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={() => router.push('/cart/payment')}
						>
							<Text className="text-body-sm font-nexa-extrabold text-light-pallete-500 dark:text-light-pallete-400">
								Change
							</Text>
						</TouchableOpacity>
					</View>
					<View className="gap-y-2">
						<View className="gap-y-2">
							<PaymentMethodSelector
								selected={selectedPayment}
								onSelect={setSelectedPayment}
							/>
						</View>
					</View>
				</View>

				{/* Promo Code */}
				<View className="bg-light-surface rounded-b-3xl dark:bg-gray-800 px-4 py-3">
					<Text className="text-body-sm font-nexa-bold ml-1 text-gray-900 dark:text-gray-100 mb-3">
						Have a coupon?
					</Text>

					<View className="flex-row mb-2 items-start gap-x-2">
						<CustomInputField
							placeholder="Enter promo code"
							bgColor={isDark ? undefined : COLORS.gray[100]}
							value={promoCode}
							onChangeText={(val) => {
								setPromoCode(val);
								setPromoError('');
							}}
							leftIcon={icons.promoCode}
							autoCapitalize="none"
							containerStyle={{ flex: 1, marginBottom: 0 }}
							error={promoError}
							size="small"
							roundedFull
						/>
						<CustomButton
							label="Apply"
							onPress={applyPromoCode}
							loading={isApplyingPromo}
							disabled={isApplyingPromo || cartItems.length === 0}
							bgVariant="primary"
							textVariant="secondary"
							className="w-[90px] h-[42px] rounded-full align-middle"
						/>
					</View>

					{appliedPromo && (
						<Text className="text-body-sm text-green-600 dark:text-green-400">
							✓ Promo &quot;{appliedPromo}&quot; applied
						</Text>
					)}
				</View>
			</ScrollView>

			{/* Footer */}
			<View className="px-4 py-4 h-auto bg-light-surface rounded-t-3xl dark:bg-gray-800 absolute bottom-0 left-0 w-full">
				{/* order summary */}
				<View className="px-1 bg-light-surface dark:bg-gray-800 mb-2 overflow-hidden">
					<View
						className="flex-row justify-between items-center"
						style={{ marginBottom: expanded ? 8 : 4 }}
					>
						<Text className="text-body-sm font-nexa-extrabold text-gray-900 dark:text-gray-100">
							Order Summary
						</Text>
						<TouchableOpacity
							activeOpacity={0.7}
							className="w-[30px] h-[30px] rounded-full items-center justify-center bg-light-pallete-100 dark:bg-light-pallete-900/40"
							onPress={toggleOrderSummary}
						>
							<Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
								<Ionicons
									name="chevron-down-outline"
									size={20}
									color={
										isDark
											? COLORS.light.pallete[400]
											: COLORS.light.pallete[700]
									}
								/>
							</Animated.View>
						</TouchableOpacity>
					</View>

					{/* Collapsible content */}
					<Animated.View
						style={{ height: containerHeight, overflow: 'hidden' }}
					>
						<View className="py-3 flex-row justify-between">
							<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
								Subtotal
							</Text>
							<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
								Rs. {formatCurrency(subtotal)}
							</Text>
						</View>
						<View className="py-3 flex-row justify-between">
							<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
								Shipping Fee
							</Text>
							<Text className="font-nexa-bold text-body-xs text-gray-950 dark:text-white">
								Rs. {formatCurrency(shippingFee)}
							</Text>
						</View>
						<View className="py-3 flex-row justify-between">
							<Text className="font-nexa text-body-xs text-gray-950 dark:text-white">
								Discount
							</Text>
							<Text className="font-nexa-bold text-body-xs text-red-500 dark:text-red-400">
								Rs. {formatCurrency(discountAmount)}
							</Text>
						</View>
						<View className="pb-3 flex-row justify-between border-t border-dashed border-gray-200 dark:border-gray-700 mt-2 pt-4">
							<Text className="font-nexa text-body-sm text-gray-950 dark:text-white">
								Payable Amount
							</Text>
							<Text className="font-nexa-extrabold text-body-sm text-gray-950 dark:text-white">
								Rs. {formatCurrency(payableAmount)}
							</Text>
						</View>
					</Animated.View>
				</View>

				{/* Submit Button */}
				<View className="mt-1">
					<View className="flex-row items-center justify-center gap-x-1 mb-3">
						<Text
							accessibilityRole="text"
							className="text-[12px] text-center font-nexa text-gray-500 dark:text-gray-200"
						>
							By continuing, you agree to our
						</Text>

						<Pressable
							onPress={() =>
								router.push('/account/legal-information/privacy-policy')
							}
							accessibilityRole="link"
							accessibilityLabel="Open Privacy Policy"
						>
							<Text className="text-[12px] font-nexa-extrabold text-light-pallete-600 dark:text-light-pallete-400">
								Privacy Policy
							</Text>
						</Pressable>
						<Text className="text-[12px]  text-center font-nexa text-gray-500 dark:text-gray-200">
							&
						</Text>
						<Pressable
							onPress={() =>
								router.push('/account/legal-information/terms-of-service')
							}
							accessibilityRole="link"
							accessibilityLabel="Open Terms of Service"
						>
							<Text className="text-[12px] font-nexa-extrabold text-light-pallete-600 dark:text-light-pallete-400">
								Terms
							</Text>
						</Pressable>
					</View>

					<View className="mt-1">
						{/* privacy text omitted for brevity; keep existing */}
						<View className="flex-row justify-center items-center">
							{cartLoading || addrLoading ? (
								<View className="py-4 w-full items-center">
									<ActivityIndicator size="small" />
									<Text className="text-body-xs text-gray-500 dark:text-gray-400 mt-2">
										Loading order details...
									</Text>
								</View>
							) : (
								<View className="flex-1">
									<CustomButton
										label={`Submit Order (Rs. ${formatCurrency(
											payableAmount
										)})`}
										onPress={submitOrder}
										loading={isProcessing}
										disabled={
											isProcessing || cartItems.length === 0 || addrLoading
										}
										className="py-4"
									/>
								</View>
							)}
						</View>
					</View>
				</View>
			</View>

			<AddressPickerModal
				visible={showAddressModal}
				onClose={() => setShowAddressModal(false)}
				// initialSelectedId should come from deliveryAddr (if available) or fallback to selectedId
				initialSelectedId={
					deliveryAddr?._id ?? deliveryAddr?._id ?? (selectedId || null)
				}
				addresses={addresses}
				onSelect={(addr) => {
					// addr is the full address object returned by the modal
					setDeliveryAddr(addr as Address); // reflect selected address in UI
					setSelectedId(String(addr._id ?? addr.id ?? '')); // keep id in sync
					setShowAddressModal(false); // close modal
				}}
			/>
		</View>
	);
};

export default ConfirmOrder;
