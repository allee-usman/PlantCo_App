import { Ionicons } from '@expo/vector-icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Link, router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, {
	useCallback,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react';
import {
	Image,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import Alert from '@/components/Alert';
import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import DynamicModal from '@/components/Modal';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { AutoCapitalize } from '@/interfaces/enums/AutoCapitalize';
import { TextContentType } from '@/interfaces/enums/TextContentType';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, loginUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { validateEmail, validatePassword } from '@/utils/validations';

//interface
interface SigninFormTypes {
	email: string;
	password: string;
	rememberMe: boolean;
}

// Custom hook: handles validation + error state
function useLoginValidation() {
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{}
	);

	/** Validate entire form */
	const validateForm = useCallback((data: SigninFormTypes) => {
		const email = validateEmail(data.email);
		const password = validatePassword(data.password);

		const newErrors = {
			email: email || undefined,
			password: password || undefined,
		};

		setErrors(newErrors);
		return newErrors;
	}, []);

	/** clear a single field error on change */
	const clearFieldError = useCallback((field: keyof SigninFormTypes) => {
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	}, []);

	return { errors, setErrors, validateForm, clearFieldError };
}

// Reducer: groups UI state
type UIState = {
	showPassword: boolean;
	wasSubmitted: boolean;
	showModal: boolean;
	focusedField: keyof SigninFormTypes | null;
	pendingEmail: string | null;
};

const initialUIState: UIState = {
	showPassword: true,
	wasSubmitted: false,
	showModal: false,
	focusedField: null,
	pendingEmail: null,
};

type UIAction =
	| { type: 'TOGGLE_PASSWORD' }
	| { type: 'SET_SUBMITTED' }
	| { type: 'FOCUS'; field: keyof SigninFormTypes }
	| { type: 'BLUR' }
	| { type: 'SHOW_MODAL'; email: string }
	| { type: 'HIDE_MODAL' };

function uiReducer(state: UIState, action: UIAction): UIState {
	switch (action.type) {
		case 'TOGGLE_PASSWORD':
			return { ...state, showPassword: !state.showPassword };
		case 'SET_SUBMITTED':
			return { ...state, wasSubmitted: true };
		case 'FOCUS':
			return { ...state, focusedField: action.field };
		case 'BLUR':
			return { ...state, focusedField: null };
		case 'SHOW_MODAL':
			return { ...state, showModal: true, pendingEmail: action.email };
		case 'HIDE_MODAL':
			return { ...state, showModal: false };
		default:
			return state;
	}
}

