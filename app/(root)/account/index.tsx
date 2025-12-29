import InfoModal from '@/components/InfoModal';
import MenuGroupList from '@/components/MenuGroupList';
import ProfileHeader from '@/components/ProfileHeader';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { MenuGroup, MenuItem } from '@/interfaces/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

const appVersion = Constants.manifest?.version || '1.0.0';

const ProfileScreen: React.FC = () => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const [showModal, setShowModal] = useState<boolean>(false);

	//redux
	const dispatch = useAppDispatch();
	const { user, isLoading } = useAppSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (!isLoading && !user) {
			router.replace('/(auth)/login');
		}
	}, [user, isLoading]);

	// const [appVersion, setAppVersion] = useState<string>('...');

	// useEffect(() => {
	// 	const fetchVersion = async () => {
	// 		try {
	// 			const res = await fetch('https://yourapi.com/api/version');
	// 			const data = await res.json();
	// 			setAppVersion(data.version);
	// 		} catch (err) {
	// 			setAppVersion('1.0.0'); // fallback
	// 		}
	// 	};
	// 	fetchVersion();
	// }, []);

	const handleSignout = () => {
		setShowModal(true);
	};

	const handleMenuPress = (item: MenuItem): void => {
		switch (item.title) {
			case 'Theme':
				router.push('/account/theme-settings');
				break;
			case 'Logout':
				// Handle sign-out logic, e.g., clear tokens and navigate to login
				handleSignout();
				break;
			case 'Order History':
				router.push('/(root)/account/order-history');
				break;
			case 'My Bookings':
				router.push('/(root)/account/my-bookings');
				break;
			case 'My Wishlist':
				router.push('/(root)/account/wishlist');
				break;
			case 'My Addresses':
				router.push('/(root)/account/addresses');
				break;
			case 'Credit Cards':
				router.push('/(root)/account/payments');
				break;
			case 'Transactions':
				router.push('/(root)/account/transactions');
				break;
			case 'Notifications':
				router.push('/(root)/account/settings');
				break;
			case 'Help':
				router.push('/(root)/account/help');
				break;
			case 'FAQs':
				router.push('/(root)/account/faqs');
				break;
			case 'Change Email Address':
				router.push('/(root)/account/change-email');
				break;
			case 'Change Password':
				router.push('/account/change-password');
				break;
			case 'Legal Information':
				router.push({ pathname: '/(root)/account/legal-information' }); //TODO: Fix path issue
				break;
			default:
				console.log(`Default Pressed: ${item.title}`);
				break;
		}
	};

	const menuGroups = useMemo<MenuGroup[]>(
		() => [
			{
				id: 'security',
				title: 'Password & Security',
				items: [
					{
						id: 'password',
						title: 'Change Password',
						icon: icons.password,
						iconSize: 16,
					},
					{
						id: 'email',
						title: 'Change Email Address',
						icon: icons.email,
						iconSize: 20,
					},
				],
			},
			{
				id: 'history',
				title: 'Orders & Bookings',
				items: [
					{
						id: 'orders',
						title: 'Order History',
						icon: icons.basketOutline,
						iconSize: 20,
					},
					{
						id: 'bookings',
						title: 'My Bookings',
						icon: icons.calendar,
						iconSize: 18,
					},
				],
			},
			{
				id: 'preferences',
				title: 'Personal & Preferences',
				items: [
					{
						id: 'wishlist',
						title: 'My Wishlist',
						icon: icons.heartOutline,
						iconSize: 22,
					},
					{
						id: 'addresses',
						title: 'My Addresses',
						icon: icons.locationOutline,
						iconSize: 20,
					},
				],
			},
			{
				id: 'payments',
				title: 'Payment & Transactions',
				items: [
					{
						id: 'cards',
						title: 'Credit Cards',
						icon: icons.wallet,
						iconSize: 20,
					},
					{
						id: 'transactions',
						title: 'Transactions',
						icon: icons.invoice,
						iconSize: 20,
					},
				],
			},
			{
				id: 'settings',
				title: 'App Settings',
				items: [
					{
						id: 'notifications',
						title: 'Notifications',
						icon: icons.notificationOutline,
						iconSize: 22,
					},
					{
						id: 'theme',
						title: 'Theme',
						icon: isDark ? icons.darkMode : icons.lightMode,
						iconSize: 22,
					},
				],
			},
			{
				id: 'support',
				title: 'Support',
				items: [
					{ id: 'help', title: 'Help', icon: icons.helpOutline, iconSize: 24 },
					{
						id: 'legalInfo',
						title: 'Legal Information',
						icon: icons.legal,
						iconSize: 18,
					},
					{ id: 'faqs', title: 'FAQs', icon: icons.faqs, iconSize: 22 },
				],
			},
			{
				id: 'session',
				title: 'Session',
				items: [
					{ id: 'logout', title: 'Logout', icon: icons.logout, iconSize: 22 },
				],
			},
		],
		[isDark]
	);

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<ScrollView
				contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
				className="flex-1 px-5"
				showsVerticalScrollIndicator={false}
			>
				{/* Profile Section */}
				<ProfileHeader user={user} isDark={isDark} />

				{/* Menu Groups */}
				<MenuGroupList
					menuGroups={menuGroups}
					isDark={isDark}
					onItemPress={handleMenuPress}
				/>

				{/* Version */}
				<View className="items-center py-5">
					<Text className="text-caption font-nexa text-gray-500">
						Version {appVersion}
					</Text>
				</View>
			</ScrollView>

			<InfoModal
				visible={showModal}
				type="warning"
				title="Confirm Logout?"
				description="Are you sure you want to logout? You will need to login again to access your account."
				primaryButton={{
					label: 'Logout',
					onPress: async () => {
						setShowModal(false);
						await dispatch(logoutUser());
						router.replace('/(auth)/login');
					},
					variant: 'danger',
				}}
				secondaryButton={{
					label: 'Cancel',
					onPress: () => setShowModal(false),
				}}
				iconColor={COLORS.state.error}
			/>
		</SafeAreaView>
	);
};

export default ProfileScreen;
