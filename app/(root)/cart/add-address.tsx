import CustomButton from '@/components/CustomButton';
import CustomDropdown from '@/components/CustomDropDown';
import CustomInputField from '@/components/CustomInputField';
import OrderStep from '@/components/OrderSteps';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { AddressService } from '@/services/address.services';
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
	TouchableOpacity,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface FormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	zipCode: string;
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
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		phone: '',
		address: '',
		zipCode: '',
		city: '',
		province: '',
		country: 'Pakistan', // fixed
		addressLabel: 'home',
		makeDefault: false,
	});

	// UI State
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const scrollRef = React.useRef<KeyboardAwareScrollView>(null);

	// Address types
	const addressLabels = [
		{ id: 'Home', label: 'Home', icon: 'home-outline' },
		{ id: 'Office', label: 'Office', icon: 'business-outline' },
		{ id: 'School', label: 'School', icon: 'school-outline' },
		{ id: 'University', label: 'University', icon: 'library-outline' },
		{ id: 'Friend', label: "Friend's Place", icon: 'people-outline' },
		{ id: 'Family', label: 'Family', icon: 'heart-outline' },
		{ id: 'Other', label: 'Other', icon: 'location-outline' },
	];

	// Provinces for Pakistan
	const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan'];

	const updateFormData = (field: keyof FormData, value: string | boolean) => {
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

		if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
		else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone';

		if (!formData.address.trim()) newErrors.address = 'Address is required';
		else if (formData.address.trim().length < 10)
			newErrors.address = 'Provide a more detailed address';

		if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code required';
		if (!formData.city.trim()) newErrors.city = 'City required';
		if (!formData.province.trim()) newErrors.province = 'Province required';
		if (!formData.country.trim()) newErrors.country = 'Country required';
		if (!formData.addressLabel.trim())
			newErrors.addressLabel = 'Address type required';

		setErrors(newErrors);
		return { isValid: Object.keys(newErrors).length === 0, newErrors };
	};

	const handleSaveAddress = async () => {
		// validate form first (you already have validateForm)
		const { isValid, newErrors } = validateForm();
		if (!isValid) {
			const firstErrorField = Object.keys(newErrors)[0];
			if (firstErrorField) {
				// scroll to top (or you can scroll to the specific field)
				scrollRef.current?.scrollToPosition(0, 0, true);
			}
			Alert.alert('Validation Error', 'Please fix errors.');
			return;
		}

		setIsLoading(true);
		try {
			// map formData to the API payload. Adjust field names if your backend expects different keys.
			const payload = {
				name: formData.name.trim(),
				email: formData.email?.trim() || null,
				phone: formData.phone.replace(/\D/g, ''),
				street: formData.address.trim(), // <- change key if backend uses different name (e.g. addressLine1)
				zipCode: formData.zipCode.trim(),
				city: formData.city.trim(),
				province: formData.province.trim(),
				country: formData.country.trim(),
				label: formData.addressLabel,
				isDefault: formData.makeDefault,
			};

			// create the address in DB
			const result = await AddressService.create(payload as any);

			// AddressService.create currently returns Address[] in your service.
			// Try to pick the created address from the returned array (last item), or handle single-object returns.
			let savedAddress: any = null;
			if (Array.isArray(result) && result.length > 0) {
				savedAddress = result[result.length - 1];
			} else if (result && typeof result === 'object') {
				savedAddress = result;
			}

			if (!savedAddress || (!savedAddress.id && !savedAddress._id)) {
				// if we couldn't determine saved address id, still show success but navigate to add-address fallback
				Alert.alert('Success', 'Address saved successfully!');
				router.push('/cart/confirm-order');
				return;
			}

			const savedId = savedAddress.id ?? savedAddress._id;

			// if user asked to make this the default, call setDefault (optional — some APIs do this server-side during create)
			if (formData.makeDefault) {
				try {
					await AddressService.setDefault(savedId);
				} catch (err) {
					// non-blocking: log or surface a small alert but continue
					console.warn('Failed to set default address:', err);
				}
			}

			Alert.alert('Success', 'Address saved successfully!');

			// navigate to confirm screen and pass addressId as param
			router.push({
				pathname: '/cart/confirm-order',
				params: { addressId: String(savedId) },
			});
		} catch (err: any) {
			console.error('Save address error', err);
			Alert.alert(
				'Error',
				err?.message ?? 'Failed to save address. Please try again.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const getLiveLocation = () => {
		console.log('Get live location pressed!'); //TODO: Get live location of user
	};

	const getAddressLabelLabel = () =>
		addressLabels.find((t) => t.id === formData.addressLabel)?.label ||
		'Select Address Label';

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			{/* OrderSteps */}
			<View className="flex-row items-center justify-center gap-x-3 py-4 border-b border-t border-gray-200 dark:border-gray-700 -mx-3">
				<OrderStep number={1} label="Add Address" isActive />
				<Ionicons
					name="chevron-forward-outline"
					color={COLORS.gray[400]}
					size={16}
				/>
				<OrderStep number={2} label="Confirm Order" />
			</View>
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
						placeholder="Full Name"
						inputStyle={{ fontSize: 14 }}
						value={formData.name}
						onChangeText={(t) => updateFormData('name', t)}
						isFocused={focusedField === 'name'}
						onFocus={() => handleFocus('name')}
						onBlur={handleBlur}
						error={errors.name}
						className="font-nexa text-body-sm"
					/>

					{/* email input */}
					<CustomInputField
						placeholder="Email Address (optional)"
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

					{/* Phone num field */}
					{/* <View className="flex-row items-center mb-2">
						<Text className="text-body-sm text-gray-700 dark:text-gray-300">
							Phone number
						</Text>
						<Text className="text-red-500 ml-1">*</Text>
					</View> */}
					<View className="mb-4 flex-row items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-light-surface dark:bg-gray-800">
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
						<Text className="text-xs text-red-500 mt-1">{errors.phone}</Text>
					)}

					<CustomInputField
						placeholder="Street Address"
						inputStyle={{ fontSize: 14 }}
						value={formData.address}
						onChangeText={(t) => updateFormData('address', t)}
						isFocused={focusedField === 'address'}
						onFocus={() => handleFocus('address')}
						onBlur={handleBlur}
						error={errors.address}
						className="font-nexa"
						containerStyle={{ marginBottom: 4 }}
					/>

					<TouchableOpacity
						className="pl-1 mb-[8px]"
						activeOpacity={0.7}
						onPress={getLiveLocation}
					>
						<Text className="text-body-sm font-nexa-bold text-light-pallete-500">
							Use my Location
						</Text>
					</TouchableOpacity>

					<CustomInputField
						placeholder="City"
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
						error={errors.province}
						isFocused={focusedField === 'province'}
						onOpen={() => handleFocus('province')}
						onClose={handleBlur}
					/>

					<CustomInputField
						placeholder="Zip Code"
						inputStyle={{ fontSize: 14 }}
						value={formData.zipCode}
						onChangeText={(t) => updateFormData('zipCode', t)}
						keyboardType="numeric"
						isFocused={focusedField === 'zipCode'}
						onFocus={() => handleFocus('zipCode')}
						onBlur={handleBlur}
						error={errors.zipCode}
					/>

					{/* Country Input */}
					{/* <View className="flex-row items-center mb-2">
						<Text className="text-body-sm text-gray-700 dark:text-gray-300">
							Country
						</Text>
						<Text className="text-red-500 ml-1">*</Text>
					</View> */}
					<View className="mb-4 relative">
						<View className="bg-light-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-4 rounded-xl flex-row items-center px-3">
							{/* <Ionicons name="earth-outline" size={20} color="#71717a" /> */}
							<Text className="ml-2 flex-1 text-body-sm text-gray-400 dark:text-gray-500">
								Pakistan
							</Text>
						</View>
					</View>

					{/* Address Type Dropdown */}
					<CustomDropdown
						options={addressLabels.map((a) => a.label)}
						value={getAddressLabelLabel()}
						onSelect={(val) => {
							const found = addressLabels.find((a) => a.label === val);
							if (found) updateFormData('addressLabel', found.id);
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
						className="py-4"
					/>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default AddAddressScreen;
