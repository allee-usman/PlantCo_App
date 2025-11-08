import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import InfoModal from '@/components/InfoModal';
import { icons } from '@/constants/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearError, resetPassword } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { validateConfirmPassword, validatePassword } from '@/utils/validations';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResetPassword = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState<{
		password: string;
		confirmPassword: string;
	}>({
		password: '',
		confirmPassword: '',
	});
	const [focusedField, setFocusedField] = useState<string | null>(null);
	// refs for chaining focus
	const passwordRef = useRef<TextInput>(null);
	const confirmPasswordRef = useRef<TextInput>(null);

	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmPasswordError, setConfirmPasswordError] = useState<
		string | null
	>(null);

	// Get email and context from params
	const { email } = useLocalSearchParams<{
		email?: string;
	}>();

	const handlePasswordBlur = () => {
		setFocusedField(null);
		if (formData.password) {
			const error = validatePassword(formData.password);
			setPasswordError(error);
		}
	};
	const handleConfirmPasswordBlur = () => {
		setFocusedField(null);
		if (formData.confirmPassword) {
			const error = validateConfirmPassword(
				formData.password,
				formData.confirmPassword
			);
			setConfirmPasswordError(error);
		}
	};

	const handleResetPassword = async () => {
		console.log('handleResetPassword triggered');

		if (!email) {
			router.replace('/(auth)/forgot-password');
			return;
		}

		if (!email || !formData.password || !formData.confirmPassword) return;

		// Validate again on submit
		const pwdErr = validatePassword(formData.password);
		const confirmErr = validateConfirmPassword(
			formData.password,
			formData.confirmPassword
		);
		setPasswordError(pwdErr);
		setConfirmPasswordError(confirmErr);

		if (pwdErr || confirmErr) return;

		try {
			const result = await dispatch(
				resetPassword({ email, newPassword: formData.password })
			).unwrap();
			if (result.success) {
				setModalVisible(true);
			}
		} catch (error) {
			console.error('Reset password error: ', error);
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
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="main-container">
					<View className="flex justify-center items-center mb-2 border border-light-pallete-800 p-3 rounded-[10px]">
						<Image
							source={icons.lock}
							className="size-12"
							tintColor="#4d7111"
						/>
					</View>

					<View
						className={`items-center ${error ? 'mb-4' : 'mb-8'} pt-4 w-full`}
					>
						<Text className="text-3xl font-nexa-heavy text-center mb-3">
							Enter new password
						</Text>
						<Text className="text-body-sm text-center max-w-[80%] leading-5">
							Your new password must be different from previously used
							passwords.
						</Text>
					</View>

					{error && (
						<View className="mb-6 p-3 mx-2 bg-red-100 w-full border border-red-300 rounded-lg">
							<Text className="text-red-700 text-center text-xs font-nexa">
								{error}
							</Text>
						</View>
					)}

					<View className="mb-8 w-full space-y-4">
						<CustomInputField
							placeholder="Enter new password"
							leftIcon={icons.lock}
							accessibilityLabel="Password input field"
							editable={!isLoading}
							returnKeyType="next"
							autoComplete="new-password"
							textContentType="newPassword"
							value={formData.password}
							onChangeText={(text) => {
								setFormData({ ...formData, password: text });
								if (passwordError) {
									setPasswordError(validatePassword(text)); // live validation
								}
							}}
							secureTextEntry
							onSubmitEditing={() => confirmPasswordRef.current?.focus()}
							onFocus={() => {
								if (error) {
									dispatch(clearError());
								}
								setFocusedField('password');
							}}
							ref={passwordRef}
							onBlur={handlePasswordBlur}
							isFocused={focusedField === 'password'}
							error={passwordError}
							roundedFull
						/>
						<CustomInputField
							placeholder="Confirm new Password"
							leftIcon={icons.lock}
							accessibilityLabel="Confirm password input field"
							editable={!isLoading}
							returnKeyType="done"
							autoComplete="new-password"
							textContentType="newPassword"
							value={formData.confirmPassword}
							onChangeText={(text) => {
								setFormData({ ...formData, confirmPassword: text });
								if (confirmPasswordError) {
									setConfirmPasswordError(
										validateConfirmPassword(formData.password, text)
									); // live validation
								}
							}}
							ref={confirmPasswordRef}
							secureTextEntry
							onFocus={() => {
								if (error) {
									dispatch(clearError());
								}
								setFocusedField('confirmPassword');
							}}
							onBlur={handleConfirmPasswordBlur}
							isFocused={focusedField === 'confirmPassword'}
							error={confirmPasswordError}
							roundedFull
						/>
					</View>

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
							onPress={() => {
								router.replace('/(auth)/login');
							}}
							bgVariant="secondary"
							textVariant="secondary"
							accessibilityLabel="Button to cancel password reset"
							accessibilityRole="button"
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>

			{/* Modal for password reset success */}

			<InfoModal
				visible={false}
				type="success"
				title="Password Reset Success"
				description="Your password has been reset successfully. You can now log in with your new password."
				primaryButton={{
					label: 'Go to Login',
					onPress: () => {
						dispatch(clearError());
						setModalVisible(false);
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
