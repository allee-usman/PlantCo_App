import Alert from '@/components/Alert';
import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import { icons } from '@/constants/icons';
import { AutoCapitalize } from '@/interfaces/enums/AutoCapitalize';
import { TextContentType } from '@/interfaces/enums/TextContentType';
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface SignupFormTypes {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export default function Signup() {
	//TODO: remove hard-coded values in production

	const [formData, setFormData] = useState<SignupFormTypes>({
		username: 'test_user',
		email: 'aliusman429040@gmail.com',
		password: 'Test@123',
		confirmPassword: 'Test@123',
	});

	// password visibility toggles

	const [show, setShow] = useState({
		password: false,
		confirmPassword: false,
	});

	//Track focused field (for UI highlighting)
	const [focusedField, setFocusedField] = useState<string | null>(null);

	//Centralized error storage per field

	const [errors, setErrors] = useState<
		Record<keyof SignupFormTypes, string | null>
	>({
		username: null,
		email: null,
		password: null,
		confirmPassword: null,
	});

	//Did the user submit at least once?
	//This helps decide when to auto-validate
	const [wasSubmitted, setWasSubmitted] = useState(false);

	//refs for next focus chaining between inputs
	const emailRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);

	// redux
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

	//Clear API errors when screen unmounts
	useEffect(() => {
		return () => {
			dispatch(clearError());
		};
	}, [dispatch]);

	//Reusable validators map

	const validators = {
		username: () => validateUsername(formData.username),
		email: () => validateEmail(formData.email),
		password: () => validatePassword(formData.password),
		confirmPassword: () =>
			validateConfirmPassword(formData.password, formData.confirmPassword),
	} as const;

	//Toggle password or confirm password visibility

	const toggleVisibility = (field: 'password' | 'confirmPassword') => {
		setShow((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	//Generalized change handler for all fields

	const handleFormDataChange = useCallback(
		(field: keyof SignupFormTypes, value: string) => {
			setFormData((prev) => ({
				...prev,
				[field]: value.trim(),
			}));

			// clear backend auth error while typing
			if (error) dispatch(clearError());

			// clear field-level error while editing
			setErrors((prev) => ({ ...prev, [field]: null }));
		},
		[dispatch, error]
	);

	//Generalized blur handler for all inputs
	//validates corresponding field

	const handleBlur = (field: keyof SignupFormTypes) => {
		setFocusedField(null);

		if (formData[field] || wasSubmitted) {
			const validationResult = validators[field]();
			setErrors((prev) => ({ ...prev, [field]: validationResult }));
		}
	};

	//Validate all fields then submit to backend
	const handleSignup = async () => {
		setWasSubmitted(true);

		// clear backend API error
		if (error) dispatch(clearError());

		// run full validation
		const nextErrors = {
			username: validateUsername(formData.username),
			email: validateEmail(formData.email),
			password: validatePassword(formData.password),
			confirmPassword: validateConfirmPassword(
				formData.password,
				formData.confirmPassword
			),
		};

		// update UI error state
		setErrors(nextErrors);

		// if any error exists → don't submit
		if (Object.values(nextErrors).some((err) => err)) return;

		// dispatch signup
		const action = await dispatch(
			registerUser({
				username: formData.username,
				email: formData.email,
				password: formData.password,
			})
		);

		try {
			const data = unwrapResult(action);

			// if user created successfully → go verify otp
			router.push({
				pathname: '/(auth)/verify-otp',
				params: {
					email: data.user.email,
					context: 'signup',
					startCountdown: 'true',
				},
			});
		} catch (err) {
			console.error('Signup error:', err);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="main-container">
					{/* Header*/}
					<View className="mb-10">
						<Text className="text-3xl text-gray-950 dark:text-white  font-nexa-extrabold text-center mb-2">
							Happy to onboard you!
						</Text>
						<Text className="text-body text-center text-gray-500 dark:text-gray-400 px-4">
							Just a few details and you&apos;re in.
						</Text>
					</View>

					{/* Backend error box */}
					{error && <Alert variant="error" message={error} />}

					{/* Form fields*/}
					<View className="mb-8 w-full space-y-4">
						{/* Username */}
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
							onSubmitEditing={() => emailRef.current?.focus()}
							onFocus={() => setFocusedField('username')}
							onBlur={() => handleBlur('username')}
							isFocused={focusedField === 'username'}
							error={errors.username}
							roundedFull
						/>

						{/* Email */}
						<CustomInputField
							placeholder="Email"
							keyboardType="email-address"
							autoCapitalize={AutoCapitalize.NONE}
							autoComplete="email"
							textContentType={TextContentType.EMAIL_ADDRESS}
							returnKeyType="next"
							value={formData.email}
							leftIcon={icons.email}
							editable={!isLoading}
							onChangeText={(text) => handleFormDataChange('email', text)}
							onSubmitEditing={() => passwordRef.current?.focus()}
							onFocus={() => setFocusedField('email')}
							onBlur={() => handleBlur('email')}
							isFocused={focusedField === 'email'}
							error={errors.email}
							roundedFull
						/>

						{/* Password */}
						<CustomInputField
							placeholder="Password"
							leftIcon={icons.lock}
							editable={!isLoading}
							returnKeyType="next"
							autoComplete="password"
							textContentType={TextContentType.PASSWORD}
							value={formData.password}
							onChangeText={(text) => handleFormDataChange('password', text)}
							secureTextEntry={!show.password}
							onRightIconPress={() => toggleVisibility('password')}
							onSubmitEditing={() => confirmPasswordRef.current?.focus()}
							onFocus={() => setFocusedField('password')}
							onBlur={() => handleBlur('password')}
							isFocused={focusedField === 'password'}
							error={errors.password}
							roundedFull
						/>

						{/* Confirm Password */}
						<CustomInputField
							placeholder="Confirm Password"
							leftIcon={icons.lock}
							editable={!isLoading}
							returnKeyType="done"
							autoComplete="password-new"
							textContentType={TextContentType.NEW_PASSWORD}
							value={formData.confirmPassword}
							onChangeText={(text) =>
								handleFormDataChange('confirmPassword', text)
							}
							secureTextEntry={!show.confirmPassword}
							onRightIconPress={() => toggleVisibility('confirmPassword')}
							onFocus={() => setFocusedField('confirmPassword')}
							onBlur={() => handleBlur('confirmPassword')}
							isFocused={focusedField === 'confirmPassword'}
							error={errors.confirmPassword}
							roundedFull
						/>
					</View>

					{/* Actions */}
					<View className="w-full space-y-4">
						<CustomButton
							label="Sign Up"
							onPress={handleSignup}
							loading={isLoading}
							disabled={isLoading}
						/>

						{/* Link to Login */}
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
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'center',
	},
});
