import { TabType } from '@/interfaces/interface';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface TabSelectorProps {
	activeTab: TabType;
	onTabPress: (tab: TabType) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabPress }) => {
	const tabs: { key: TabType; label: string }[] = [
		{ key: 'all', label: 'All' },
		{ key: 'upcoming', label: 'Upcoming' },
		{ key: 'in_progress', label: 'In Progress' },
		{ key: 'completed', label: 'Completed' },
		{ key: 'cancelled', label: 'Cancelled' },
		{ key: 'rejected', label: 'Rejected' },
	];

	return (
		<View className="mt-2 pb-3 w-full bg-light-screen dark:bg-gray-950">
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 16 }}
			>
				<View className="flex-row w-full justify-center items-center gap-x-3">
					{tabs.map((tab) => (
						<TouchableOpacity
							key={tab.key}
							onPress={() => onTabPress(tab.key)}
							className={`px-4 py-2 border rounded-full ${
								activeTab === tab.key
									? 'bg-light-pallete-500 border-light-pallete-500'
									: 'bg-light-screen border-gray-300 dark:border-gray-700 dark:bg-gray-950'
							}`}
						>
							<Text
								className={`text-body-sm font-nexa-bold ${
									activeTab === tab.key
										? 'text-white'
										: 'text-gray-600 dark:text-gray-400'
								}`}
							>
								{tab.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

export default TabSelector;
