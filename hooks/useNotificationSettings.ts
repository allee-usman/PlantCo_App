// hooks/useNotificationSettings.ts
import {
	NotificationSettingsActions,
	NotificationSettingsState,
} from '@/interfaces/ui/notificationTypes';
import { useCallback, useState } from 'react';

interface UseNotificationSettingsReturn
	extends NotificationSettingsState,
		NotificationSettingsActions {
	isLoading: boolean;
	hasChanges: boolean;
}

export const useNotificationSettings = (): UseNotificationSettingsReturn => {
	// Initial state
	const initialState: NotificationSettingsState = {
		allowNotifications: true,
		emailNotifications: false,
		orderNotifications: false,
		generalNotifications: true,
	};

	const [settings, setSettings] =
		useState<NotificationSettingsState>(initialState);
	const [originalSettings] = useState<NotificationSettingsState>(initialState);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Check if there are unsaved changes
	const hasChanges =
		JSON.stringify(settings) !== JSON.stringify(originalSettings);

	const toggleSetting = useCallback(
		(settingId: keyof NotificationSettingsState) => {
			setSettings((prev) => ({
				...prev,
				[settingId]: !prev[settingId],
			}));
		},
		[]
	);

	const saveSettings = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			console.log('Settings saved:', settings);

			// In a real app, you would update the originalSettings here
			// setOriginalSettings(settings);
		} catch (error) {
			console.error('Error saving notification settings:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [settings]);

	const resetSettings = useCallback(() => {
		setSettings(originalSettings);
	}, [originalSettings]);

	return {
		// State
		allowNotifications: settings.allowNotifications,
		emailNotifications: settings.emailNotifications,
		orderNotifications: settings.orderNotifications,
		generalNotifications: settings.generalNotifications,
		isLoading,
		hasChanges,

		// Actions
		toggleSetting,
		saveSettings,
		resetSettings,
	};
};
