// hooks/useCart.ts
import { CartItem } from '@/interfaces/cart.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
	selectCartItems,
	selectCartItemsCount,
	selectCartTotal,
	selectIsCartEmpty,
} from '@/redux/selectors/cartSelectors';
import { addItemLocal, addToCart } from '@/redux/slices/cartSlice';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export const useCart = () => {
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(selectCartItems);
	const itemsCount = useAppSelector(selectCartItemsCount);
	const total = useAppSelector(selectCartTotal);
	const isEmpty = useAppSelector(selectIsCartEmpty);
	const { isLoading, error } = useAppSelector((state) => state.cart);

	// Add item to cart
	const addItem = useCallback(
		async (product: {
			id: string;
			name: string;
			description: string;
			price: number;
			image: string;
			quantity?: number;
		}) => {
			try {
				// Optimistic update for better UX
				const cartItem: CartItem = {
					id: `temp-${Date.now()}`, // Temporary ID
					productId: product.id,
					name: product.name,
					description: product.description,
					price: product.price,
					quantity: product.quantity || 1,
					image: product.image,
				};

				dispatch(addItemLocal(cartItem));

				// API call
				await dispatch(
					addToCart({
						productId: product.id,
						quantity: product.quantity || 1,
					})
				).unwrap();

				Toast.show({
					type: 'success',
					text1: 'Added to Cart',
					text2: `${product.name} has been added to your cart`,
				});
			} catch (error: any) {
				Toast.show({
					type: 'error',
					text1: 'Failed to Add',
					text2: error || 'Could not add item to cart',
				});
			}
		},
		[dispatch]
	);

	// Check if product is in cart
	const isInCart = useCallback(
		(productId: string) => {
			return cartItems.some((item) => item.productId === productId);
		},
		[cartItems]
	);

	// Get quantity of specific product in cart
	const getProductQuantity = useCallback(
		(productId: string) => {
			const item = cartItems.find((item) => item.productId === productId);
			return item?.quantity || 0;
		},
		[cartItems]
	);

	return {
		cartItems,
		itemsCount,
		total,
		isEmpty,
		isLoading,
		error,
		addItem,
		isInCart,
		getProductQuantity,
	};
};