export default function LoginScreen() {
	const dispatch = useAppDispatch();
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	// Redux state
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

	// Form data
	const initialForm: SigninFormTypes = __DEV__
		? {
				email: 'aliusman429040@gmail.com',
				password: 'Password123!',
				rememberMe: true,
		  }
		: { email: '', password: '', rememberMe: false };

	const [formData, setFormData] = useState<SigninFormTypes>(initialForm);

	// Validation hook
	const { errors, validateForm, clearFieldError } = useLoginValidation();

	// UI reducer state
	const [ui, uiDispatch] = useReducer(uiReducer, initialUIState);

	// Refs
	const passwordRef = useRef<TextInput>(null);

	// Clear API error on screen focus
	useFocusEffect(
		useCallback(() => {
			dispatch(clearError());
			return () => dispatch(clearError());
		}, [dispatch])
	);

	// Update form field
	const handleChange = useCallback(
		(field: keyof SigninFormTypes, value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));

			// clear API errors on input
			if (error) dispatch(clearError());

			// clear field validation error as user types
			clearFieldError(field);
		},
		[dispatch, error, clearFieldError]
	);

	// Focus helpers to reduce duplication
	const handleFocus = useCallback(
		(field: keyof SigninFormTypes) => () =>
			uiDispatch({ type: 'FOCUS', field }),
		[]
	);

	const handleBlur = useCallback(() => uiDispatch({ type: 'BLUR' }), []);

	//Toggle remember me
	const toggleRememberMe = useCallback(
		() =>
			setFormData((prev) => ({
				...prev,
				rememberMe: !prev.rememberMe,
			})),
		[]
	);

	// Navigation helpers (cleaner than inline lambdas)
	const goToForgotPassword = () => router.push('/(auth)/forgot-password');

	// Submit login
	const handleLogin = useCallback(async () => {
		uiDispatch({ type: 'SET_SUBMITTED' });

		if (error) dispatch(clearError());

		// validate all fields at once
		const validationErrors = validateForm(formData);

		// stop if any error exists
		if (validationErrors.email || validationErrors.password) return;

		const action = await dispatch(
			loginUser({
				email: formData.email,
				password: formData.password,
				rememberMe: formData.rememberMe,
			})
		);

		try {
			const res = unwrapResult(action);

			// show verification modal if not verified
			if (res.user && !res.user.isVerified) {
				uiDispatch({
					type: 'SHOW_MODAL',
					email: res.user.email ?? formData.email,
				});
			} else {
				router.replace('/(root)/home');
			}
		} catch (err) {
			console.error('Login error:', err);
		}
	}, [dispatch, formData, validateForm, error]);

	// Memoized static resources
	const illustrationImage = useMemo(() => images.ilustration1, []);

	const handleModalContinue = () => {
		uiDispatch({ type: 'HIDE_MODAL' });

		router.push({
			pathname: '/(auth)/verify-otp',
			params: {
				email: ui.pendingEmail ?? formData.email,
				context: 'auth',
				startCountdown: 'true',
			},
		});
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950 py-4">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>

			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="px-6">
					{/* Illustration */}
					<View className="items-center mb-2">
						<Image
							source={illustrationImage}
							className="h-[200px]"
							resizeMode="contain"
						/>
					</View>

					{/* Titles */}
					<View className={`${error ? 'mb-4' : 'mb-8'} pt-4`}>
						<Text className="text-title text-center">Welcome</Text>
						<Text className="text-body text-center">
							Glad you&apos;re back!
						</Text>
					</View>

					{/* API error */}
					{error && <Alert variant="error" message={error} />}

					{/* Form */}
					<View className="mb-6">
						{/* Email */}
						<CustomInputField
							placeholder="Email"
							keyboardType="email-address"
							autoCapitalize={AutoCapitalize.NONE}
							textContentType={TextContentType.EMAIL_ADDRESS}
							autoComplete="email"
							returnKeyType="next"
							value={formData.email}
							leftIcon={icons.email}
							onChangeText={(text) => handleChange('email', text)}
							onFocus={handleFocus('email')}
							onBlur={handleBlur}
							onSubmitEditing={() => passwordRef.current?.focus()}
							editable={!isLoading}
							isFocused={ui.focusedField === 'email'}
							error={errors.email}
							roundedFull
						/>

						{/* Password */}
						<CustomInputField
							ref={passwordRef}
							placeholder="Password"
							value={formData.password}
							autoComplete="password"
							textContentType={TextContentType.PASSWORD}
							returnKeyType="done"
							editable={!isLoading}
							leftIcon={icons.lock}
							secureTextEntry={ui.showPassword}
							onRightIconPress={() => uiDispatch({ type: 'TOGGLE_PASSWORD' })}
							onChangeText={(text) => handleChange('password', text)}
							onFocus={handleFocus('password')}
							onBlur={handleBlur}
							onSubmitEditing={handleLogin}
							isFocused={ui.focusedField === 'password'}
							error={errors.password}
							roundedFull
						/>

						{/* Remember + forgot password */}
						<View className="flex-row justify-between mb-8">
							<TouchableOpacity
								className="flex-row items-center"
								onPress={toggleRememberMe}
								activeOpacity={0.7}
								disabled={isLoading}
							>
								<View
									className={`w-[18px] h-[18px] rounded-full border-[1.5px] items-center justify-center ${
										formData.rememberMe
											? 'bg-light-pallete-500 border-light-pallete-500'
											: 'border-gray-300 dark:border-gray-700 bg-light-screen dark:bg-gray-800'
									}`}
								>
									{formData.rememberMe && (
										<Ionicons name="checkmark" size={14} color="white" />
									)}
								</View>
								<Text className="ml-2 text-body-sm">Remember me</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={goToForgotPassword}>
								<Text className="underline text-body-sm text-light-pallete-400 font-nexa-bold">
									Forgot Password?
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Login button */}
					<CustomButton
						label="Login"
						onPress={handleLogin}
						loading={isLoading}
						disabled={isLoading}
						size="md"
					/>

					{/* Signup link */}
					<View className="flex-row justify-center mt-2">
						<Link
							href="/(auth)/signup"
							className="text-body-sm"
							onPress={() => error && dispatch(clearError())}
						>
							Don&apos;t have an account?{' '}
							<Text className="text-link font-nexa-extrabold">Sign up</Text>
						</Link>
					</View>
				</View>
			</KeyboardAwareScrollView>

			{/* Verification Modal */}
			<DynamicModal
				visible={ui.showModal}
				title="Email Verification Needed"
				description="We sent you a verification email. Please check your inbox."
				icon={<Ionicons name="information-circle" size={70} color="#F59E0B" />}
				primaryButton={{
					label: 'Continue',
					onPress: handleModalContinue,
				}}
				secondaryButton={{
					label: 'Close',
					onPress: () => uiDispatch({ type: 'HIDE_MODAL' }),
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'center',
	},
});
