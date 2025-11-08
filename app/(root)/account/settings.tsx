import CustomButton from '@/components/CustomButton';
import LottieLoader from '@/components/LottieLoader';
import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import NotificationItem from '@/components/NotificationSettingItem';
import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { NotificationSettings as NotificationSettingsTypes } from '@/interfaces/types';
import { useAppDispatch } from '@/redux/hooks';
import { updateNotificationSettingsInUser } from '@/redux/slices/authSlice';
import {
	getNotificationSettings,
	updateNotificationSettings,
} from '@/services/user.services';
import { notify } from '@/utils/notification';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useState } from 'react';
import {
	AccessibilityInfo,
	FlatList,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';

type NotificationSettingItem = {
	id: number;
	key: keyof NotificationSettingsTypes;
	title: string;
	description: string;
};
type NotificationSettingsResponse = {
	success: boolean;
	settings: NotificationSettingsTypes;
	message?: string;
};

// Add this component ABOVE NotificationSettings
const ErrorState: React.FC<{
	error: string;
	onRetry: () => void;
	isDark: boolean;
}> = ({ error, onRetry, isDark }) => (
	<SafeAreaView className="flex-1 justify-center items-center bg-light-screen dark:bg-gray-950 px-5">
		<StatusBar
			backgroundColor="transparent"
			barStyle={isDark ? 'light-content' : 'dark-content'}
		/>
		<View className="items-center p-6">
			<View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 w-full">
				<Text className="text-red-600 dark:text-red-400 text-center text-base font-medium mb-2">
					Failed to Load Settings
				</Text>
				<Text className="text-red-500 dark:text-red-300 text-center text-sm">
					{error}
				</Text>
			</View>
			<CustomButton
				onPress={onRetry}
				label="Retry"
				className="px-4 w-[100px] h-[45px]"
				accessibilityLabel="Retry loading notification settings"
				accessibilityRole="button"
			/>
		</View>
	</SafeAreaView>
);

// Map UI items -> backend keys
const ITEMS: NotificationSettingItem[] = [
	{
		id: 1,
		key: 'enableNotifications',
		title: 'Enable Notifications',
		description: 'Toggle all app notifications.',
	},
	{
		id: 2,
		key: 'emailAlerts',
		title: 'Email Alerts',
		description: 'Receive important updates via email.',
	},
	{
		id: 3,
		key: 'orderAlerts',
		title: 'Order Alerts',
		description: 'Get notified about your order status.',
	},
	{
		id: 4,
		key: 'generalAlerts',
		title: 'General Alerts',
		description: 'General updates and news.',
	},
];

const NotificationSettings: React.FC = () => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const dispatch = useAppDispatch();

	const [settings, setSettings] = useState<NotificationSettingsTypes | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [shouldAnnounceLoading, setShouldAnnounceLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	// Load current notification settings
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				setLoading(true);
				const data = await getNotificationSettings();

				setSettings(data);
				setError(null);
			} catch (err: any) {
				console.error('Error loading notification settings:', err);

				setError(
					err?.response?.data?.message ||
						err.message ||
						'Failed to load notification settings'
				);
				notify.error('Error', 'Failed to load notifications, please try again');
				// router.back();
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, []);

	useEffect(() => {
		if (shouldAnnounceLoading && saving) {
			AccessibilityInfo.announceForAccessibility(
				'Saving notification settings'
			);
			setShouldAnnounceLoading(false);
		}
	}, [saving, shouldAnnounceLoading]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		try {
			const data = await getNotificationSettings();
			setSettings(data);
			setError(null);
			notify.success('Refreshed', 'Notification settings updated');
		} catch (err: any) {
			console.error('Error refreshing notification settings:', err);
			notify.error('Refresh failed', 'Could not refresh settings');
		} finally {
			setRefreshing(false);
		}
	}, []);

	// Toggle a setting and sync with backend
	// Replace your current toggleSetting function with this memoized version:
	const toggleSetting = useCallback(
		async (key: keyof NotificationSettingsTypes) => {
			if (!settings || saving) return;

			// Add haptic feedback
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			// Store original settings for proper rollback
			const originalSettings = { ...settings };
			const updatedSettings: NotificationSettingsTypes = {
				...settings,
				[key]: !settings[key],
			};

			// Optimistic UI update
			setSettings(updatedSettings);
			setSaving(true);
			setShouldAnnounceLoading(true);

			try {
				console.log(updatedSettings);

				const response = (await updateNotificationSettings(
					updatedSettings
				)) as NotificationSettingsResponse;

				// Better response handling
				const newSettings = response.settings || updatedSettings;

				setSettings(newSettings);
				dispatch(updateNotificationSettingsInUser(newSettings));
				notify.success('Saved', 'Notification settings updated.');
			} catch (err: any) {
				console.error('Error updating notification settings:', err);
				notify.error(
					'Update failed',
					err?.response?.data?.message ||
						err.message ||
						'Could not save notification settings'
				);
				// Proper rollback using original settings
				setSettings(originalSettings);
			} finally {
				setSaving(false);
			}
		},
		[settings, saving, dispatch]
	); // Add dependencies here

	const renderItem = useCallback(
		({ item }: { item: NotificationSettingItem }) => (
			<NotificationItem
				item={{
					id: item.id,
					title: item.title,
					description: item.description,
					enabled: !!settings?.[item.key],
				}}
				onToggle={() => toggleSetting(item.key)}
				disabled={saving}
				// Add accessibility props
				accessibilityLabel={`${item.title}: ${
					settings?.[item.key] ? 'enabled' : 'disabled'
				}`}
				accessibilityHint={`Double tap to ${
					settings?.[item.key] ? 'disable' : 'enable'
				} ${item.title.toLowerCase()}`}
				accessibilityRole="switch"
				accessibilityState={{
					checked: !!settings?.[item.key],
					disabled: saving,
				}}
			/>
		),
		[settings, saving, toggleSetting]
	);

	if (loading) {
		return <LottieLoadingIndicator />;
	}

	if (error || !settings) {
		return (
			<ErrorState
				error={error || 'Failed to load settings'}
				onRetry={() => {
					setError(null);
					setLoading(true);
					// Re-fetch settings
					const fetchSettings = async () => {
						try {
							const data = await getNotificationSettings();
							setSettings(data);
							setError(null);
						} catch (err: any) {
							console.error('Error loading notification settings:', err);
							setError(
								err?.response?.data?.message ||
									err.message ||
									'Failed to load notification settings'
							);
						} finally {
							setLoading(false);
						}
					};
					fetchSettings();
				}}
				isDark={isDark}
			/>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950 px-5">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<View className="flex-1 pt-4">
				<FlatList
					data={ITEMS}
					renderItem={renderItem}
					keyExtractor={(it) => it.id.toString()}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 20 }}
					refreshing={refreshing}
					onRefresh={onRefresh}
					accessibilityLabel="Notification settings list"
					accessible={false} // Let individual items be accessible instead
				/>
				{saving && (
					<View className="absolute bottom-6 left-0 right-0 items-center">
						<View className="bg-light-pallete-400 px-4 py-1 rounded-full flex-row items-center">
							<LottieLoader
								animation={animations.spinner}
								color={COLORS.gray[800]}
							/>
							<Text className="text-body-sm text-gray-800  font-nexa-bold">
								Saving...
							</Text>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
};

export default NotificationSettings;
