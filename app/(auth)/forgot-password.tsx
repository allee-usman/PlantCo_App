import { Ionicons } from '@expo/vector-icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { AutoCapitalize, TextContentType } from '@/interfaces';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, requestPasswordReset } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';

import Alert from '@/components/Alert';
import InfoModal from '@/components/InfoModal';
import { validateEmail } from '@/utils/validations';
import { useColorScheme } from 'nativewind';

const ForgotPassword = () => {
	// Redux
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

	// Local screen state
	const [email, setEmail] = useState('');
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	// theme
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	//Modal state
	const [isOtpModalVisible, setOtpModalVisible] = useState(false);

	/**
	 * Validate and set error on blur
	 */
	const handleEmailBlur = useCallback(() => {
		setFocusedField(null);

		if (!email) {
			setEmailError('Email is required');
			return;
		}

		setEmailError(validateEmail(email));
	}, [email]);

	/**
	 * Clear Redux errors when screen is focused or unfocused
	 */
	useFocusEffect(
		useCallback(() => {
			dispatch(clearError());

			return () => dispatch(clearError());
		}, [dispatch])
	);

	/**
	 * Disable Send OTP button when invalid
	 */
	const isSubmitDisabled = useMemo(() => {
		return !email || !!emailError || isLoading;
	}, [email, emailError, isLoading]);

	// Called after OTP is successfully sent
	const handleOtpSuccess = useCallback(() => {
		setOtpModalVisible(true);
	}, []);

	/**
	 * Trigger OTP API request
	 */
	const handleSendOtp = useCallback(async () => {
		// Validate before request
		const validationResult = validateEmail(email);

		if (validationResult) {
			setEmailError(validationResult);
			return;
		}

		// Clear any old API errors
		if (error) dispatch(clearError());

		try {
			const action = await dispatch(requestPasswordReset({ email }));

			const result = unwrapResult(action);

			// If backend indicates success
			if (result?.success) {
				handleOtpSuccess(); // Show modal
				return;
			}

			// Safety fallback – shouldn't normally happen
			router.replace('/(root)/home');
		} catch (err) {
			console.error('Password reset error:', err);
			Toast.show({
				type: 'error',
				text1: 'Something went wrong',
				text2: 'Please try again later',
			});
		}
	}, [dispatch, email, error, handleOtpSuccess]);

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950 py-4">
			{/* Back navigation */}
			<TouchableOpacity
				className="flex-row items-center mt-4 ml-5"
				onPress={() => router.back()}
				accessibilityRole="button"
				accessibilityLabel="Go back to login screen"
			>
				<Image
					source={icons.arrowBack}
					className="size-5"
					tintColor={isDark ? 'white' : 'black'}
				/>
				<Text className="text-body-sm font-nexa-bold ms-2">Back to Login</Text>
			</TouchableOpacity>
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="px-6 items-center">
					{/* Icon header */}
					<View className="flex justify-center items-center mb-2 border border-light-pallete-500 p-3 rounded-[10px] w-[80px] ">
						<Ionicons
							name="finger-print-outline"
							size={50}
							color={
								isDark ? COLORS.light.pallete[400] : COLORS.light.pallete[500]
							}
						/>
					</View>

					{/* Title & description */}
					<View
						className={`items-center ${error ? 'mb-4' : 'mb-8'} pt-4 w-full`}
					>
						<Text className="text-2xl text-gray-950 dark:text-white font-nexa-heavy text-center mb-3">
							Forgot your password?
						</Text>

						<Text className="text-body-sm text-center max-w-[85%] leading-5">
							Enter your email and we’ll send you a verification code.
						</Text>
					</View>

					{/* API error message */}
					{error && <Alert variant="error" message={error} />}

					{/* Email input */}
					<View className="mb-2 w-full">
						<CustomInputField
							placeholder="Enter your email"
							keyboardType="email-address"
							autoCapitalize={AutoCapitalize.NONE}
							autoComplete="email"
							textContentType={TextContentType.EMAIL_ADDRESS}
							returnKeyType="done"
							value={email}
							leftIcon={icons.email}
							onChangeText={setEmail}
							onFocus={() => setFocusedField('email')}
							onBlur={handleEmailBlur}
							isFocused={focusedField === 'email'}
							error={emailError}
							editable={!isLoading}
							roundedFull
							accessibilityLabel="Email input field"
						/>
					</View>

					{/* Submit button */}
					<CustomButton
						label={isLoading ? 'Sending...' : 'Send OTP'}
						onPress={handleSendOtp}
						loading={isLoading}
						disabled={isSubmitDisabled}
						accessibilityLabel="Send verification code to email"
						accessibilityRole="button"
						width={'100%'}
					/>
				</View>
			</KeyboardAwareScrollView>
			{/* Modal  */}
			<InfoModal
				visible={isOtpModalVisible}
				type="info"
				title="OTP Sent"
				description="A verification code has been sent to your email. Please check your inbox."
				primaryButton={{
					label: 'Continue',
					onPress: () => {
						setOtpModalVisible(false);
						router.push({
							pathname: '/(auth)/verify-otp',
							params: {
								email,
								context: 'reset-password',
							},
						});
					},
					className: 'bg-green-500',
					textClassName: 'text-white',
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

export default ForgotPassword;
