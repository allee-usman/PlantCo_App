// data/notificationData.ts
import { NotificationSetting } from '@/interfaces/ui/notificationTypes';

export const notificationSettingsData: NotificationSetting[] = [
	{
		id: 'allowNotifications',
		title: 'Allow Notifications',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy',
		enabled: true,
		hasToggle: true,
	},
	{
		id: 'emailNotifications',
		title: 'Email Notifications',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy',
		enabled: false,
		hasToggle: false,
	},
	{
		id: 'orderNotifications',
		title: 'Order Notifications',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy',
		enabled: false,
		hasToggle: false,
	},
	{
		id: 'generalNotifications',
		title: 'General Notifications',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy',
		enabled: true,
		hasToggle: true,
	},
];
