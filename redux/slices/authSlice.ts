import { BASE_URI } from '@/constants/constant';
import { Address, AuthState, OtpContext } from '@/interfaces/types';
import { NotificationSettings, User } from '@/types/user.types';
import {
	deleteSecureItem,
	getSecureItem,
	saveSecureItem,
} from '@/utils/secureStore';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// const initialState: AuthState = {
// 	user: null,
// 	token: null,
// 	error: null,
// 	isLoading: false,
// 	isInitialized: false, // Initially false until we check for stored token
// 	otpExpiresAt: null,
// 	pendingEmail: null,
// 	resetVerified: null,
// };

// Define AuthState interface to match new User structure

const initialState: AuthState = {
	user: null,
	token: null,
	error: null,
	isLoading: false,
	isInitialized: false,
	otpExpiresAt: null,
	pendingEmail: null,
	resetVerified: null,
};

// helper to set/clear default Authorization header for axios
function setAuthToken(token?: string | null) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
}

// 'auth/registerUser' -> Action type prefix
export const registerUser = createAsyncThunk<
	{ user: User; expiresAt: string }, // Returned data type
	{ username: string; email: string; password: string }, // Argument type
	{ rejectValue: string } // Error type
>(
	'auth/registerUser',
	async ({ username, email, password }, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(`${BASE_URI}/auth/signup`, {
				username,
				email,
				password,
			});

			if (data.success) {
				saveSecureItem('pendingEmail', data.data.user.email);
				// Clear any existing OTP state and save new expiresAt
				// deleteSecureItem('otpExpiresAt').then(() => {
				// 	saveSecureItem('otpExpiresAt', data.data.expiresAt);
				// });
				await deleteSecureItem('otpExpiresAt');
				await saveSecureItem('otpExpiresAt', data.data.expiresAt);
			}

			return {
				user: data.data.user,
				expiresAt: data.data.expiresAt,
			}; //{ success, message, user } -> sent to extraReducers as action.payload
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || 'Sign Up failed!'
			);
		}
	}
);

export const sendOTP = createAsyncThunk<
	{ expiresAt: string },
	{ email: string; context?: OtpContext },
	{ rejectValue: string }
>('auth/sendOTP', async ({ email, context }, { rejectWithValue }) => {
	try {
		const res = await axios.post(`${BASE_URI}/auth/send-otp`, {
			email,
			context,
		}); // { success, message, expiresAt }

		// if (res.data.success && context !== 'change-email') {
		// 	deleteSecureItem('otpExpiresAt').then(() => {
		// 		saveSecureItem('otpExpiresAt', res.data.expiresAt);
		// 	});
		// }

		if (res.data.success && context !== 'change-email') {
			await deleteSecureItem('otpExpiresAt');
			await saveSecureItem('otpExpiresAt', res.data.expiresAt);
		}

		return { expiresAt: res.data.expiresAt };
	} catch (error: any) {
		console.error('OTP sending error: ', error);
		return rejectWithValue(
			error.response?.data?.message || 'Unable to send OTP, try again later.'
		);
	}
});

export const verifyOTP = createAsyncThunk<
	{ user?: User; token?: string; resetVerified?: boolean }, // Return type
	{ email: string; otp: string; context?: OtpContext }, // Args
	{ rejectValue: string }
>('auth/verifyOTP', async ({ email, otp, context }, { rejectWithValue }) => {
	try {
		const res = await axios.post(`${BASE_URI}/auth/verify-otp`, {
			email,
			otp,
			context,
		});

		// Only save token if returned (signup/login)
		if (res.data.token) {
			await saveSecureItem('authToken', res.data.token);
			setAuthToken(res.data.token);
		}

		// Clear local OTP expiry always
		await deleteSecureItem('otpExpiresAt');

		// Return normalized response
		return {
			user: res.data.user, // may be undefined in password-reset
			token: res.data.token, // may be undefined in change-email/password-reset
			resetVerified: context === 'password-reset' ? true : undefined,
		};
	} catch (error: any) {
		console.error('Verification error: ', error);
		return rejectWithValue(
			error.response?.data?.message || 'Invalid or expired OTP'
		);
	}
});

