import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type TabValue = string;

interface ProfileTabsProps<T extends TabValue> {
	tabs: readonly T[];
	activeTab: T;
	onChange: (tab: T) => void;
	containerClassName?: string;
}

const ProfileTabs = <T extends TabValue>({
	tabs,
	activeTab,
	onChange,
	containerClassName = '',
}: ProfileTabsProps<T>) => {
	return (
		<View
			className={`bg-white dark:bg-gray-900 dark:border-gray-800 mx-4 mb-3 rounded-xl ${containerClassName}`}
		>
			<View className="flex-row p-2">
				{tabs.map((tab) => {
					const isActive = activeTab === tab;

					return (
						<Pressable
							key={tab}
							onPress={() => onChange(tab)}
							className={`flex-1 py-3.5 rounded-xl ${
								isActive ? 'bg-light-pallete-400' : ''
							}`}
						>
							<Text
								className={`text-sm font-nexa-bold text-center ${
									isActive
										? 'text-white dark:text-gray-900'
										: 'text-gray-500 dark:text-gray-400'
								}`}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export default ProfileTabs;
