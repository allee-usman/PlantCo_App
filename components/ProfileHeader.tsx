import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { ProfileHeaderProps } from '@/interfaces/props';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isDark }) => {
	return (
		<TouchableOpacity
			className="flex-row px-5 justify-between items-center py-5 bg-light-surface dark:bg-gray-800 rounded-xl mb-4 border dark:border-gray-600 border-gray-200"
			onPress={() => {
				if (user) router.push('/(root)/account/profile');
				else router.push('/(auth)/login');
			}}
		>
			{/* Avatar + User Info */}
			<View className="flex-row justify-center items-center gap-3">
				<Image
					source={{ uri: user?.avatar.url }}
					className="w-[44px] h-[44px] rounded-full"
					resizeMode="cover"
				/>
				<View>
					<Text className="font-nexa-extrabold mb-1 text-body text-black dark:text-white">
						{user?.name || user?.username || 'Guest User'}
					</Text>
					<Text className="text-body-sm text-gray-500">
						{user?.email || 'Not signed in'}
					</Text>
				</View>
			</View>

			{/* Edit Profile button */}
			<TouchableOpacity
				activeOpacity={0.6}
				onPress={() => router.push('/(root)/account/profile/edit-profile')}
				className="w-[40px] h-[40px] flex items-end justify-center"
			>
				<Image
					source={icons.edit}
					tintColor={isDark ? COLORS.gray[200] : COLORS.gray[800]}
					style={{ width: 24, height: 24 }}
					resizeMode="contain"
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export default ProfileHeader;
