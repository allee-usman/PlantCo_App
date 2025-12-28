import { AvailabilityStatus } from '@/types/user.types';
import { Text, View } from 'react-native';

const STATUS_CONFIG: Record<
	AvailabilityStatus,
	{
		bg: string;
		text: string;
		label: string;
		dot: string;
	}
> = {
	available: {
		bg: 'bg-green-50 dark:bg-green-900/20',
		text: 'text-green-700 dark:text-green-400',
		label: 'Available',
		dot: '#10B981',
	},
	busy: {
		bg: 'bg-orange-50 dark:bg-orange-900/20',
		text: 'text-orange-700 dark:text-orange-400',
		label: 'Busy',
		dot: '#F97316',
	},
	on_leave: {
		bg: 'bg-gray-50 dark:bg-gray-800',
		text: 'text-gray-700 dark:text-gray-400',
		label: 'On Leave',
		dot: '#6B7280',
	},
};

const StatusBadge: React.FC<{ status: AvailabilityStatus }> = ({ status }) => {
	const currentConfig = STATUS_CONFIG[status];

	return (
		<View
			className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${currentConfig.bg}`}
		>
			<View
				style={{
					width: 8,
					height: 8,
					borderRadius: 4,
					backgroundColor: currentConfig.dot,
				}}
			/>
			<Text className={`text-xs font-nexa-bold ${currentConfig.text}`}>
				{currentConfig.label}
			</Text>
		</View>
	);
};
export default StatusBadge;