// export const loginUser = createAsyncThunk<
// 	{ user: User; token: string | null; otpExpiresAt?: string | null },
// 	{ email: string; password: string; rememberMe: boolean },
// 	{ rejectValue: string }
// >(
export const loginUser = createAsyncThunk<
	{ user?: User | null; token?: string | null; otpExpiresAt?: string | null },
	{ email: string; password: string; rememberMe: boolean },
	{ rejectValue: string }
>(
	'auth/loginUser',
	async ({ email, password, rememberMe }, { rejectWithValue }) => {
		try {
			console.log(`${BASE_URI}/auth/login`);

			const res = await axios.post(`${BASE_URI}/auth/login`, {
				email,
				password,
			});

			// if (rememberMe) {
			// 	await saveSecureItem('authToken', res.data.token);
			// 	setAuthToken(res.data.token);
			// }
			if (res.data.token) {
				setAuthToken(res.data.token); // always set header for current session
				if (rememberMe) {
					await saveSecureItem('authToken', res.data.token);
				}
			}

			// if user is unverified, pull otpExpiresAt here
			let otpExpiresAt: string | null = null;
			if (!res.data.token) {
				otpExpiresAt = await getSecureItem('otpExpiresAt');
			}

			return { ...res.data, otpExpiresAt };
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message || 'Login failed!!');
		}
	}
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
	await deleteSecureItem('authToken');
	await deleteSecureItem('otpExpiresAt');
	setAuthToken(null);
	return null;
});

// Auto login - load token from secure storage
export const loadUserFromStorage = createAsyncThunk<
	{
		token: string | null;
		user: User | null;
		otpExpiresAt: string | null;
		pendingEmail: string | null;
	} | null,
	void,
	{ rejectValue: string }
>('auth/loadUserFromStorage', async (_, { rejectWithValue }) => {
	try {
		const token = await getSecureItem('authToken');
		const otpExpiresAt = await getSecureItem('otpExpiresAt');
		const pendingEmail = await getSecureItem('pendingEmail');
		if (!token) {
			return { token: null, user: null, otpExpiresAt, pendingEmail };
		}
		// setAuthToken(token);
		// const res = await axios.get(`${BASE_URI}/users/profile`, {
		// 	headers: { Authorization: `Bearer ${token}` },
		// });
		// 	return { token, user: res.data.user, otpExpiresAt: null, pendingEmail };

		setAuthToken(token);
		const res = await axios.get(`${BASE_URI}/users/me`);

		const user = res.data.user ?? null;

		// If we had an otpExpiresAt stored but it's expired (or if you want to clear it on successful login),
		// clear it from secure store here (async-safe).
		await deleteSecureItem('otpExpiresAt');

		return {
			token,
			user,
			otpExpiresAt: null,
			pendingEmail:
				user && user.isVerified === false ? user.email : pendingEmail,
		};
	} catch (error: any) {
		console.error(
			'Error loading/verifying token:',
			error?.response?.data || error.message
		);
		await deleteSecureItem('authToken');
		await deleteSecureItem('otpExpiresAt');
		await deleteSecureItem('pendingEmail');
		setAuthToken(null);
		return rejectWithValue('Session expired, please log in again!');
	}
});

// request password reset
export const requestPasswordReset = createAsyncThunk<
	{ success: boolean; message: string },
	{ email: string },
	{ rejectValue: string }
>('auth/requestPasswordReset', async ({ email }, { rejectWithValue }) => {
	try {
		const res = await axios.post(`${BASE_URI}/auth/request-password-reset`, {
			email,
		});
		return res.data;
	} catch (error: any) {
		console.error('Password reset request error: ', error);
		return rejectWithValue(
			error.response?.data?.message || 'Unable to request password reset.'
		);
	}
});

