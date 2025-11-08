// components/NotificationItem.tsx
import React from 'react';
import { Switch, Text, View } from 'react-native';

interface NotificationItemProps {
	title: string;
	description: string;
	enabled: boolean;
	hasToggle: boolean;
	onToggle?: (enabled: boolean) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
	title,
	description,
	enabled,
	hasToggle,
	onToggle,
}) => {
	return (
		<View className="bg-light-surface dark:bg-gray-800 rounded-2xl p-5 mb-4">
			<View className="flex-row items-start justify-between">
				<View className="flex-1 pr-4">
					<Text className="text-heading-6 mb-2 text-light-title dark:text-dark-title">
						{title}
					</Text>
					<Text className="text-body-sm text-gray-600 dark:text-gray-400 leading-5">
						{description}
					</Text>
				</View>

				{hasToggle && (
					<Switch
						value={enabled}
						onValueChange={onToggle}
						trackColor={{
							false: '#d1d5db',
							true: '#10b981',
						}}
						thumbColor={enabled ? '#ffffff' : '#f3f4f6'}
						ios_backgroundColor="#d1d5db"
						accessibilityLabel={`Toggle ${title}`}
					/>
				)}
			</View>
		</View>
	);
};

export default NotificationItem;
