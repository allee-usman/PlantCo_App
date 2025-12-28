import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { Tabs, useSegments } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
const TabIcon = ({
	focused,
	source,
	name,
	badged,
	badgedContent,
	iconColor,
}: {
	focused: boolean;
	source: ImageSourcePropType;
	name?: string;
	badged?: boolean;
	badgedContent?: string;
	iconColor: string;
}) => {
	if (name === 'scan') {
		return (
			<View className="w-[48px] flex justify-center items-center h-[48px] border-[1.25px] rounded-full border-light-pallete-300 dark:border-light-pallete-400 bg-transparent">
				<View
					className="w-[40px] h-[40px] flex justify-center items-center bg-light-pallete-300 dark:bg-light-pallete-400"
					style={{ borderRadius: 999 }}
				>
					<Image
						source={source}
						resizeMode="contain"
						style={{
							width: 24,
							height: 24,
							tintColor: 'black',
						}}
					/>
				</View>
			</View>
		);
	} else {
		return (
			<View
				style={{
					width: 48,
					height: 48,
					borderRadius: 61,
					justifyContent: 'center',
					alignItems: 'center',
					// backgroundColor: focused ? COLORS.gray[800] : 'transparent',
					backgroundColor: 'transparent',
				}}
			>
				{badged && (
					<View className="z-10 absolute top-2 right-1 w-[18px] h-[18px] bg-red-500 rounded-full flex justify-center items-center">
						<Text className="font-nexa-bold text-white text-[10px] ">
							{badgedContent}
						</Text>
					</View>
				)}
				<Image
					source={source}
					resizeMode="contain"
					style={{
						width: 24,
						height: 24,
						tintColor: iconColor,
					}}
				/>
			</View>
		);
	}
};

export default function Layout() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const segments = useSegments();
	// segments example: ["home"] or ["home", "details"]
	let hideTabBar = segments.length > 2;

	// Exception: allow TabBar on "plant-care/guides"
	// if (segments.join('/') === 'plant-care/guides') {
	// 	hideTabBar = false;
	// }

	const getIconColor = (focused: boolean) => {
		return isDark
			? focused
				? COLORS.light.pallete[400]
				: COLORS.gray[400]
			: focused
			? COLORS.light.pallete[300]
			: COLORS.gray[400];
	};

	const {
		items: cartItems,
		isLoading,
		error,
	} = useAppSelector((state: RootState) => state.cart);
	return (
		<Tabs
			initialRouteName="home"
			screenOptions={{
				tabBarActiveTintColor: 'transparent',
				tabBarInactiveTintColor: 'transparent',
				tabBarShowLabel: false,
				tabBarStyle: [
					{
						backgroundColor: isDark
							? COLORS.light.surface
							: COLORS.light.blackVariant,
						borderRadius: 50,
						paddingBottom: 0, // ios only
						overflow: 'hidden',
						marginHorizontal: 20,
						marginBottom: 20,
						height: 70,
						display: 'flex',
						justifyContent: 'space-around',
						alignItems: 'center',
						flexDirection: 'row',
						position: 'absolute',
					},
					hideTabBar ? { display: 'none' } : null,
				],
				tabBarItemStyle: {
					height: 65,
					padding: 0,
					justifyContent: 'center',
					alignItems: 'center',
				},
				tabBarIconStyle: {
					margin: 13, // reset spacing
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon
							source={focused ? icons.home : icons.homeOutline}
							focused={focused}
							iconColor={getIconColor(focused)}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="plant-care"
				options={{
					title: 'Services',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon
							source={focused ? icons.checklist : icons.checklistOutline}
							focused={focused}
							iconColor={getIconColor(focused)}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="scan"
				options={{
					title: 'Scan',
					headerShown: false,
					tabBarStyle: { display: 'none' },
					tabBarIcon: ({ focused }) => (
						<TabIcon
							source={icons.scan}
							focused={focused}
							name="scan"
							iconColor={getIconColor(focused)}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="cart"
				options={{
					title: 'Cart',
					headerShown: false,
					tabBarStyle: { display: 'none' },
					tabBarIcon: ({ focused }) => (
						<TabIcon
							source={focused ? icons.basket : icons.basketOutline}
							focused={focused}
							badged
							badgedContent={cartItems.length.toString()}
							iconColor={getIconColor(focused)}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: 'Account',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon
							source={focused ? icons.user : icons.userOutline}
							focused={focused}
							iconColor={getIconColor(focused)}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
