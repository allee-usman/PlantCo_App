import CustomButton from '@/components/CustomButton';
import CustomDropdown from '@/components/CustomDropDown';
import CustomInputField from '@/components/CustomInputField';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import { COLORS } from '@/constants/colors';
import { AddressLabels, provinces } from '@/constants/constant';
import { AddressLabel } from '@/interfaces/types';
import { AddressService } from '@/services/address.services';
import { notify } from '@/utils/notification';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Switch, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface FormData {
	name: string;
	email: string;
	phone: string;
	address?: string;
	zipCode?: string;
	city: string;
	state: string;
	country: string;
	addressLabel: 'Home' | 'Work' | 'Office' | 'University' | 'Friend' | 'Other';
	makeDefault: boolean;
}

const EditAddressScreen: React.FC = () => {
	const { id } = useLocalSearchParams<{ id: string }>();

	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		phone: '',
		address: '',
		zipCode: '',
		city: '',
		state: '',
		country: 'Pakistan',
		addressLabel: 'Home',
		makeDefault: false,
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchAddress = async () => {
			if (!id) return;
			try {
				const addr = await AddressService.getById(id);
				setFormData({
					name: addr.name,
					email: addr.email,
					phone: addr.phone,
					address: addr.fullAddress,
					zipCode: addr.postalCode,
					city: addr.city,
					state: addr.province,
					country: addr.country,
					addressLabel: addr.label,
					makeDefault: addr.isDefault,
				});
			} catch (err) {
				console.error(err);
				Alert.alert('Error', 'Failed to fetch address');
				router.back();
			} finally {
				setLoading(false);
			}
		};

		fetchAddress();
	}, [id]);

	const handleUpdate = async () => {
		setSaving(true);
		try {
			await AddressService.update(id, {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				fullAddress: formData.address,
				postalCode: formData.zipCode,
				city: formData.city,
				province: formData.state,
				country: formData.country,
				label: formData.addressLabel,
				isDefault: formData.makeDefault,
			});
			Alert.alert('Success', 'Address updated successfully!');
			router.back();
		} catch (err: any) {
			console.error(err);

			notify.error(
				'Failed to update address',
				err.response?.data?.message || 'Please try again'
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <LottieLoadingIndicator />;

	const getAddressLabelArray = (): AddressLabel[] => {
		return AddressLabels.map((item) => item.label);
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<KeyboardAwareScrollView
				contentContainerStyle={{
					paddingBottom: 16,
					paddingTop: 10,
					flexGrow: 1,
					paddingHorizontal: 16,
				}}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
				enableAutomaticScroll={true}
			>
				<CustomInputField
					required
					label="Full Name"
					placeholder="Enter full name"
					value={formData.name}
					onChangeText={(t) => setFormData({ ...formData, name: t })}
				/>
				<View className="mb-6">
					<CustomDropdown
						label="Address Label"
						required
						options={getAddressLabelArray()}
						value={formData.addressLabel}
						onSelect={(val) =>
							setFormData({
								...formData,
								addressLabel: val as FormData['addressLabel'],
							})
						}
					/>

					<CustomInputField
						required
						label="Email"
						placeholder="Enter email address"
						value={formData.email}
						onChangeText={(t) => setFormData({ ...formData, email: t })}
					/>
					<CustomInputField
						required
						label="Phone"
						placeholder="Enter phone number"
						value={formData.phone}
						onChangeText={(t) => setFormData({ ...formData, phone: t })}
					/>
					<CustomInputField
						label="Full Address"
						placeholder="Enter full address"
						value={formData.address}
						onChangeText={(t) => setFormData({ ...formData, address: t })}
					/>
					<CustomInputField
						required
						label="City"
						placeholder="Enter city"
						value={formData.city}
						onChangeText={(t) => setFormData({ ...formData, city: t })}
					/>
					<CustomDropdown
						required
						label="Select Province"
						options={provinces}
						value={formData.state}
						onSelect={(val) => setFormData({ ...formData, state: val })}
					/>
					<CustomInputField
						label="Postal Code"
						placeholder="Enter postal code"
						value={formData.zipCode}
						onChangeText={(t) => setFormData({ ...formData, zipCode: t })}
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
							onValueChange={(v) =>
								setFormData({ ...formData, makeDefault: v })
							}
							trackColor={{
								false: COLORS.gray[300],
								true: COLORS.light.pallete[500],
							}}
							thumbColor={formData.makeDefault ? '#ffffff' : '#f3f4f6'}
							ios_backgroundColor="#e5e7eb"
						/>
					</View>
				</View>
				<View className="mb-2">
					<CustomButton
						label="Update Address"
						onPress={handleUpdate}
						loading={saving}
						bgVariant="primary"
						className="p-4"
					/>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default EditAddressScreen;
