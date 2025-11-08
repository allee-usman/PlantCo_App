// types/notificationTypes.ts

export interface NotificationSetting {
	id: string;
	title: string;
	description: string;
	enabled: boolean;
	hasToggle: boolean;
}

export interface NotificationSettingsState {
	allowNotifications: boolean;
	emailNotifications: boolean;
	orderNotifications: boolean;
	generalNotifications: boolean;
}

export interface NotificationSettingsActions {
	toggleSetting: (settingId: keyof NotificationSettingsState) => void;
	saveSettings: () => Promise<void>;
	resetSettings: () => void;
}
