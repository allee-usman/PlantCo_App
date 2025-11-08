import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Address } from '@/interfaces/types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import AddressTypeBadge from './AddressTypeBadge';

// Interfaces
interface AddressCardProps {
	address: Address;
	onEdit: (address: Address) => void;
	onDelete: (id: string) => void;
	onSetDefault: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
	address,
	onEdit,
	onDelete,
	onSetDefault,
}) => {
	const baseCardStyle =
		'bg-light-surface dark:bg-gray-800 rounded-2xl mb-4 shadow-md border';
	const cardStyle = address.isDefault
		? `${baseCardStyle} border-light-pallete-500 dark:border-light-pallete-600`
		: `${baseCardStyle} border-transparent`;

	const getLocationIcon = (label: string) => {
		switch (label) {
			case 'Home':
				return icons.homeLocation;
			case 'Office':
				return icons.officeLocation;
			case 'University':
				return icons.schoolLocation;
			default:
				return icons.locationOutline;
		}
	};

	return (
		<View className={cardStyle}>
			{/* Top Section - Header with name and badge */}
			<View className="flex-row items-center px-4 pt-3 pb-3 border-b border-gray-200 dark:border-gray-700">
				<View className="w-[64px] h-[64px] bg-light-pallete-50 dark:bg-green-900/30 rounded-full items-center justify-center shadow-sm">
					<Image
						source={getLocationIcon(address.label)}
						className="w-10 h-10"
						tintColor={COLORS.light.pallete[500]}
					/>
				</View>

				<View className="flex-1 flex-col ml-4 gap-y-[2px]">
					{/* name & label */}
					<View className="flex-row justify-between items-center">
						<Text className="text-body font-nexa-extrabold text-gray-950 dark:text-gray-50">
							{address.name}
						</Text>
						<AddressTypeBadge label={address.label} />
					</View>

					{/* phone number */}
					{address.phone && (
						<Text className="text-body-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
							{address.phone}
						</Text>
					)}
					{/* email */}
					{address.email && (
						<Text className="text-body-sm font-nexa text-gray-600 dark:text-gray-400 leading-5">
							{address.email}
						</Text>
					)}
					{address.fullAddress && (
						<Text className="text-body-xs text-gray-600 dark:text-gray-400 leading-5">
							{address.fullAddress}
						</Text>
					)}
				</View>
			</View>

			{/* Bottom Section - Address Details and Actions */}
			<View className="px-4 py-3 flex-row items-center justify-between">
				{/* Default Selector */}
				<TouchableOpacity
					disabled={address.isDefault}
					onPress={() => {
						onSetDefault(address._id);
					}}
					className="flex-row items-center"
				>
					<View className="w-[16px] h-[16px] border-[1.25px] border-gray-300 dark:border-gray-600 rounded-full mr-2 items-center justify-center">
						{address.isDefault && (
							<View className="w-[9px] h-[9px] bg-light-pallete-500 dark:bg-light-pallete-400 rounded-full" />
						)}
					</View>
					<Text className="text-body-sm text-gray-600 dark:text-gray-400">
						{address.isDefault ? 'Default' : 'Set as default'}
					</Text>
				</TouchableOpacity>

				{/* Actions */}
				<View className="flex-row gap-x-3">
					{/* delete btn */}
					<TouchableOpacity
						onPress={() => onDelete(address._id)}
						className="py-1 px-4 rounded-full bg-red-50 dark:bg-red-900/30"
					>
						<Text className="text-red-500 text-sm font-nexa-bold">Delete</Text>
					</TouchableOpacity>
					{/* edit btn */}
					<TouchableOpacity
						onPress={() => onEdit(address)}
						className="py-1 px-4 rounded-full bg-blue-50 dark:bg-blue-700/30"
					>
						<Text className="text-blue-500 text-sm font-nexa-bold">Edit</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default AddressCard;
