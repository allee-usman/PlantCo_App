import AddressCard from '@/components/AddressItemCard';
import CustomButton from '@/components/CustomButton';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import DynamicModal from '@/components/Modal';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Address } from '@/interfaces/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateAddresses } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { AddressService } from '@/services/address.services';
import { notify } from '@/utils/notification';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';

import {
	FlatList,
	Image,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';

interface MyAddressesScreenProps {
	addresses?: Address[];
	onAddNewAddress: () => void;
	onEditAddress: (id: string) => void;
	onDeleteAddress: (id: string) => void;
	onSetDefaultAddress: (id: string) => void;
	onBack: () => void;
}

// Main Screen Component
const MyAddressesScreen: React.FC<MyAddressesScreenProps> = ({
	onAddNewAddress,
}) => {
	//redux
	const dispatch = useAppDispatch();
	const { colorScheme } = useColorScheme();
	const { user } = useAppSelector((state: RootState) => state.auth);
	const [loading, setLoading] = useState<boolean>(true);
	const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
		null
	);

	const isDark = colorScheme === 'dark';

	useFocusEffect(
		React.useCallback(() => {
			const fetchAddresses = async () => {
				setLoading(true);
				try {
					const addresses = await AddressService.getAllAddresses();
					setAddresses(addresses);
					dispatch(updateAddresses(addresses));
				} catch (err) {
					console.error(err);
				} finally {
					setLoading(false);
				}
			};
			fetchAddresses();
		}, [dispatch])
	);

	//  If loading, only show the indicator
	if (loading) {
		return <LottieLoadingIndicator message="Fetching addresses..." />;
	}

	const handleSetDefault = async (selectedId: string) => {
		try {
			const addresses = await AddressService.setDefault(selectedId);
			setAddresses(addresses);
			dispatch(updateAddresses(addresses));
			notify.success('Default address updated successfully');
		} catch (err) {
			console.error(err);
			notify.error('Failed to update address', 'Please try again');
		}
	};

	const handleEditAddress = (address: Address) => {
		router.push({
			pathname: `/(root)/account/addresses/edit`,
			params: { id: address._id },
		});
	};

	const confirmDelete = (addressId: string) => {
		setSelectedAddressId(addressId);
		setShowModal(true);
	};

	const handleDelete = async (addressId: string) => {
		try {
			const addresses = await AddressService.delete(addressId);
			setAddresses(addresses);
			dispatch(updateAddresses(addresses));
			notify.success('Address deleted successfully');
			setShowModal(false);
		} catch (error: any) {
			console.error('Delete error:', error.message);
			notify.error(
				'Failed to delete address',
				error.response?.data?.message || 'Please try again'
			);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<View className="flex-1">
				{/* Address List */}
				<FlatList
					data={addresses}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
						<AddressCard
							address={item}
							onEdit={handleEditAddress}
							onDelete={confirmDelete}
							onSetDefault={handleSetDefault}
						/>
					)}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 20,
						paddingBottom: 100,
						flexGrow: 1,
						paddingHorizontal: 16,
					}}
					ListEmptyComponent={
						<View className="flex-1 justify-center items-center py-20">
							<Image
								source={icons.location}
								className="w-[80px] h-[80px]"
								tintColor={COLORS.light.pallete[500]}
							/>
							<Text className="text-lg font-nexa-extrabold text-gray-800 dark:text-gray-200 mt-4">
								No saved addresses
							</Text>
							<Text className="text-gray-500 dark:text-gray-400 text-center leading-5 text-sm font-nexa mt-3 px-8">
								Looks like you haven&apos;t added any addresses yet. Add one now
								to make checkout faster!
							</Text>
							<CustomButton
								label="Add new address"
								bgVariant="primary"
								textVariant="secondary"
								onPress={onAddNewAddress}
								className="mt-6 px-7 py-4"
							/>
						</View>
					}
				/>

				{/* Floating Add New Address Button */}
				{addresses.length > 0 && (
					<View className="absolute bottom-0 left-0 right-0 p-5 bg-light-screen dark:bg-gray-950">
						<CustomButton
							label="Add new address"
							// loading={isLoading}
							onPress={() => router.push(`/(root)/account/addresses/add`)}
							bgVariant="primary"
							className="py-4 px-4"
							// disabled={isLoading}
						/>
					</View>
				)}
			</View>

			{/* Delete Confirmation Modal */}
			<DynamicModal
				visible={showModal}
				title="Delete Address?"
				description="Are you sure you want to delete this address? This action cannot be undone."
				icon={
					<Ionicons
						name="warning"
						size={70}
						color={isDark ? COLORS.gray[100] : COLORS.light.blackVariant} //TODO: Fix the color to warning
					/>
				}
				primaryButton={{
					label: 'Delete',
					// onPress: handleDelete,
					onPress: () => handleDelete(selectedAddressId!),
					className: 'bg-red-600',
					textClassName: 'text-white',
				}}
				secondaryButton={{
					label: 'Cancel',
					onPress: () => setShowModal(false),
					className: 'border border-gray-200',
				}}
			/>
		</SafeAreaView>
	);
};

export default MyAddressesScreen;
