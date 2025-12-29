import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import InfoModal from '@/components/InfoModal';
import { icons } from '@/constants/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, resetPassword } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { validateConfirmPassword, validatePassword } from '@/utils/validations';

const ResetPassword = () => {
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

	// Modal visibility state
	const [isModalVisible, setIsModalVisible] = useState(false);

	// Form data state
	const [formValues, setFormValues] = useState({
		password: '',
		confirmPassword: '',
	});

	// Focus tracking for inputs
	const [focusedField, setFocusedField] = useState<
		'password' | 'confirmPassword' | null
	>(null);

	// Input refs for chaining focus
	const passwordInputRef = useRef<TextInput>(null);
	const confirmPasswordInputRef = useRef<TextInput>(null);

	// Validation error state
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState<
		string | null
	>(null);

	// Get email from route params
	const { email } = useLocalSearchParams<{ email?: string }>();

	/**
	 * Handles updating form values and performs live validation if error exists.
	 */
	const handleInputChange = (
		field: 'password' | 'confirmPassword',
		value: string
	) => {
		setFormValues((prev) => ({ ...prev, [field]: value }));

		// Live validation
		if (field === 'password' && passwordError) {
			setPasswordError(validatePassword(value));
		}
		if (field === 'confirmPassword' && confirmPasswordError) {
			setConfirmPasswordError(
				validateConfirmPassword(formValues.password, value)
			);
		}
	};

	/**
	 * Handles input focus: clears global error and sets focused field.
	 */
	const handleInputFocus = (field: 'password' | 'confirmPassword') => {
		if (error) dispatch(clearError());
		setFocusedField(field);
	};

	/**
	 * Handles input blur: clears focused field and validates input.
	 */
	const handleInputBlur = (field: 'password' | 'confirmPassword') => {
		setFocusedField(null);
		if (field === 'password')
			setPasswordError(validatePassword(formValues.password));
		if (field === 'confirmPassword')
			setConfirmPasswordError(
				validateConfirmPassword(formValues.password, formValues.confirmPassword)
			);
	};

	/**
	 * Validates the form and updates error state.
	 * @returns boolean indicating if the form is valid
	 */
	const isFormValid = () => {
		const pwdError = validatePassword(formValues.password);
		const confirmError = validateConfirmPassword(
			formValues.password,
			formValues.confirmPassword
		);
		setPasswordError(pwdError);
		setConfirmPasswordError(confirmError);
		return !pwdError && !confirmError;
	};

	/**
	 * Handles the password reset logic.
	 */
	const handleResetPassword = async () => {
		if (!email) {
			router.replace('/(auth)/forgot-password');
			return;
		}

		if (!isFormValid()) return;

		try {
			const result = await dispatch(
				resetPassword({ email, newPassword: formValues.password })
			).unwrap();
			if (result.success) setIsModalVisible(true);
		} catch (err) {
			console.error('Reset password error:', err);
		}
	};

	/**
	 * Clears global error when screen gains or loses focus.
	 */
	useFocusEffect(
		useCallback(() => {
			dispatch(clearError());
			return () => dispatch(clearError());
		}, [dispatch])
	);

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
					{/* Top Icon */}
					<View className="flex justify-center items-center mb-2 border border-light-pallete-800 p-3 rounded-[10px]">
						<Image
							source={icons.lock}
							className="size-12"
							tintColor="#4d7111"
						/>
					</View>

					{/* Heading and description */}
					<View
						className={`items-center ${error ? 'mb-4' : 'mb-8'} pt-4 w-full`}
					>
						<Text className="text-3xl font-nexa-heavy text-center mb-3">
							Enter New Password
						</Text>
						<Text className="text-body-sm text-center max-w-[80%] leading-5">
							Your new password must be different from previously used
							passwords.
						</Text>
					</View>

					{/* Global error message */}
					{error && (
						<View className="mb-6 p-3 mx-2 bg-red-100 w-full border border-red-300 rounded-lg">
							<Text className="text-red-700 text-center text-xs font-nexa">
								{error}
							</Text>
						</View>
					)}

					{/* Password Inputs */}
					<View className="mb-8 w-full space-y-4">
						<CustomInputField
							placeholder="Enter new password"
							leftIcon={icons.lock}
							editable={!isLoading}
							returnKeyType="next"
							autoComplete="new-password"
							textContentType="newPassword"
							value={formValues.password}
							onChangeText={(text) => handleInputChange('password', text)}
							secureTextEntry
							onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
							onFocus={() => handleInputFocus('password')}
							onBlur={() => handleInputBlur('password')}
							ref={passwordInputRef}
							isFocused={focusedField === 'password'}
							error={passwordError}
							roundedFull
						/>
						<CustomInputField
							placeholder="Confirm new password"
							leftIcon={icons.lock}
							editable={!isLoading}
							returnKeyType="done"
							autoComplete="new-password"
							textContentType="newPassword"
							value={formValues.confirmPassword}
							onChangeText={(text) =>
								handleInputChange('confirmPassword', text)
							}
							secureTextEntry
							ref={confirmPasswordInputRef}
							onFocus={() => handleInputFocus('confirmPassword')}
							onBlur={() => handleInputBlur('confirmPassword')}
							isFocused={focusedField === 'confirmPassword'}
							error={confirmPasswordError}
							roundedFull
						/>
					</View>

					{/* Action Buttons */}
					<View className="w-full space-y-4">
						<CustomButton
							label="Reset Password"
							onPress={handleResetPassword}
							loading={isLoading}
							disabled={isLoading}
							accessibilityLabel="Button to reset password"
							accessibilityRole="button"
						/>
						<CustomButton
							label="Cancel"
							onPress={() => router.replace('/(auth)/login')}
							bgVariant="secondary"
							textVariant="secondary"
							accessibilityLabel="Button to cancel password reset"
							accessibilityRole="button"
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>

			{/* Success Modal */}
			<InfoModal
				visible={isModalVisible}
				type="success"
				title="Password Reset Success"
				description="Your password has been reset successfully. You can now log in with your new password."
				primaryButton={{
					label: 'Go to Login',
					onPress: () => {
						setIsModalVisible(false);
						dispatch(clearError());
						router.replace('/(auth)/login');
					},
					variant: 'success',
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'center',
	},
});

export default ResetPassword;
