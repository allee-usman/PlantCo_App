import Alert from '@/components/Alert';
import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import InfoModal from '@/components/InfoModal';
import { icons } from '@/constants/icons';
import { requestEmailChange } from '@/services/user.services';
import { validateEmail } from '@/utils/validations';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ChangeEmail = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const [newEmail, setNewEmail] = useState('');
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	const handleEmailBlur = () => {
		setFocusedField(null);
		if (newEmail) setEmailError(validateEmail(newEmail));
	};

	const sendOTP = async () => {
		const emailValidationError = validateEmail(newEmail);
		if (emailValidationError) {
			setEmailError(emailValidationError);
			return;
		}
		setApiError(null);
		setLoading(true);

		try {
			const response = await requestEmailChange(newEmail);

			if (response.success) {
				setShowModal(true);
			}

			// Show success message (or navigate to OTP screen)
			// Example: navigate with newEmail
			// router.push({ pathname: '/verify-otp', params: { email: newEmail } });
		} catch (err: any) {
			setApiError(
				err?.response?.data?.message ||
					err.message ||
					'Failed to change email, please try again later'
			);
			console.error(
				'Email change error:',
				err.response?.data?.message || err.message
			);
		} finally {
			setLoading(false);
		}
	};

	const handleEmailChange = (value: string) => {
		setNewEmail(value);
		setEmailError(null); // Clear validation while typing
		setApiError('');
	};

	useFocusEffect(
		useCallback(() => {
			setApiError('');
			return () => {
				setApiError('');
			};
		}, [setApiError])
	);

	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950">
			<KeyboardAwareScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: 'space-between',
					paddingHorizontal: 16,
				}}
				enableOnAndroid
				keyboardShouldPersistTaps="handled"
				// extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View>
					<View className={`items-center ${apiError ? 'mb-4' : 'mb-8'} w-full`}>
						<Text className="text-2xl font-nexa-heavy text-center mb-3 text-gray-950 dark:text-white">
							Update Email
						</Text>
						<Text className="text-body-sm text-center text-gray-500 dark:text-gray-400 max-w-[90%] leading-5">
							We will send you an OTP to verify your new email address
						</Text>
					</View>

					{apiError && (
						<Alert
							variant="error"
							message={apiError}
							className="mb-6"
							dismissible
							onDismiss={() => setApiError(null)}
						/>
					)}

					<View className="mb-2 w-full">
						<CustomInputField
							placeholder="Enter new email"
							value={newEmail}
							onChangeText={handleEmailChange}
							leftIcon={icons.email}
							keyboardType="email-address"
							autoCapitalize="none"
							autoComplete="email"
							onFocus={() => setFocusedField('email')}
							onBlur={handleEmailBlur}
							isFocused={focusedField === 'email'}
							error={emailError}
						/>
					</View>
				</View>

				<View className="w-full py-2 dark:bg-gray-950 bg-light-screen">
					<CustomButton
						label="Update"
						onPress={sendOTP}
						loading={loading}
						disabled={loading}
						accessibilityLabel="Button to update new email"
						accessibilityRole="button"
						className="py-4"
					/>
				</View>
			</KeyboardAwareScrollView>
			<InfoModal
				visible={showModal}
				type="success"
				title="OTP Sent Successfully"
				description={`We’ve sent an OTP to ${newEmail}. 
  Enter it on the next screen to verify.
  `}
				primaryButton={{
					label: 'Continue',
					onPress() {
						setShowModal(false);
						router.push({
							pathname: '/(auth)/verify-otp',
							params: {
								email: newEmail,
								context: 'email-change',
								startCountdown: 'true',
							},
						});
					},
					variant: 'success',
				}}
			/>
		</View>
	);
};

export default ChangeEmail;
