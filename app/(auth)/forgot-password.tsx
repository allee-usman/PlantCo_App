import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { AutoCapitalize, TextContentType } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, requestPasswordReset } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { validateEmail } from '@/utils/validations';
import { Ionicons } from '@expo/vector-icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
	const dispatch = useAppDispatch();

	const [email, setEmail] = useState('');
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	const handleEmailBlur = () => {
		setFocusedField(null);
		if (email) {
			const error = validateEmail(email);
			setEmailError(error);
		}
	};

	const sendOTP = async () => {
		if (error) {
			dispatch(clearError());
		}
		const emailValidationError = validateEmail(email);
		if (emailValidationError) {
			setEmailError(emailValidationError);
			return;
		}
		try {
			const action = await dispatch(requestPasswordReset({ email }));
			const data = unwrapResult(action);
			if (data.success) {
				// TODO: Enhance UX by showing modal instead
				Toast.show({
					type: 'info',
					text1: 'Successfull',
					text2: data.message,
				});
				router.push({
					pathname: '/(auth)/verify-otp',
					params: { email, context: 'reset-password' },
				});
			} else {
				router.replace('/(root)/home');
			}
		} catch (err) {
			console.error(err);
		}
	};

	useFocusEffect(
		useCallback(() => {
			dispatch(clearError()); // clear error when entering

			return () => {
				dispatch(clearError()); // also clear when leaving
			};
		}, [dispatch])
	);

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950 py-4">
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="main-container px-6">
					<View className="flex justify-center items-center mb-2 border border-light-pallete-500 p-3 rounded-[10px]">
						<Ionicons
							name="finger-print-outline"
							size={50}
							color={COLORS.light.pallete[400]}
						/>
					</View>

					<View
						className={`items-center ${error ? 'mb-4' : 'mb-8'} pt-4 w-full`}
					>
						<Text className="text-2xl font-nexa-heavy text-center mb-3">
							Forgot your password?
						</Text>
						<Text className="text-body-sm text-center max-w-[85%] leading-5">
							A code will be sent to your email to help you recover your
							password.
						</Text>
					</View>

					{error && (
						<View className="mb-6 p-3 bg-red-100 w-full border border-red-300 rounded-lg">
							<Text className="text-red-700 text-center text-sm font-nexa">
								{error}
							</Text>
						</View>
					)}

					<View className="mb-1 w-full">
						<CustomInputField
							placeholder="Enter your email"
							keyboardType="email-address"
							autoCapitalize={AutoCapitalize.NONE}
							autoComplete="email"
							textContentType={TextContentType.EMAIL_ADDRESS}
							returnKeyType="done"
							accessibilityLabel="Email input field"
							value={email}
							leftIcon={icons.email}
							onChangeText={setEmail}
							onFocus={() => setFocusedField('email')}
							onBlur={handleEmailBlur}
							isFocused={focusedField === 'email'}
							error={emailError}
							editable={!isLoading}
							roundedFull
						/>
					</View>

					<View className="w-full">
						<CustomButton
							label={isLoading ? 'Sending...' : 'Send OTP'}
							onPress={sendOTP}
							loading={isLoading}
							disabled={isLoading}
							accessibilityLabel="Log in to your account"
							accessibilityRole="button"
						/>
					</View>

					<TouchableOpacity
						className="flex-row items-center mt-4"
						onPress={() => router.back()}
					>
						<Ionicons name="arrow-back" size={20} color="currentColor" />
						<Text className="text-body-sm text-black font-nexa-bold ms-2">
							Back to Login
						</Text>
					</TouchableOpacity>

					{/* <TouchableOpacity
						className="flex-row items-center mt-4"
						onPress={() => {
							router.push({
								pathname: '/(auth)/verify-otp',
								params: {
									email: 'aliusman429040@gmail.com', //TODO: Fix email param issue
									context: 'reset-password',
								},
							});
						}}
					>
						<Text className="text-link text-black ms-2">
							Already have a valid code?
						</Text>
					</TouchableOpacity> */}
				</View>
			</KeyboardAwareScrollView>
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
