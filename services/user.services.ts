import { NotificationSettings, User } from '@/interfaces/types';
import api from '@/utils/api';

export interface UpdateProfilePayload {
	name: string;
	username: string;
	phone?: string;
	address?: string;
}

export interface ChangePasswordPayload {
	currentPassword: string;
	newPassword: string;
}

//  Avatar Management
export const uploadAvatar = async (uri: string): Promise<User> => {
	const filename = uri.split('/').pop() || `avatar_${Date.now()}.jpg`;
	const match = /\.(\w+)$/.exec(filename);
	const type = match ? `image/${match[1]}` : 'image/jpeg';

	const form = new FormData();
	form.append('avatar', {
		uri,
		name: filename,
		type,
	} as any);

	const { data } = await api.put<User>('/users/profile/avatar', form, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});

	return data;
};

export const deleteAvatar = async (): Promise<User> => {
	const { data } = await api.delete<User>('/users/profile/avatar');
	return data;
};

// Profile Update
export const updateProfile = async (
	payload: UpdateProfilePayload
): Promise<User> => {
	const { data } = await api.put<User>('/users/profile', payload);
	return data;
};

// Get Current Profile
export const getProfile = async (): Promise<User> => {
	const { data } = await api.get<User>('/users/profile');
	return data;
};

export const changePassword = async (
	payload: ChangePasswordPayload
): Promise<{ success: boolean; message: string }> => {
	const { data } = await api.put('/users/change-password', payload);
	return data;
};

export const requestEmailChange = async (newEmail: string) => {
	const { data } = await api.post('/users/change-email/request', { newEmail });
	return data;
};

export const verifyEmailChange = async (
	newEmail: string,
	otp: string
): Promise<{
	success: boolean;
	message: string;
	user?: User;
	token?: string;
}> => {
	const { data } = await api.post('/users/change-email/verify', {
		newEmail,
		otp,
		context: 'change-email',
	});
	return data;
};

// Get Notification Settings
export const getNotificationSettings =
	async (): Promise<NotificationSettings> => {
		const { data } = await api.get<{
			settings: NotificationSettings;
		}>('/users/me/notifications');
		return data.settings;
	};

// Update Notification Settings
export const updateNotificationSettings = async (
	newSettings: NotificationSettings
): Promise<{
	success: boolean;
	settings: NotificationSettings;
}> => {
	const { data } = await api.put('/users/me/notifications', newSettings);
	return data.settings;
};
