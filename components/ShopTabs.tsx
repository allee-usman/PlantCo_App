import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface TabItem {
	id: string;
	label: string;
}

interface ShopTabProps {
	tabs: TabItem[];
	activeTabId: string;
	onTabPress: (tabId: string) => void;
	isDark?: boolean;
}

// Improved Tabs Component
const ShopTabs: React.FC<ShopTabProps> = ({
	tabs,
	activeTabId,
	onTabPress,
	isDark = false,
}) => {
	const renderTab = (tab: TabItem) => {
		const isActive = tab.id === activeTabId;

		return (
			<TouchableOpacity
				key={tab.id}
				onPress={() => onTabPress(tab.id)}
				className="flex-1"
				activeOpacity={0.3}
			>
				<View className="items-center">
					<View className="flex-row items-center">
						<Text
							className={`font-nexa text-sm ${
								isActive
									? 'text-light-pallete-500 font-nexa-heavy'
									: 'text-gray-600 dark:text-gray-400'
							}`}
						>
							{tab.label}
						</Text>
					</View>
					{isActive && (
						<Animated.View
							className={`h-[3px]  w-full mt-2 ${
								isActive
									? 'bg-light-pallete-500'
									: 'bg-gray-300 dark:bg-gray-600'
							}`}
						/>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View className="w-full flex-row justify-around px-3 bg-light-screen dark:bg-gray-950">
			{tabs.map(renderTab)}
		</View>
	);
};

export default ShopTabs;
