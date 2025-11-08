// redux/selectors/cartSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selector
export const selectCart = (state: RootState) => state.cart;

// Memoized selectors
export const selectCartItems = createSelector(
	[selectCart],
	(cart) => cart.items
);

export const selectCartItemsCount = createSelector([selectCartItems], (items) =>
	items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
	items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartTotal = createSelector(
	[selectCartSubtotal],
	(subtotal) => {
		const SHIPPING_FEE = 150;
		const FREE_SHIPPING_THRESHOLD = 5000;
		const shippingFee =
			subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
		return subtotal + shippingFee;
	}
);

export const selectIsCartEmpty = createSelector(
	[selectCartItems],
	(items) => items.length === 0
);

export const selectCartItemById = (id: string) =>
	createSelector([selectCartItems], (items) =>
		items.find((item) => item.id === id)
	);

export const selectCartLoading = createSelector(
	[selectCart],
	(cart) => cart.isLoading
);

export const selectCartError = createSelector(
	[selectCart],
	(cart) => cart.error
);