// reset password
export const resetPassword = createAsyncThunk<
	{ success: boolean; message: string },
	{ email: string; newPassword: string },
	{ rejectValue: string }
>('auth/resetPassword', async ({ email, newPassword }, { rejectWithValue }) => {
	try {
		const res = await axios.post(`${BASE_URI}/auth/reset-password`, {
			email,
			newPassword,
		});
		return res.data;
	} catch (error: any) {
		console.error('Reset password error: ', error);
		return rejectWithValue(
			error.response?.data?.message ||
				'Unable to reset password, try again later.'
		);
	}
});

const authSlice = createSlice({
	name: 'auth', //name of slice (prefix for actions)
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		resetAuth: (state) => {
			state.user = null;
			state.token = null;
			state.error = null;
			state.isLoading = false;
			state.isInitialized = true;
			state.otpExpiresAt = null;
			state.pendingEmail = null;
			state.resetVerified = null;
		},
		// clearOtpState: (state) => {
		// 	state.pendingEmail = null;
		// 	state.otpExpiresAt = null;
		// 	deleteSecureItem('otpExpiresAt');
		// 	deleteSecureItem('pendingEmail');
		// },
		clearOtpState: (state) => {
			state.pendingEmail = null;
			state.otpExpiresAt = null;
		},

		// reducer to overwrite user in Redux
		updateUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		// reducer to update addresses only
		// updateAddresses: (state, action: PayloadAction<Address[]>) => {
		// 	// if (state.user && state.user.customerProfile) {
		// 	// 	state.user.customerProfile.addresses = action.payload;
		// 	// }
		// 	if (!state.user) return;
		// 	if (!state.user.customerProfile) {
		// 		const cp =
		// 			state.user.customerProfile ??
		// 			(state.user.customerProfile = { addresses: [] } as any);

		// 	cp.addresses = action.payload;
		// 	}

		// },
		// updateAddresses: (state, action: PayloadAction<Address[]>) => {
		// 	if (!state.user) return;
		// 	if (!state.user.customerProfile) state.user.customerProfile = {};
		// 	state.user.customerProfile.addresses = action.payload;
		// },

		// inside createSlice -> reducers
		// updateNotificationSettingsInUser: (
		// 	state,
		// 	action: PayloadAction<User['notificationSettings']>
		// ) => {
		// 	if (state.user) {
		// 		// ensure property name matches your user model (use notificationSettings or notifications)
		// 		(state.user as any).notificationSettings = action.payload;
		// 	}
		// },

		updateAddresses: (state, action: PayloadAction<Address[]>) => {
			if (!state.user) return;

			// ensure customerProfile exists and get a strongly-typed local ref
			const cp =
				state.user.customerProfile ??
				(state.user.customerProfile = { addresses: [] } as any);

			cp.addresses = action.payload;
		},

		updateNotificationSettingsInUser: (
			state,
			action: PayloadAction<NotificationSettings>
		) => {
			if (!state.user) return;
			state.user.notificationSettings = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Register user cases
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				registerUser.fulfilled,
				(
					state,
					action: PayloadAction<{
						user: User;
						expiresAt: string;
					}>
				) => {
					state.isLoading = false;
					state.error = null;
					if (action.payload?.user?.email) {
						state.pendingEmail = action.payload.user.email;
					}

					state.otpExpiresAt = action.payload.expiresAt;
				}
			)
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// ── Verify OTP -> get token / handle reset
			.addCase(verifyOTP.pending, (state) => {
				// state.isLoading = true;
				state.error = null;
			})
			.addCase(
				verifyOTP.fulfilled,
				(
					state,
					action: PayloadAction<{
						user?: User;
						token?: string;
						resetVerified?: boolean;
					}>
				) => {
					state.isLoading = false;
					state.error = null;

					// Update user if returned (signup/change-email)
					if (action.payload.user) {
						state.user = action.payload.user;
					}

					// Save token only if present (signup/login)
					if (action.payload.token) {
						state.token = action.payload.token;
					}

					// Password-reset verification
					if (action.payload.resetVerified) {
						state.resetVerified = true;
					}

					// Always clear OTP-related state
					state.pendingEmail = null;
					state.otpExpiresAt = null;
				}
			)
			.addCase(verifyOTP.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				state.resetVerified = false;
			})

			// Send OTP cases
			.addCase(sendOTP.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				sendOTP.fulfilled,
				(state, action: PayloadAction<{ expiresAt: string }>) => {
					state.isLoading = false;
					state.error = null;
					state.otpExpiresAt = action.payload.expiresAt;
				}
			)
			.addCase(sendOTP.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			// Login user cases
			.addCase(loginUser.pending, (state) => {
				state.error = null;
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				// if (action.payload.token) {
				// 	state.user = action.payload.user;
				// 	state.token = action.payload.token;
				// } else {
				// 	state.user = null;
				// 	state.token = null;
				// 	state.pendingEmail = action.payload.user.email;
				// 	state.otpExpiresAt = action.payload.otpExpiresAt || null;
				// }
				if (action.payload.token) {
					state.user = action.payload.user ?? null;
					state.token = action.payload.token;
				} else {
					state.user = null;
					state.token = null;
					state.pendingEmail = action.payload.user?.email ?? null;
					state.otpExpiresAt = action.payload.otpExpiresAt ?? null;
				}
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.error = action.payload as string;
				state.isLoading = false;
			})
			// Logout user cases
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.token = null;
				state.error = null;
				state.pendingEmail = null;
				state.otpExpiresAt = null;
				state.resetVerified = null;
			})
			// Load token cases
			.addCase(loadUserFromStorage.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(
				loadUserFromStorage.fulfilled,
				(
					state,
					action: PayloadAction<{
						token: string | null;
						user: User | null;
						otpExpiresAt: string | null;
						pendingEmail: string | null;
					} | null>
				) => {
					if (action.payload) {
						state.token = action.payload.token;
						state.user = action.payload.user;
						const now = new Date();
						const expiresAt = action.payload.otpExpiresAt
							? new Date(action.payload.otpExpiresAt)
							: null;
						state.otpExpiresAt =
							expiresAt && expiresAt > now ? action.payload.otpExpiresAt : null;
						// if (!state.otpExpiresAt) {
						// 	deleteSecureItem('otpExpiresAt');
						// }
						// Set pendingEmail for unverified users
						state.pendingEmail =
							action.payload.user?.isVerified === false
								? action.payload.user.email
								: action.payload.pendingEmail;
					} else {
						state.token = null;
						state.user = null;
						state.otpExpiresAt = null;
						state.pendingEmail = null;
						// deleteSecureItem('otpExpiresAt');
						// deleteSecureItem('pendingEmail');
					}
					state.isInitialized = true;
					state.isLoading = false;
					state.error = null;
				}
			)
			.addCase(loadUserFromStorage.rejected, (state, action) => {
				state.isInitialized = true;
				state.isLoading = false;
				state.error = action.payload as string;
				state.token = null;
				state.user = null;
				state.otpExpiresAt = null;
			})
			// Reset password cases
			.addCase(requestPasswordReset.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(requestPasswordReset.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(requestPasswordReset.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			// Reset password cases
			.addCase(resetPassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(resetPassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.resetVerified = action.payload.success;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
				state.resetVerified = false;
			});
	},
});

export const clearOtpStateThunk = createAsyncThunk(
	'auth/clearOtpState',
	async (_, { dispatch }) => {
		await deleteSecureItem('otpExpiresAt');
		await deleteSecureItem('pendingEmail');
		dispatch(authSlice.actions.clearOtpState());
		return null;
	}
);

export const {
	clearError,
	resetAuth,
	clearOtpState,
	updateUser,
	updateAddresses,
	updateNotificationSettingsInUser,
} = authSlice.actions;
export default authSlice.reducer;
