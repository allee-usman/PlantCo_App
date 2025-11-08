import { AddressLabel } from '@/interfaces/types';
import { Text, View } from 'react-native';

// Mapping of label → styles
const badgeStyles: Record<AddressLabel, { bg: string; text: string }> = {
	Home: {
		bg: 'bg-purple-100 dark:bg-purple-900',
		text: 'text-purple-600 dark:text-purple-300',
	},
	Work: {
		bg: 'bg-blue-100 dark:bg-blue-900/40',
		text: 'text-blue-600 dark:text-blue-300',
	},
	Office: {
		bg: 'bg-orange-100 dark:bg-orange-700/40',
		text: 'text-orange-600 dark:text-orange-300',
	},
	University: {
		bg: 'bg-violet-100 dark:bg-violet-900',
		text: 'text-violet-600 dark:text-violet-300',
	},
	Friend: {
		bg: 'bg-teal-100 dark:bg-teal-900/40',
		text: 'text-teal-600 dark:text-teal-300',
	},
	Other: {
		bg: 'bg-gray-100 dark:bg-gray-800',
		text: 'text-gray-600 dark:text-gray-300',
	},
};

const AddressTypeBadge: React.FC<{ label: AddressLabel }> = ({ label }) => {
	const { bg, text } = badgeStyles[label] ?? badgeStyles.Other; // fallback to Other

	return (
		<View className={`px-3 py-1 rounded-full ${bg}`}>
			<Text className={`text-xs font-nexa-bold capitalize ${text}`}>
				{label}
			</Text>
		</View>
	);
};

export default AddressTypeBadge;
