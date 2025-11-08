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
import { Ionicons } from '@expo/vector-icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Link, router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useRef, useState } from 'react';
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
interface SigninFormTypes {
	email: string;
	password: string;
	rememberMe: boolean;
}

export default function LoginScreen() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	// states
	const [formData, setFormData] = useState<SigninFormTypes>({
		//TODO: remove hardcoded values when testing is done
		email: 'aliusman@example.com',
		password: 'Password123!',
		rememberMe: true,
	});
	const [showPassword, setShowPassword] = useState<boolean>(true);
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

	const [wasSubmitted, setWasSubmitted] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [pendingEmail, setPendingEmail] = useState<string | null>(null);

	// Refs for chaining
	const passwordRef = useRef<TextInput>(null);

	// redux
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

	useFocusEffect(
		useCallback(() => {
			dispatch(clearError()); // clear error when entering

			return () => {
				dispatch(clearError()); // also clear when leaving
			};
		}, [dispatch])
	);

	const handleFormDataChange = (
		field: keyof SigninFormTypes,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear error if field is being edited
		if (error) {
			dispatch(clearError());
		}

		switch (field) {
			case 'email':
				if (formErrors.email)
					setFormErrors((prev) => ({ ...prev, email: undefined }));
				break;
			case 'password':
				if (formErrors.password)
					setFormErrors((prev) => ({ ...prev, password: undefined }));
				break;
		}
	};

	// handleEmailBlur
	const handleEmailBlur = () => {
		setFocusedField(null);
		if (formData.email || wasSubmitted) {
			const error = validateEmail(formData.email);
			setFormErrors((prev) => ({ ...prev, email: error || undefined }));
		}
	};

	// handlePasswordBlur
	const handlePasswordBlur = () => {
		setFocusedField(null);
		if (formData.password || wasSubmitted) {
			const error = validatePassword(formData.password);
			setFormErrors((prev) => ({ ...prev, password: error || undefined }));
		}
	};

	const handleLogin = async () => {
		setWasSubmitted(true);

		if (error) {
			dispatch(clearError());
		}

		const emailValidationError = validateEmail(formData.email);
		const passwordValidationError = validatePassword(formData.password);

		setFormErrors({
			email: emailValidationError || undefined,
			password: passwordValidationError || undefined,
		});

		// if errors, don't proceed
		if (emailValidationError || passwordValidationError) {
			return;
		}

		const action = await dispatch(
			loginUser({
				email: formData.email,
				password: formData.password,
				rememberMe: formData.rememberMe,
			})
		);

		try {
			const resData = unwrapResult(action);
			if (resData.user && !resData.user.isVerified) {
				setPendingEmail(resData.user.email ?? formData.email);
				setShowModal(true);
			} else {
				router.replace('/(root)/home');
			}
		} catch (err) {
			console.error('Login error: ', err);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950 py-4">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="main-container px-6">
					<View className="z-0 w-full flex justify-center items-center mb-2">
						<Image
							source={images.ilustration1}
							className="h-[200px]"
							resizeMode="contain"
							alt="Illustration"
						/>
					</View>
					<View className={`${error ? 'mb-4' : 'mb-8'} pt-4 w-full`}>
						<Text className="text-title text-center">Welcome</Text>
						<Text className="text-body text-center">
							Glad you&apos;re back!
						</Text>
					</View>
					{/* {__DEV__ && (
						<Button
							title="Reset App Data"
							onPress={() => {
								resetAppData();
								alert('App data cleared!');
							}}
						/>
					)} */}

					{error && <Alert variant="error" message={error} />}

					<View className="mb-6 w-full">
						<CustomInputField
							placeholder="Email"
							keyboardType="email-address"
							autoCapitalize={AutoCapitalize.NONE}
							autoComplete="email"
							textContentType={TextContentType.EMAIL_ADDRESS}
							returnKeyType="next"
							accessibilityLabel="Email input field"
							value={formData.email}
							leftIcon={icons.email}
							onChangeText={(text) => handleFormDataChange('email', text)}
							onSubmitEditing={() => passwordRef.current?.focus()}
							onFocus={() => setFocusedField('email')}
							onBlur={handleEmailBlur}
							isFocused={focusedField === 'email'}
							error={formErrors.email}
							editable={!isLoading}
							roundedFull
						/>

						<CustomInputField
							placeholder="Password"
							accessibilityLabel="Password input field"
							editable={!isLoading}
							returnKeyType="done"
							autoComplete="password"
							leftIcon={icons.lock}
							textContentType={TextContentType.PASSWORD}
							value={formData.password}
							onChangeText={(text) => handleFormDataChange('password', text)}
							secureTextEntry={showPassword}
							onRightIconPress={() => setShowPassword((prev) => !prev)}
							onFocus={() => setFocusedField('password')}
							onBlur={handlePasswordBlur}
							isFocused={focusedField === 'password'}
							error={formErrors.password}
							onSubmitEditing={handleLogin}
							roundedFull
						/>

						<View className="flex-row items-center justify-between mb-8">
							<TouchableOpacity
								className="flex-row items-center"
								onPress={() =>
									setFormData({ ...formData, rememberMe: !formData.rememberMe })
								}
								disabled={isLoading}
								activeOpacity={0.7}
								accessible={true}
								accessibilityLabel="Toggle remember me"
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

							<TouchableOpacity
								onPress={() => {
									router.push('/(auth)/forgot-password');
								}}
								disabled={isLoading}
								accessible={true}
								accessibilityLabel="Go to forgot password screen"
							>
								<Text className="underline text-body-xs text-light-pallete-600 font-nexa-bold">
									Forgot Password?
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View className="w-full">
						<CustomButton
							label="Login"
							onPress={handleLogin}
							loading={isLoading}
							disabled={isLoading}
							size="md"
							accessibilityLabel="Log in to your account"
							accessibilityRole="button"
						/>

						<View className="flex-row justify-center mt-2">
							<Link
								href="/(auth)/signup"
								disabled={isLoading}
								className="text-body-sm"
								onPress={() => error && dispatch(clearError())}
							>
								Don&apos;t have an account?{' '}
								<Text className="text-link font-nexa-extrabold">Sign up</Text>
							</Link>
						</View>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<DynamicModal
				visible={showModal}
				title="Email Verification Needed"
				description="We sent you a verification email. Please check your inbox to verify your account."
				icon={<Ionicons name="information-circle" size={70} color="#F59E0B" />}
				primaryButton={{
					label: 'Continue',
					onPress: () => {
						setShowModal(false);
						router.push({
							pathname: '/(auth)/verify-otp',
							params: {
								email: pendingEmail ?? formData.email,
								context: 'auth',
								startCountdown: 'true',
							},
						});
					},
					className: 'bg-green-600',
					textClassName: 'text-white',
				}}
				secondaryButton={{
					label: 'Close',
					onPress: () => setShowModal(false),
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
