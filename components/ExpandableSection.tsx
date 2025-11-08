import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';

interface ExpandableSectionProps {
	title: string;
	expanded: boolean;
	onToggle: () => void;
	children: ReactNode;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
	title,
	expanded,
	onToggle,
	children,
}) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<>
			<Pressable
				onPress={onToggle}
				className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
			>
				<Text className="text-base font-nexa-bold text-gray-900 dark:text-gray-100">
					{title}
				</Text>
				<Ionicons
					name={expanded ? 'chevron-up' : 'chevron-down'}
					size={20}
					color={isDark ? '#9CA3AF' : COLORS.gray[400]}
				/>
			</Pressable>
			{expanded && <View className="py-4">{children}</View>}
		</>
	);
};
