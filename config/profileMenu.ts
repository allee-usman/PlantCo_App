import { icons } from '@/constants/icons';
import { MenuGroup } from '@/interfaces/types';

export const menuGroups: MenuGroup[] = [
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
				iconSize: 24,
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
];
