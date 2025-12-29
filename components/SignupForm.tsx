import { SignupFormTypes } from '@/app/(auth)/signup';
import { icons } from '@/constants/icons';
import { AutoCapitalize, TextContentType } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, registerUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import {
	validateConfirmPassword,
	validateEmail,
	validatePassword,
	validateUsername,
} from '@/utils/validations';
import { unwrapResult } from '@reduxjs/toolkit';
import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import CustomButton from './CustomButton';
import CustomInputField from './CustomInputField';

export default function SignupForm() {
	//TODO: remove hardcoded values
	const [formData, setFormData] = useState<SignupFormTypes>({
		username: 'test_user',
		email: 'aliusman429040@gmail.com',
		password: 'Test@123',
		confirmPassword: 'Test@123',
	});
	//states
	const [showPassword, setShowPassword] = useState<boolean>(true);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// redux
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
	const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState<
		string | null
	>(null);

	// Refs for chaining
	const emailRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);

	const handleFormDataChange = (
		field: keyof SignupFormTypes,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value.trim(), // Trim all fields for consistency
		}));

		// Clear error if field is being edited
		if (error) {
			dispatch(clearError());
		}

		switch (field) {
			case 'username':
				if (usernameError) setUsernameError(null);
				break;
			case 'email':
				if (emailError) setEmailError(null);
				break;
			case 'password':
				if (passwordError) setPasswordError(null);
				break;
			case 'confirmPassword':
				if (confirmPasswordError) setConfirmPasswordError(null);
				break;
		}
	};

	const handleUsernameBlur = () => {
		setFocusedField(null);
		if (formData.username || wasSubmitted) {
			const error = validateUsername(formData.username);
			setUsernameError(error);
		}
	};

	const handleEmailBlur = () => {
		setFocusedField(null);
		if (formData.email || wasSubmitted) {
			const error = validateEmail(formData.email);
			setEmailError(error);
		}
	};

	const handlePasswordBlur = () => {
		setFocusedField(null);
		if (formData.password || wasSubmitted) {
			const error = validatePassword(formData.password);
			setPasswordError(error);
		}
	};

	const handleConfirmPasswordBlur = () => {
		setFocusedField(null);
		if (formData.confirmPassword || wasSubmitted) {
			const error = validateConfirmPassword(
				formData.password,
				formData.confirmPassword
			);
			setConfirmPasswordError(error);
		}
	};

	const handleSignup = async () => {
		setWasSubmitted(true);

		// Clear error
		if (error) {
			dispatch(clearError());
		}

		const usernameError = validateUsername(formData.username);
		const emailError = validateEmail(formData.email);
		const passwordError = validatePassword(formData.password);
		const confirmPasswordError = validateConfirmPassword(
			formData.password,
			formData.confirmPassword
		);

		setUsernameError(usernameError);
		setEmailError(emailError);
		setPasswordError(passwordError);
		setConfirmPasswordError(confirmPasswordError);

		// if errors, dont proceed
		if (usernameError || emailError || passwordError || confirmPasswordError) {
			return;
		}

		const action = await dispatch(
			registerUser({
				username: formData.username,
				email: formData.email,
				password: formData.password,
			})
		);

		try {
			const data = unwrapResult(action);
			// user is created, OTP sent → go to verify screen
			router.push({
				pathname: '/(auth)/verify-otp',
				params: {
					email: data.user.email,
					context: 'signup',
					startCountdown: 'true',
				},
			});
		} catch (err) {
			console.error('Signup error: ', err);
		}
	};

	return (
		<>
			<View className="mb-8 w-full space-y-4">
				<CustomInputField
					placeholder="Username"
					leftIcon={icons.userOutline}
					autoCapitalize={AutoCapitalize.NONE}
					autoComplete="username"
					textContentType={TextContentType.USERNAME}
					returnKeyType="next"
					editable={!isLoading}
					value={formData.username}
					onChangeText={(text) => handleFormDataChange('username', text)}
					accessibilityLabel="Username input field"
					onSubmitEditing={() => emailRef.current?.focus()}
					onFocus={() => setFocusedField('username')}
					onBlur={handleUsernameBlur}
					isFocused={focusedField === 'username'}
					error={usernameError}
					roundedFull
				/>
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
					error={emailError}
					editable={!isLoading}
					roundedFull
				/>
				<CustomInputField
					placeholder="Password"
					leftIcon={icons.lock}
					accessibilityLabel="Password input field"
					editable={!isLoading}
					returnKeyType="next"
					autoComplete="password"
					textContentType={TextContentType.PASSWORD}
					value={formData.password}
					onChangeText={(text) => handleFormDataChange('password', text)}
					secureTextEntry={showPassword}
					onRightIconPress={() => setShowPassword((prev) => !prev)}
					onSubmitEditing={() => confirmPasswordRef.current?.focus()}
					onFocus={() => setFocusedField('password')}
					onBlur={handlePasswordBlur}
					isFocused={focusedField === 'password'}
					error={passwordError}
					roundedFull
				/>
				<CustomInputField
					placeholder="Confirm Password"
					leftIcon={icons.lock}
					accessibilityLabel="Confirm password input field"
					editable={!isLoading}
					returnKeyType="done"
					autoComplete="password-new"
					textContentType={TextContentType.NEW_PASSWORD}
					value={formData.confirmPassword}
					onChangeText={(text) => handleFormDataChange('confirmPassword', text)}
					secureTextEntry={showConfirmPassword}
					onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
					onFocus={() => setFocusedField('confirmPassword')}
					onBlur={handleConfirmPasswordBlur}
					isFocused={focusedField === 'confirmPassword'}
					error={confirmPasswordError}
					roundedFull
				/>
			</View>
			<View className="w-full space-y-4">
				<CustomButton
					label="Sign Up"
					onPress={handleSignup}
					loading={isLoading}
					disabled={isLoading}
					accessibilityLabel="Sign up for a new account"
					accessibilityRole="button"
				/>
				<View className="flex-row justify-center mt-2">
					<Link
						href="/(auth)/login"
						disabled={isLoading}
						className="text-body-sm"
						onPress={() => error && dispatch(clearError())}
					>
						Already have an account?{' '}
						<Text className="text-link font-nexa-extrabold">Login</Text>
					</Link>
				</View>
			</View>
		</>
	);
}
