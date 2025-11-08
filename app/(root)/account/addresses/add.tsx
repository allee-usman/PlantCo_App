import CustomButton from '@/components/CustomButton';
import CustomDropdown from '@/components/CustomDropDown';
import CustomInputField from '@/components/CustomInputField';
import { COLORS } from '@/constants/colors';
import { AddressLabels, provinces } from '@/constants/constant';
import { icons } from '@/constants/icons';
import { AddressLabel } from '@/interfaces/types';
import api from '@/utils/api';
import { notify } from '@/utils/notification';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	Alert,
	Image,
	SafeAreaView,
	Switch,
	Text,
	TextInput,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface AddressFormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	postalCode: string;
	city: string;
	province: string;
	country: string;
	addressLabel: string;
	makeDefault: boolean;
}

interface FormErrors {
	[key: string]: string | null;
}

const AddAddressScreen: React.FC = () => {
	// Form State
	const [formData, setFormData] = useState<AddressFormData>({
		name: '',
		email: '',
		phone: '',
		address: '',
		postalCode: '',
		city: '',
		province: '',
		country: '',
		addressLabel: 'home',
		makeDefault: false,
	});

	// UI State
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const scrollRef = React.useRef<KeyboardAwareScrollView>(null);

	const updateFormData = (
		field: keyof AddressFormData,
		value: string | boolean
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: null }));
		}
	};

	const handleFocus = (fieldName: string) => {
		setFocusedField(fieldName);
	};

	const handleBlur = () => {
		setFocusedField(null);
	};

	const validateEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const validatePhone = (phone: string) => {
		const clean = phone.replace(/\D/g, ''); // keep only digits
		return clean.length >= 10;
	};

	const validateForm = () => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) newErrors.name = 'Name is required';
		else if (formData.name.trim().length < 2)
			newErrors.name = 'Name must be at least 2 characters';

		if (!formData.email.trim()) newErrors.email = 'Email is required';
		else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';

		if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
		else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone';

		if (!formData.city.trim()) newErrors.city = 'City is required';
		if (!formData.country.trim()) newErrors.country = 'Country is required';
		if (!formData.province.trim()) newErrors.state = 'Province is required';

		if (formData.postalCode.trim()) {
			if (!/^\d{5}$/.test(formData.postalCode))
				newErrors.postalCode = 'Postal code must be 5 digits';
		}

		setErrors(newErrors);
		return { isValid: Object.keys(newErrors).length === 0, newErrors };
	};

	const handleSaveAddress = async () => {
		const { isValid, newErrors } = validateForm();
		if (!isValid) {
			const firstErrorField = Object.keys(newErrors)[0];
			if (firstErrorField) {
				scrollRef.current?.scrollToPosition(0, 0, true);
			}
			notify.error('Validation Error', 'Please fix all the errors in the form');
			return;
		}

		setIsLoading(true);
		try {
			const payload = {
				...formData,
				phone: '+92' + formData.phone,
			};

			await api.post('/addresses', payload);

			// Show success
			Alert.alert('Success', 'Address saved successfully!');
			// console.log('Saved:', data);

			router.back();
		} catch (err: any) {
			console.error(err.response?.data || err.message);

			notify.error(
				'Failed to save address',
				err.response?.data?.message ||
					'Failed to save address. Please try again.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const getAddressLabelArray = (): AddressLabel[] => {
		return AddressLabels.map((item) => item.label);
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<KeyboardAwareScrollView
				contentContainerStyle={{
					paddingBottom: 0,
					paddingTop: 10,
					flexGrow: 1,
					paddingHorizontal: 16,
				}}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
				enableAutomaticScroll={true}
				ref={scrollRef} // you can keep ref here for scrolling to errors
			>
				<View className="mb-6">
					{/* Refactored with InputField */}
					<CustomInputField
						label="Full Name"
						required
						placeholder="Enter full name"
						inputStyle={{ fontSize: 14 }}
						value={formData.name}
						onChangeText={(t) => updateFormData('name', t)}
						isFocused={focusedField === 'name'}
						onFocus={() => handleFocus('name')}
						onBlur={handleBlur}
						error={errors.name}
						className="font-nexa text-body-sm"
					/>

					{/* Phone num field */}
					<View className="mb-4">
						<View className="flex-row items-center mb-2">
							<Text className="text-body-sm text-gray-700 dark:text-gray-300">
								Phone number
							</Text>
							<Text className="text-red-500 ml-1">*</Text>
						</View>
						<View className="flex-row items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-light-surface dark:bg-gray-800">
							{/* Left fixed code */}
							<View className="px-3 py-4 flex-row items-center justify-center border-r border-gray-200 dark:border-gray-700">
								<Image
									source={icons.pakistanFlag}
									className="w-6 h-6 mr-2 rounded-md"
								/>
								<Text className="text-body-sm text-gray-700 dark:text-gray-300">
									+92
								</Text>
							</View>

							{/* Phone input */}
							<TextInput
								className="flex-1 px-3 py-4 text-body-sm text-gray-900 dark:text-gray-100"
								keyboardType="phone-pad"
								value={formData.phone}
								onChangeText={(t) =>
									updateFormData('phone', t.replace(/\D/g, ''))
								}
								placeholder="312 123456"
								placeholderTextColor="#9ca3af"
								autoComplete="tel"
							/>
						</View>
						{errors.phone && (
							<View className="flex-row items-center mt-[4px] px-1">
								<Ionicons
									name="alert-circle"
									size={12}
									color="#EF4444"
									style={{ marginRight: 4 }}
								/>
								<Text className="text-body-xs text-red-600 dark:text-red-500 flex-1">
									{errors.phone}
								</Text>
							</View>
						)}
					</View>

					{/* email input */}
					<CustomInputField
						label="Email Address"
						required
						placeholder="Enter email"
						inputStyle={{ fontSize: 14 }}
						value={formData.email}
						onChangeText={(t) => updateFormData('email', t)}
						keyboardType="email-address"
						autoComplete="email"
						isFocused={focusedField === 'email'}
						onFocus={() => handleFocus('email')}
						onBlur={handleBlur}
						error={errors.email}
						className="font-nexa text-body-sm"
					/>

					<CustomInputField
						label="Full Address"
						placeholder="House, street, appartment number..."
						inputStyle={{ fontSize: 14 }}
						value={formData.address}
						onChangeText={(t) => updateFormData('address', t)}
						isFocused={focusedField === 'address'}
						onFocus={() => handleFocus('address')}
						onBlur={handleBlur}
						error={errors.address}
						className="font-nexa"
					/>

					<CustomInputField
						label="City"
						required
						placeholder="Enter city"
						inputStyle={{ fontSize: 14 }}
						value={formData.city}
						onChangeText={(t) => updateFormData('city', t)}
						isFocused={focusedField === 'city'}
						onFocus={() => handleFocus('city')}
						onBlur={handleBlur}
						error={errors.city}
						className="font-nexa"
					/>

					{/* Province Dropdown */}
					<CustomDropdown
						label="Province"
						required
						options={provinces}
						value={formData.province}
						onSelect={(val) => updateFormData('province', val)}
						error={errors.state}
						isFocused={focusedField === 'state'}
						onOpen={() => handleFocus('state')}
						onClose={handleBlur}
					/>

					<CustomInputField
						label="Postal Code"
						placeholder="Enter postal code (e.g. 55300)"
						inputStyle={{ fontSize: 14 }}
						value={formData.postalCode}
						onChangeText={(t) => updateFormData('postalCode', t)}
						keyboardType="numeric"
						isFocused={focusedField === 'postalCode'}
						onFocus={() => handleFocus('postalCode')}
						onBlur={handleBlur}
						error={errors.postalCode}
						className="font-nexa text-body-sm"
					/>

					{/* Country dropdown */}
					<CustomDropdown
						label="Country"
						required
						options={['Pakistan']}
						value={formData.country}
						onSelect={(val) => updateFormData('country', val)}
						error={errors.country}
						isFocused={focusedField === 'country'}
						onOpen={() => handleFocus('country')}
						onClose={handleBlur}
					/>

					{/* Address Type Dropdown */}
					<CustomDropdown
						label="Address Label"
						required
						options={getAddressLabelArray()}
						value={formData.addressLabel}
						onSelect={(val) => {
							const found = AddressLabels.find((a) => a.label === val); // ✅ correct const name
							if (found) updateFormData('addressLabel', found.label); // or found.id if you want ID
						}}
						error={errors.addressLabel}
						isFocused={focusedField === 'addressLabel'}
						onOpen={() => handleFocus('addressLabel')}
						onClose={handleBlur}
					/>

					{/* Default Toggle */}
					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="text-body-sm text-gray-950 dark:text-gray-50 leading-6 font-nexa-bold">
								Set as Default Address
							</Text>
							<Text className="text-body-xs text-gray-500">
								Use this address for future orders
							</Text>
						</View>
						<Switch
							value={formData.makeDefault}
							onValueChange={(v) => updateFormData('makeDefault', v)}
							trackColor={{
								false: COLORS.gray[300],
								true: COLORS.light.pallete[500],
							}}
							thumbColor={formData.makeDefault ? '#ffffff' : '#f3f4f6'}
							ios_backgroundColor="#e5e7eb"
						/>
					</View>
				</View>

				{/* Save Button */}
				<View className="py-5 bg-light-screen dark:bg-gray-950">
					<CustomButton
						label="Save Address"
						loading={isLoading}
						onPress={handleSaveAddress}
						bgVariant="primary"
						disabled={isLoading}
						className="p-4"
					/>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default AddAddressScreen;
