// redux/slices/favoritesSlice.ts - Manage favorite service providers

import {
	addProviderToFavorites,
	removeProviderFromFavorites,
} from '@/services/provider.services';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
	favoriteProviderIds: string[];
	loading: boolean;
	error: string | null;
}

const initialState: FavoritesState = {
	favoriteProviderIds: [],
	loading: false,
	error: null,
};

// Async thunks
export const addToFavorites = createAsyncThunk(
	'favorites/addProvider',
	async (providerId: string, { rejectWithValue }) => {
		try {
			await addProviderToFavorites(providerId);
			return providerId;
		} catch (error: any) {
			return rejectWithValue(error.message || 'Failed to add to favorites');
		}
	}
);

export const removeFromFavorites = createAsyncThunk(
	'favorites/removeProvider',
	async (providerId: string, { rejectWithValue }) => {
		try {
			await removeProviderFromFavorites(providerId);
			return providerId;
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Failed to remove from favorites'
			);
		}
	}
);

// Slice
const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		setFavoriteProviders: (state, action: PayloadAction<string[]>) => {
			state.favoriteProviderIds = action.payload;
		},
		clearFavorites: (state) => {
			state.favoriteProviderIds = [];
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		// Add to favorites
		builder.addCase(addToFavorites.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(addToFavorites.fulfilled, (state, action) => {
			state.loading = false;
			if (!state.favoriteProviderIds.includes(action.payload)) {
				state.favoriteProviderIds.push(action.payload);
			}
		});
		builder.addCase(addToFavorites.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});

		// Remove from favorites
		builder.addCase(removeFromFavorites.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(removeFromFavorites.fulfilled, (state, action) => {
			state.loading = false;
			state.favoriteProviderIds = state.favoriteProviderIds.filter(
				(id) => id !== action.payload
			);
		});
		builder.addCase(removeFromFavorites.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string;
		});
	},
});

export const { setFavoriteProviders, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// Selectors
export const selectFavoriteProviders = (state: { favorites: FavoritesState }) =>
	state.favorites.favoriteProviderIds;

export const selectIsFavorite = (
	state: { favorites: FavoritesState },
	providerId: string
) => state.favorites.favoriteProviderIds.includes(providerId);

export const selectFavoritesLoading = (state: { favorites: FavoritesState }) =>
	state.favorites.loading;

export const selectFavoritesError = (state: { favorites: FavoritesState }) =>
	state.favorites.error;
