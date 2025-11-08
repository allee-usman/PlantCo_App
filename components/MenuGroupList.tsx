import { COLORS } from '@/constants/colors';
import { MenuGroup, MenuItem } from '@/interfaces/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface MenuGroupListProps {
	menuGroups: MenuGroup[];
	isDark: boolean;
	onItemPress: (item: MenuItem) => void;
}

const MenuGroupList: React.FC<MenuGroupListProps> = ({
	menuGroups,
	isDark,
	onItemPress,
}) => {
	// Section header
	const renderSectionHeader = (title: string) => (
		<View className="mb-3 mt-6 first:mt-0">
			<Text className="text-body-sm font-nexa-bold text-gray-500 dark:text-gray-400 tracking-wider px-2">
				{title}
			</Text>
		</View>
	);

	// Each menu item
	const renderMenuItem = (
		item: MenuItem,
		isLastInGroup: boolean,
		isFirstInGroup: boolean
	) => {
		const isSignOut = item.title === 'Logout';

		return (
			<View key={item.id}>
				<TouchableOpacity
					className={`flex-row items-center justify-between py-4 px-5 bg-light-surface dark:bg-gray-800 
					${isFirstInGroup ? 'rounded-t-xl' : ''} 
					${isLastInGroup ? 'rounded-b-xl' : ''}`}
					onPress={() => onItemPress(item)}
				>
					<View className="flex-row items-center flex-1">
						<View
							className={`w-[36px] h-[36px] rounded-full flex justify-center items-center mr-4 ${
								isSignOut
									? 'bg-red-100 dark:bg-red-900/30'
									: 'bg-light-pallete-50 dark:bg-green-900/20'
							}`}
						>
							<Image
								source={item.icon}
								style={{ width: item.iconSize, height: item.iconSize }}
								tintColor={
									isSignOut
										? isDark
											? '#ef4444'
											: '#dc2626'
										: COLORS.light.pallete[500]
								}
							/>
						</View>
						<Text
							className={`text-sm font-nexa-bold ${
								isSignOut ? 'text-red-600' : 'text-black dark:text-white'
							}`}
						>
							{item.title}
						</Text>
					</View>

					{/* Chevron (except signout) */}
					{!isSignOut && (
						<Ionicons
							name="chevron-forward"
							size={20}
							color={isDark ? COLORS.gray[200] : COLORS.gray[400]}
						/>
					)}
				</TouchableOpacity>

				{/* Divider */}
				{!isLastInGroup && (
					<View className="h-[1px] bg-gray-200 dark:bg-gray-700 mx-5" />
				)}
			</View>
		);
	};

	return (
		<View>
			{menuGroups.map((group) => (
				<View key={group.id}>
					{renderSectionHeader(group.title)}
					<View className="bg-light-surface dark:bg-gray-800 rounded-xl mb-4">
						{group.items.map((item, itemIndex) =>
							renderMenuItem(
								item,
								itemIndex === group.items.length - 1,
								itemIndex === 0
							)
						)}
					</View>
				</View>
			))}
		</View>
	);
};

export default MenuGroupList;
