// components/NotificationItem.tsx - Updated version
import { COLORS } from '@/constants/colors';
import React from 'react';
import { AccessibilityRole, Switch, Text, View } from 'react-native';

interface NotificationItemType {
	id: number;
	title: string;
	description: string;
	enabled: boolean;
}

interface NotificationItemProps {
	item: NotificationItemType;
	onToggle: (id: number) => void;
	// Add these optional props
	disabled?: boolean;
	accessibilityLabel?: string;
	accessibilityHint?: string;
	accessibilityRole?: AccessibilityRole;
	accessibilityState?: {
		checked?: boolean;
		disabled?: boolean;
	};
}

const NotificationItem: React.FC<NotificationItemProps> = ({
	item,
	onToggle,
	disabled = false, // Default to false
	accessibilityLabel,
	accessibilityHint,
	accessibilityRole,
	accessibilityState,
}) => {
	const handleToggle = () => {
		if (!disabled) {
			onToggle(item.id);
		}
	};

	return (
		<View
			className={`flex-row items-center justify-between px-4 py-4 rounded-xl bg-light-surface mb-4 dark:bg-gray-800 ${
				disabled ? 'opacity-50' : ''
			}`}
			accessibilityLabel={accessibilityLabel}
			accessibilityHint={accessibilityHint}
			accessibilityRole={accessibilityRole}
			accessibilityState={accessibilityState}
		>
			<View className="flex-1">
				<Text className="text-body font-nexa-bold text-gray-900 dark:text-white">
					{item.title}
				</Text>
				<Text className="text-body-xs mt-1 font-nexa-book text-gray-600 dark:text-gray-400">
					{item.description}
				</Text>
			</View>
			<Switch
				value={item.enabled}
				onValueChange={handleToggle}
				disabled={disabled}
				trackColor={{
					false: COLORS.gray[300],
					true: COLORS.light.pallete[500],
				}}
				thumbColor={item.enabled ? '#ffffff' : '#f3f4f6'}
				ios_backgroundColor="#e5e7eb"
			/>
		</View>
	);
};

export default NotificationItem;
