import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import OrderStep from '@/components/OrderSteps';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { AddressService } from '@/services/address.services';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import {
	FlatList,
	Image,
	Modal,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const Checkout: React.FC = () => {
	// Find the default address ID
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	// CHANGED: state to hold addresses from backend
	const [addresses, setAddresses] = useState<any[]>([]); // replace any with Address if typed
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editData, setEditData] = useState<any>(null);

	const [isLoadingAddrs, setIsLoadingAddrs] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	// CHANGED: fetch addresses from backend on screen focus
	useFocusEffect(
		React.useCallback(() => {
			let mounted = true;
			const load = async () => {
				setIsLoadingAddrs(true);
				try {
					const list = await AddressService.getAllAddresses();
					if (!mounted) return;
					setAddresses(list || []);
					// select default if present, else keep previous selection or first item
					const def = list.find((a) => a.isDefault);
					if (def) setSelectedId(def._id ?? def._id ?? null);
					else if (!selectedId && list.length > 0)
						setSelectedId(list[0]._id ?? list[0]._id ?? null);
				} catch (err) {
					console.error('Failed to load addresses', err);
					Toast.show({
						type: 'error',
						text1: 'Addresses',
						text2: 'Could not load addresses. Please try again.',
					});
				} finally {
					if (mounted) setIsLoadingAddrs(false);
				}
			};

			load();

			return () => {
				mounted = false;
			};
		}, [selectedId])
	);
	// CHANGED: open editor modal with item
	const handleEdit = (item: any) => {
		setEditData({ ...item });
		setIsModalVisible(true);
	};

	// CHANGED: open modal for adding new address (empty editData)
	const handleAddNew = () => {
		setEditData({
			name: '',
			fullAddress: '',
			apt: '',
			zip: '',
			city: '',
			state: '',
			phone: '',
		});
		setIsModalVisible(true);
	};

	// CHANGED: save (create or update) using AddressService
	const handleSave = async () => {
		try {
			setIsSaving(true);
			if (editData?._id || editData?.id) {
				// update
				const id = editData._id ?? editData.id;
				await AddressService.update(id, {
					name: editData.name,
					fullAddress: editData.fullAddress,
					apt: editData.apt,
					zip: editData.zip,
					city: editData.city,
					state: editData.state,
					phone: editData.phone,
				});
				Toast.show({ type: 'success', text1: 'Address updated' });
			} else {
				// create
				await AddressService.create({
					name: editData.name,
					fullAddress: editData.fullAddress,
					apt: editData.apt,
					zip: editData.zip,
					city: editData.city,
					state: editData.state,
					phone: editData.phone,
				} as any);
				Toast.show({ type: 'success', text1: 'Address added' });
			}
			// refresh list
			const list = await AddressService.getAllAddresses();
			setAddresses(list || []);
			// close modal
			setIsModalVisible(false);
		} catch (err) {
			console.error('Failed to save address', err);
			Toast.show({
				type: 'error',
				text1: 'Address',
				text2: 'Failed to save address. Try again.',
			});
		} finally {
			setIsSaving(false);
		}
	};

	// CHANGED: set address as default
	const handleSetDefault = async (id: string) => {
		try {
			await AddressService.setDefault(id);
			const list = await AddressService.getAllAddresses();
			setAddresses(list || []);
			setSelectedId(id);
			Toast.show({ type: 'success', text1: 'Default address updated' });
		} catch (err) {
			console.error('Failed to set default', err);
			Toast.show({
				type: 'error',
				text1: 'Address',
				text2: 'Failed to set default. Try again.',
			});
		}
	};

	// CHANGED: delete address
	const handleDelete = async (id: string) => {
		try {
			await AddressService.delete(id);
			const list = await AddressService.getAllAddresses();
			setAddresses(list || []);
			// adjust selectedId if deleted
			if (selectedId === id) {
				const def = list.find((a) => a.isDefault);
				setSelectedId(
					def?._id ?? def?._id ?? list[0]?._id ?? list[0]?._id ?? null
				);
			}
			Toast.show({ type: 'success', text1: 'Address deleted' });
		} catch (err) {
			console.error('Failed to delete address', err);
			Toast.show({
				type: 'error',
				text1: 'Address',
				text2: 'Failed to delete address. Try again.',
			});
		}
	};

	const proceedNext = () => {
		// pass selectedId as param so confirm screen can use it if needed
		router.push({
			pathname: '/cart/confirm-order',
			params: { addressId: selectedId },
		});
	};

	return (
		<View className="flex-1 bg-light-screen dark:bg-gray-950">
			{/* OrderSteps */}
			<View className="flex-row items-center justify-center gap-x-3 py-4 border-b border-t border-gray-200 dark:border-gray-700 -mx-3">
				<OrderStep number={1} label="Select Address" isActive />
				<Ionicons
					name="chevron-forward-outline"
					color={COLORS.gray[400]}
					size={16}
				/>
				<OrderStep number={2} label="Confirm Order" />
			</View>

			{/* Addresses */}
			{isLoadingAddrs ? (
				<View className="flex-1 justify-center items-center">
					<LottieLoadingIndicator message="Loading addresses..." />
				</View>
			) : (
				<FlatList
					data={addresses}
					keyExtractor={(item) => (item._id ?? item.id).toString()}
					renderItem={({ item }) => {
						const isSelected = selectedId === item._id;
						return (
							<TouchableOpacity
								onPress={() => setSelectedId(item._id)}
								activeOpacity={0.6}
								className={`flex-row items-center border p-3 rounded-lg mb-2 ${
									isSelected
										? 'bg-light-surface dark:bg-light-pallete-950/40 border-light-pallete-500 dark:border-light-pallete-400'
										: 'bg-light-surface dark:bg-gray-950 border-transparent'
								}`}
							>
								{/* Radio button */}
								<View
									className={`w-5 h-5 rounded-full border-[1.25px] mr-3 justify-center items-center ${
										isSelected
											? 'border-light-pallete-500 dark:border-light-pallete-400'
											: 'border-gray-400 dark:border-gray-600'
									}`}
								>
									{isSelected && (
										<View className="w-2.5 h-2.5 rounded-full bg-light-pallete-500 dark:bg-light-pallete-400" />
									)}
								</View>

								{/* Address Info */}
								<View className="flex-1 gap-y-1">
									<View className="flex-row justify-between items-center flex-wrap">
										<View className="flex-row gap-x-2">
											<Text className="text-body font-nexa-bold text-gray-900 dark:text-gray-50">
												{item.name}
											</Text>
											<Text className="text-body-sm font-nexa text-gray-500 dark:text-gray-400">
												{item.phone}
											</Text>
										</View>

										{/* Default Badge */}
										{item.isDefault && (
											<View className="bg-light-pallete-100 dark:bg-light-pallete-700 px-2 py-0.5 rounded-md">
												<Text className="text-body-xs font-nexa-bold text-light-pallete-600 dark:text-light-pallete-300">
													Default
												</Text>
											</View>
										)}
									</View>

									<Text className="text-body-xs leading-5 text-gray-400 dark:text-gray-400">
										{item.fullAddress}
									</Text>
								</View>

								<TouchableOpacity
									onPress={() => handleEdit(item)} // CHANGED: pass item to handler
									className="items-center justify-center w-5 h-5"
								>
									<Image
										source={icons.edit}
										className="w-6 h-6"
										tintColor={isDark ? COLORS.gray[50] : COLORS.gray[950]}
									/>
								</TouchableOpacity>
							</TouchableOpacity>
						);
					}}
					contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
					ListEmptyComponent={() => (
						<View className="px-4 py-6">
							<Text className="text-gray-600">
								No saved addresses yet. Add one to continue.
							</Text>
							<CustomButton
								label="Add New Address"
								onPress={handleAddNew}
								// loading={isProcessing}
								// disabled={isProcessing || cartItems.length === 0}
								bgVariant="primary"
								textVariant="secondary"
								className="py-4"
							/>
						</View>
					)}
				/>
			)}

			{/* Continue Button */}
			<View className="px-4 py-4 bg-light-screen dark:bg-gray-950  absolute bottom-0 left-0 w-full">
				<CustomButton
					label="Continue"
					onPress={proceedNext}
					// loading={isProcessing}
					// disabled={isProcessing || cartItems.length === 0}
					bgVariant="primary"
					textVariant="secondary"
					className="py-4"
				/>
			</View>

			{/* Edit Modal */}
			<Modal
				visible={isModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View className="flex-1 bg-black/50 justify-end">
					<View className="bg-light-screen dark:bg-gray-950 rounded-t-2xl px-4 py-6 max-h-[85%]">
						<View className="flex-row px-4 border-b border-gray-200 -mx-3">
							<Text className="text-body flex-1 text-center font-nexa-extrabold text-gray-900 dark:text-gray-50 mb-4">
								Edit Address
							</Text>
							<TouchableOpacity onPress={() => setIsModalVisible(false)}>
								<Ionicons
									name="close"
									size={20}
									color={isDark ? COLORS.gray[50] : COLORS.gray[950]}
								/>
							</TouchableOpacity>
						</View>

						{/* Inputs */}
						<View className="mt-3">
							<CustomInputField
								placeholder="Name"
								value={editData?.name}
								onChangeText={(text) =>
									setEditData({ ...editData, name: text })
								}
							/>
							<CustomInputField
								placeholder="Full Address"
								value={editData?.fullAddress}
								onChangeText={(text) =>
									setEditData({ ...editData, fullAddress: text })
								}
							/>
							<CustomInputField
								placeholder="Apt / Suite / Other"
								value={editData?.apt || ''}
								onChangeText={(text) => setEditData({ ...editData, apt: text })}
							/>
							<CustomInputField
								placeholder="Zip Code"
								value={editData?.zip || ''}
								onChangeText={(text) => setEditData({ ...editData, zip: text })}
								keyboardType="numeric"
							/>
							<CustomInputField
								placeholder="City"
								value={editData?.city || ''}
								onChangeText={(text) =>
									setEditData({ ...editData, city: text })
								}
							/>
							<CustomInputField
								placeholder="State"
								value={editData?.state || ''}
								onChangeText={(text) =>
									setEditData({ ...editData, state: text })
								}
							/>
							<CustomInputField
								placeholder="Phone Number"
								value={editData?.phone}
								onChangeText={(text) =>
									setEditData({ ...editData, phone: text })
								}
								keyboardType="phone-pad"
							/>
						</View>

						{/* Save Button */}
						<CustomButton
							label="Save"
							onPress={handleSave}
							loading={isSaving} // CHANGED
							bgVariant="primary"
							textVariant="secondary"
							className="py-4"
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default Checkout;
