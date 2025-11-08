// components/AddressPickerModal.tsx
import { COLORS } from '@/constants/colors';
import { AddressItem } from '@/interfaces/address.interface';
// removed AddressService import (modal no longer fetches)
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import CustomButton from './CustomButton';
// removed LottieLoader import

type Props = {
	visible: boolean;
	onClose: () => void;
	addresses?: AddressItem[]; // now optional, passed from parent
	onSelect: (address: AddressItem) => void;
	initialSelectedId?: string | null;
};

const AddressPickerModal: React.FC<Props> = ({
	visible,
	onClose,
	onSelect,
	initialSelectedId = null,
	addresses = [], // receive addresses from parent
}) => {
	const [selectedId, setSelectedId] = useState<string | null>(
		initialSelectedId
	);

	useEffect(() => {
		// reset selection when initialSelectedId changes or modal toggles
		setSelectedId(initialSelectedId ?? null);
	}, [initialSelectedId, visible]);

	// When modal opens, if nothing selected pick default or first
	useEffect(() => {
		if (!visible) return;
		if (selectedId) return; // keep existing selection if present
		if (!Array.isArray(addresses) || addresses.length === 0) {
			setSelectedId(null);
			return;
		}

		const def =
			addresses.find((a: any) => a.isDefault === true) ??
			addresses.find((a: any) => a.default === true) ??
			addresses.find((a: any) => a.is_default === true);

		const pick = def ?? addresses[0];
		setSelectedId(String(pick._id ?? (pick as any).id ?? ''));
	}, [visible, addresses, selectedId]);

	const getId = (a: AddressItem) => String(a._id ?? a.id ?? '');

	const handleUseSelected = () => {
		const addr = (addresses || []).find((a) => getId(a) === selectedId);
		if (!addr) {
			Toast.show({ type: 'error', text1: 'Select an address' });
			return;
		}
		onSelect(addr);
		onClose();
	};

	const handleSelectRow = (addr: AddressItem) => {
		setSelectedId(getId(addr));
	};

	const EmptyState = useMemo(
		() => (
			<View className="py-6 px-4">
				<Text className="text-gray-500">No saved addresses yet.</Text>
				<TouchableOpacity
					onPress={() => {
						onClose();
						router.push('/cart/add-address');
					}}
					activeOpacity={0.8}
					className="mt-3 px-4 py-3 rounded-lg bg-light-pallete-500"
				>
					<Text className="text-white text-center">Add New Address</Text>
				</TouchableOpacity>
			</View>
		),
		[onClose]
	);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-end">
				<View className="bg-light-screen dark:bg-gray-950 rounded-t-2xl px-4 py-4 max-h-[85%]">
					<View className="flex-row items-center justify-between mb-3">
						<Text className="font-nexa-extrabold text-body">
							Select Address
						</Text>
						<TouchableOpacity onPress={onClose}>
							<Ionicons name="close" size={20} color={COLORS.gray[700]} />
						</TouchableOpacity>
					</View>

					{!addresses || addresses.length === 0 ? (
						EmptyState
					) : (
						<>
							<FlatList
								data={addresses}
								keyExtractor={(i) => getId(i)}
								contentContainerStyle={{ paddingBottom: 12 }}
								renderItem={({ item }) => {
									const id = getId(item);
									const isSelected = selectedId === id;
									return (
										<TouchableOpacity
											onPress={() => handleSelectRow(item)}
											activeOpacity={0.75}
											className={`flex-row items-start p-3 rounded-lg mb-2 ${
												isSelected
													? 'bg-light-surface dark:bg-light-pallete-950/40 border border-light-pallete-500'
													: 'bg-light-surface dark:bg-gray-950'
											}`}
										>
											{/* radio */}
											<View className="mr-3 mt-1">
												<View
													className={`w-5 h-5 rounded-full border-[1.25px] justify-center items-center ${
														isSelected
															? 'border-light-pallete-500'
															: 'border-gray-400'
													}`}
												>
													{isSelected && (
														<View className="w-2.5 h-2.5 rounded-full bg-light-pallete-500" />
													)}
												</View>
											</View>

											{/* info */}
											<View className="flex-1">
												<View className="flex-row justify-between items-start">
													<View>
														<Text className="font-nexa-bold text-body">
															{item.name}
														</Text>
														<Text className="text-body-sm text-gray-500">
															{item.phone}
														</Text>
													</View>

													{(item as any).isDefault && (
														<View className="px-2 py-0.5 rounded-md bg-light-pallete-100">
															<Text className="text-body-xs text-light-pallete-600">
																Default
															</Text>
														</View>
													)}
												</View>

												<Text className="text-body-xs text-gray-400 mt-1">
													{item.fullAddress}
												</Text>
											</View>
										</TouchableOpacity>
									);
								}}
							/>

							<View className="pt-2 flex-row gap-x-3">
								<CustomButton
									label="Add New"
									onPress={() => {
										onClose();
										router.push('/cart/add-address');
									}}
									className="flex-1"
									bgVariant="secondary"
								/>
								<CustomButton
									label="Use Selected"
									onPress={handleUseSelected}
									className="flex-1"
								/>
							</View>
						</>
					)}
				</View>
			</View>
		</Modal>
	);
};

export default AddressPickerModal;
