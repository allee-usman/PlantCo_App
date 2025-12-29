import { BASE_URI } from '@/constants/constant';
import { CartItem, CartState } from '@/interfaces/cart.interface';
import api from '@/utils/api';
import {
	createAsyncThunk,
	createSelector,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import { selectCartItems } from '../selectors/cartSelectors';
// import axios from 'axios'; -- removed in favor of api

const initialState: CartState = {
	items: [],
	isLoading: false,
	error: null,
	lastSynced: null,
};

// Helper: normalize server item to include `id` and ensure productId is string
// CHANGED: normalize server `_id` to `id` so UI code that expects `id` continues to work.
function normalizeItemFromServer(raw: any): CartItem {
	const id = raw._id || raw.id || '';
	const productId =
		typeof raw.productId === 'string'
			? raw.productId
			: raw.productId?._id || raw.productId?.id || '';
	return {
		// keep everything else as-is, but ensure id and productId fields exist
		...raw,
		id,
		productId,
	};
}

// Async thunks for API calls
export const fetchCart = createAsyncThunk<
	CartItem[],
	void,
	{ rejectValue: string }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
	try {
		// CHANGED: use api instead of axios
		const { data } = await api.get(`${BASE_URI}/customers/cart`);
		// CHANGED: normalize each item returned by server to include `id`
		const items = (data.data.items || []).map((i: any) =>
			normalizeItemFromServer(i)
		);

		// console.log(items);

		return items;
	} catch (error: any) {
		return rejectWithValue(
			error.response?.data?.message || 'Failed to fetch cart'
		);
	}
});

export const addToCart = createAsyncThunk<
	CartItem,
	{ productId: string; quantity?: number },
	{ rejectValue: string }
>(
	'cart/addToCart',
	async ({ productId, quantity = 1 }, { rejectWithValue }) => {
		try {
			// CHANGED: use api instead of axios
			const { data } = await api.post(`${BASE_URI}/customers/cart`, {
				productId,
				quantity,
			});
			// CHANGED: server returns data.item — normalize to CartItem shape with id
			const item = normalizeItemFromServer(data.data.item);
			return item;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to add item to cart'
			);
		}
	}
);

// CHANGED: Backend routes expect productId in the URL (/cart/update/:productId).
// Therefore make the thunk accept productId (not the cart-item id).
export const updateCartItem = createAsyncThunk<
	{ productId: string; quantity: number },
	{ productId: string; quantity: number },
	{ rejectValue: string }
>(
	'cart/updateCartItem',
	async ({ productId, quantity }, { rejectWithValue }) => {
		try {
			// CHANGED: use api instead of axios
			const { data } = await api.put(
				`${BASE_URI}/customers/cart/${productId}`,
				{
					quantity,
				}
			);
			// CHANGED: server responds with data.quantity (and data.item). We'll return productId + quantity
			return { productId, quantity: data.quantity ?? quantity };
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to update item'
			);
		}
	}
);

// CHANGED: removeFromCart should call backend with productId (backend route: /cart/remove/:productId)
export const removeFromCart = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('cart/removeFromCart', async (productId, { rejectWithValue }) => {
	try {
		await api.delete(`${BASE_URI}/customers/cart/${productId}`);
		return productId;
	} catch (error: any) {
		return rejectWithValue(
			error.response?.data?.message || 'Failed to remove item'
		);
	}
});

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
	'cart/clearCart',
	async (_, { rejectWithValue }) => {
		try {
			// CHANGED: use api instead of axios
			await api.delete(`${BASE_URI}/customers/cart/clear`);
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'Failed to clear cart'
			);
		}
	}
);

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		// Local actions (optimistic updates)
		addItemLocal: (state, action: PayloadAction<CartItem>) => {
			const existingItem = state.items.find(
				(item) => item.productId === action.payload.productId
			);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push(action.payload);
			}
		},
		updateQuantityLocal: (
			state,
			action: PayloadAction<{ id: string; quantity: number }>
		) => {
			const item = state.items.find((item) => item.id === action.payload.id);
			if (item) {
				item.quantity = Math.max(1, action.payload.quantity);
			}
		},
		removeItemLocal: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item) => item.id !== action.payload);
		},
		clearCartLocal: (state) => {
			state.items = [];
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch cart
			.addCase(fetchCart.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.isLoading = false;
				state.items = action.payload;
				state.lastSynced = new Date().toISOString();
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Add to cart
			.addCase(addToCart.pending, (state) => {
				state.error = null;
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				// CHANGED: action.payload is normalized CartItem with `id` and `productId`
				const existingItem = state.items.find(
					(item) => item.productId === action.payload.productId
				);
				if (existingItem) {
					// server returned an updated item — update quantity & price if present
					existingItem.quantity = action.payload.quantity;
					if (action.payload.price !== undefined)
						existingItem.price = action.payload.price;
				} else {
					state.items.push(action.payload);
				}
				state.lastSynced = new Date().toISOString();
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.error = action.payload as string;
			})

			// Update cart item
			.addCase(updateCartItem.pending, (state) => {
				state.error = null;
			})
			.addCase(updateCartItem.fulfilled, (state, action) => {
				// CHANGED: we receive productId + quantity (backend route uses productId)
				const { productId, quantity } = action.payload;
				// find item by productId (not by cart-item id)
				const item = state.items.find((it) => it.productId === productId);
				if (item) {
					item.quantity = quantity;
				}
				state.lastSynced = new Date().toISOString();
			})
			.addCase(updateCartItem.rejected, (state, action) => {
				state.error = action.payload as string;
			})

			// Remove from cart
			.addCase(removeFromCart.pending, (state) => {
				state.error = null;
			})
			.addCase(removeFromCart.fulfilled, (state, action) => {
				// CHANGED: action.payload is productId (backend remove route uses productId)
				const productId = action.payload;
				state.items = state.items.filter(
					(item) => item.productId !== productId
				);
				state.lastSynced = new Date().toISOString();
			})
			.addCase(removeFromCart.rejected, (state, action) => {
				state.error = action.payload as string;
			})

			// Clear cart
			.addCase(clearCart.pending, (state) => {
				state.error = null;
			})
			.addCase(clearCart.fulfilled, (state) => {
				state.items = [];
				state.lastSynced = new Date().toISOString();
			})
			.addCase(clearCart.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const selectCartSubtotal = createSelector(selectCartItems, (items) => {
	return items.reduce((acc, it) => {
		const price = Number(it.price ?? 0);
		const qty = Number(it.quantity ?? 1);
		return acc + price * qty;
	}, 0);
});

export const {
	addItemLocal,
	updateQuantityLocal,
	removeItemLocal,
	clearCartLocal,
	clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
