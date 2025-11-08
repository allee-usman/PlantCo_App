import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
		// Add other reducers here as needed
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore these action types if needed
				ignoredActions: ['cart/fetchCart/fulfilled'],
			},
		}),
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
