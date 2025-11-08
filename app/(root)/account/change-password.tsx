import { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Alert from '@/components/Alert';
import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import InfoModal from '@/components/InfoModal';
import { icons } from '@/constants/icons';
import { TextContentType } from '@/interfaces';
import { changePassword } from '@/services/user.services';
import { validateConfirmPassword, validatePassword } from '@/utils/validations';
import { router } from 'expo-router';

const ChangePassword = () => {
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({
		current: null as string | null,
		new: null as string | null,
		confirm: null as string | null,
	});
	const [apiError, setApiError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const currentRef = useRef<TextInput>(null);
	const newRef = useRef<TextInput>(null);
	const confirmRef = useRef<TextInput>(null);

	// Derived validation results (used to enable/disable submit)
	const currentValidationError = validatePassword(formData.currentPassword);
	const newValidationError = validatePassword(formData.newPassword);
	const confirmValidationError = validateConfirmPassword(
		formData.newPassword,
		formData.confirmPassword
	);

	const isFormFilled =
		formData.currentPassword.trim() !== '' &&
		formData.newPassword.trim() !== '' &&
		formData.confirmPassword.trim() !== '';

	const isFormValid =
		isFormFilled &&
		!currentValidationError &&
		!newValidationError &&
		!confirmValidationError;

	// Submit handler
	const handleSubmit = async () => {
		// Final validation before submit (also sets visible errors)
		const currentErr = !formData.currentPassword
			? 'Current password is required'
			: validatePassword(formData.currentPassword);
		const newErr = validatePassword(formData.newPassword);
		const confirmErr = validateConfirmPassword(
			formData.newPassword,
			formData.confirmPassword
		);

		setErrors({
			current: currentErr,
			new: newErr,
			confirm: confirmErr,
		});

		if (currentErr || newErr || confirmErr) return;

		setApiError(null);
		setLoading(true);

		try {
			const result = await changePassword({
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
			});

			if (result.success) {
				setFormData({
					currentPassword: '',
					newPassword: '',
					confirmPassword: '',
				});
				setShowModal(true);
			}
		} catch (err: any) {
			setApiError(err?.response?.data?.message || 'Failed to change password');
		} finally {
			setLoading(false);
		}
	};

	// change handler: update value, clear related errors immediately (live behavior)
	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear API-level error as user edits
		if (apiError) setApiError(null);

		// Clear field-specific errors as user starts typing:
		// - typing in `currentPassword` clears current error
		// - typing in `newPassword` clears new & confirm errors (confirm depends on new)
		// - typing in `confirmPassword` clears confirm error
		setErrors((prev) => {
			if (field === 'currentPassword') return { ...prev, current: null };
			if (field === 'newPassword') return { ...prev, new: null, confirm: null };
			return { ...prev, confirm: null };
		});
	};

	// Blur handlers — validate the single field on blur and set error only if invalid
	const handleCurrentBlur = () => {
		setFocusedField(null);
		const err = !formData.currentPassword
			? 'Current password is required'
			: validatePassword(formData.currentPassword);
		setErrors((p) => ({ ...p, current: err }));
	};

	const handleNewBlur = () => {
		setFocusedField(null);
		const err = validatePassword(formData.newPassword);
		setErrors((p) => ({ ...p, new: err }));
		// If confirm already filled and matches new, clear confirm error too
		if (
			!validateConfirmPassword(formData.newPassword, formData.confirmPassword)
		) {
			setErrors((p) => ({ ...p, confirm: null }));
		}
	};

	const handleConfirmBlur = () => {
		setFocusedField(null);
		const err = validateConfirmPassword(
			formData.newPassword,
			formData.confirmPassword
		);
		setErrors((p) => ({ ...p, confirm: err }));
		// If new password itself is valid, ensure new error removed
		const newErr = validatePassword(formData.newPassword);
		if (!newErr) setErrors((p) => ({ ...p, new: null }));
	};

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
				showsVerticalScrollIndicator={false}
			>
				<View>
					<View className="items-center mb-8 w-full">
						<Text className="text-2xl font-nexa-heavy text-center mb-3 text-gray-950 dark:text-gray-50">
							Change Password
						</Text>
						<Text className="text-body-sm text-center px-5 leading-5">
							Enter your current password and choose a strong new one.
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

					<View className="mb-8 w-full">
						{/* Current Password */}
						<CustomInputField
							placeholder="Current Password"
							secureTextEntry
							leftIcon={icons.lock}
							textContentType={TextContentType.PASSWORD}
							autoComplete="password"
							ref={currentRef}
							value={formData.currentPassword}
							onChangeText={(text) => handleChange('currentPassword', text)}
							onFocus={() => setFocusedField('current')}
							onBlur={handleCurrentBlur}
							isFocused={focusedField === 'current'}
							error={errors.current}
							returnKeyType="next"
							onSubmitEditing={() => newRef.current?.focus()}
						/>

						{/* New Password */}
						<CustomInputField
							placeholder="New Password"
							secureTextEntry
							leftIcon={icons.lock}
							textContentType={TextContentType.NEW_PASSWORD}
							autoComplete="password-new"
							ref={newRef}
							value={formData.newPassword}
							onChangeText={(text) => handleChange('newPassword', text)}
							onFocus={() => setFocusedField('new')}
							onBlur={handleNewBlur}
							isFocused={focusedField === 'new'}
							error={errors.new}
							returnKeyType="next"
							onSubmitEditing={() => confirmRef.current?.focus()}
						/>

						{/* Confirm New Password */}
						<CustomInputField
							placeholder="Confirm New Password"
							secureTextEntry
							leftIcon={icons.lock}
							textContentType={TextContentType.NEW_PASSWORD}
							autoComplete="password-new"
							ref={confirmRef}
							value={formData.confirmPassword}
							onChangeText={(text) => handleChange('confirmPassword', text)}
							onFocus={() => setFocusedField('confirm')}
							onBlur={handleConfirmBlur}
							isFocused={focusedField === 'confirm'}
							error={errors.confirm}
							returnKeyType="done"
							onSubmitEditing={handleSubmit}
						/>
					</View>
				</View>

				<View className="w-full py-2 dark:bg-gray-950 bg-light-screen">
					<CustomButton
						label="Update"
						onPress={handleSubmit}
						loading={loading}
						disabled={!isFormValid || loading}
						bgVariant="primary"
						textVariant="secondary"
						accessibilityLabel="Update password"
						accessibilityRole="button"
						className="py-4 w-full mb-4"
					/>
				</View>
			</KeyboardAwareScrollView>

			<InfoModal
				visible={showModal}
				type="success"
				title="Password Updated"
				description="Your password has been changed successfully."
				primaryButton={{
					label: 'Got it',
					onPress: () => {
						setShowModal(false);
						router.back();
					},
					variant: 'success',
				}}
			/>
		</View>
	);
};

export default ChangePassword;
