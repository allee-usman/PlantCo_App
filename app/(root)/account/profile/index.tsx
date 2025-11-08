import CustomButton from '@/components/CustomButton';
import CustomInputField from '@/components/CustomInputField';
import FixedBottomButton from '@/components/FixedBottomButton';
import LottieLoader from '@/components/LottieLoader';
import PermissionModal from '@/components/PermissionModal';
import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import api from '@/utils/api';
import { formatDate } from '@/utils/formatDate';
import { notify } from '@/utils/notification';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
	Image,
	Modal,
	Platform,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

interface FormData {
	name: string;
	username: string;
	email: string;
	phone: string;
	address: string;
	avatar?: string | null;
}

const Profile: React.FC = () => {
	//redux
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state: RootState) => state.auth);

	const defaultAddress =
		user?.customerProfile?.addresses?.find((addr) => addr.isDefault)
			?.fullAddress ||
		user?.customerProfile?.addresses?.[0]?.fullAddress ||
		'';

	// Personal Details State
	const [formData, setFormData] = useState<FormData>({
		name: user?.customerProfile?.name || '',
		username: user?.username || '',
		email: user?.email || '',
		phone: user?.phoneNumber || '',
		address: defaultAddress,
		avatar: user?.avatar.url,
	});

	const [permissionModalVisible, setPermissionModalVisible] = useState(false);

	// Focus States
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [editProfile, setEditProfile] = useState<boolean>(false);

	// Form States
	const [processing, setProcessing] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

	// Avatar upload state
	const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
	const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);

	// Edit Popup State
	const [showEditPopup, setShowEditPopup] = useState(false);

	const handleFocus = (fieldName: string) => {
		setFocusedField(fieldName);
	};

	const handleBlur = () => {
		setFocusedField(null);
	};

	const updateFormData = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
	};

	// Ask for permissions if needed
	const requestPermissions = async () => {
		if (Platform.OS === 'web') return true;

		const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
		const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

		// If either permission is denied, show your PermissionModal
		if (cameraPerm.status !== 'granted' || mediaPerm.status !== 'granted') {
			setPermissionModalVisible(true);
			return false; // block the photo pick
		}

		return true; // permissions are ok
	};

	// Open device settings
	const handleOpenSettings = () => {
		Linking.openSettings();
		setPermissionModalVisible(false);
	};
	// Resize/compress image before uploading (optional but recommended)
	const resizeImage = async (uri: string) => {
		try {
			// small resize to reduce upload size
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 1000 } }], // adjust to desired max width
				{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
			);
			return result.uri;
		} catch (err) {
			console.warn('Image resize failed', err);
			return uri;
		}
	};

	// Handle result returned from ImagePicker (supports both SDK versions)
	const handleImagePicked = async (
		result: ImagePicker.ImagePickerResult | null
	) => {
		if (result?.canceled) return;
		// Newer versions return { cancelled, assets: [{ uri, ...}] }
		const uri = result?.assets?.[0]?.uri;
		if (!uri) return;

		try {
			setUploadingAvatar(true);

			// Optional: resize/compress
			const resized = await resizeImage(uri);

			// Show immediately in UI (optimistic)
			setFormData((prev) => ({ ...prev, avatar: resized }));

			// Upload to server (if you have endpoint) — see uploadImageAsync below
			await uploadImageAsync(resized);

			notify.success('Your profile photo was updated successfully');
		} catch (err) {
			console.error('Image upload error', err);
			Toast.show({
				type: 'error',
				text1: 'Upload failed',
				text2: 'Could not upload profile photo. Try again.',
			});
			// revert avatar if you want (optional)
			// setFormData(prev => ({ ...prev, avatar: null }));
		} finally {
			setUploadingAvatar(false);
		}
	};

	// Pick image from library
	const pickImageFromLibrary = async () => {
		const ok = await requestPermissions();
		if (!ok) return;

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				// mediaTypes: ImagePicker.MediaType.Images, //default to images
				quality: 0.8,
				allowsEditing: true,
				aspect: [1, 1], // square crop
			});
			if (result && !result.canceled && !validateImage(result)) {
				return;
			}
			await handleImagePicked(result);
		} catch (err) {
			console.error(err);
		}
	};

	// Take a photo with camera
	const takePhoto = async () => {
		const ok = await requestPermissions();
		if (!ok) return;

		try {
			const result = await ImagePicker.launchCameraAsync({
				// mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 0.8,
				allowsEditing: true,
				aspect: [1, 1],
			});
			// Add validation here too
			if (result && !result.canceled && !validateImage(result)) {
				return;
			}
			await handleImagePicked(result);
		} catch (err) {
			console.error(err);
		}
	};

	// Show choice to user
	const handleCameraPress = () => setPhotoOptionsVisible(true);

	// Upload Avatar to server
	const uploadImageAsync = async (uri: string) => {
		try {
			const filename = uri.split('/').pop() || `avatar_${Date.now()}.jpg`;
			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : 'image/jpeg';

			const form = new FormData();
			form.append('avatar', {
				uri,
				name: filename,
				type,
			} as any); // RN requires `as any`

			const { data } = await api.put('/users/profile/avatar', form, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			// Update UI
			dispatch(updateUser(data.user));

			return data;
		} catch (err: any) {
			console.error('Avatar upload failed', err.response?.data || err.message);
			throw err;
		}
	};

	// update profile details
	const handleBtnPress = async () => {
		if (!editProfile) {
			setEditProfile(true);
			setShowEditPopup(true); // show popup for editing
			setTimeout(() => setShowEditPopup(false), 3000); // hide after 3s
			return;
		}

		if (!validateForm()) return; // stop if validation fails

		setProcessing(true);
		try {
			const { data } = await api.put('/users/profile', {
				name: formData.name,
				username: formData.username,
				phone: formData.phone,
				address: formData.address,
			});

			dispatch(updateUser(data.user));

			notify.success('Your profile was updated successfully');
			setEditProfile(false);
		} catch (err: any) {
			console.error('Profile update error', err.response?.data || err.message);
			Toast.show({ type: 'error', text1: 'Update failed' });
		} finally {
			setProcessing(false);
		}
	};

	const deleteAvatar = async () => {
		try {
			const { data } = await api.delete('/users/avatar');
			setFormData((prev) => ({ ...prev, avatar: data.user.avatar.url }));
			dispatch(updateUser(data.user));

			Toast.show({ type: 'success', text1: 'Avatar removed' });
		} catch (err: any) {
			console.error('Avatar delete error', err.response?.data || err.message);
			Toast.show({ type: 'error', text1: 'Failed to remove avatar' });
		}
	};

	const validateImage = (result: ImagePicker.ImagePickerResult) => {
		const asset = result.assets?.[0];
		if (!asset) return false;

		// Check file size (e.g., max 5MB)
		if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
			Toast.show({
				type: 'error',
				text1: 'File too large',
				text2: 'Please select an image smaller than 5MB',
			});
			return false;
		}

		return true;
	};

	const validateForm = (): boolean => {
		const newErrors: { [key: string]: string | null } = {};

		// Username: required, 5-15 chars, allow only underscore
		if (!formData.username) {
			newErrors.username = 'Username is required';
		} else if (!/^[a-zA-Z0-9_]{5,15}$/.test(formData.username)) {
			newErrors.username =
				'Username must be 5-15 characters and can include letters, numbers, and underscores only';
		}

		// Full Name: optional, 5-50 chars if provided
		if (
			formData.name &&
			(formData.name.length < 5 || formData.name.length > 50)
		) {
			newErrors.name = 'Full name must be 5-50 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			{showEditPopup && (
				<View className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 px-4 py-2 rounded-md z-50">
					<Text className="text-white font-nexa-extrabold text-body-sm">
						You can now edit your profile
					</Text>
				</View>
			)}

			<KeyboardAwareScrollView
				contentContainerStyle={{
					paddingBottom: editProfile ? 140 : 80,
					paddingTop: 10,
					flexGrow: 1,
					justifyContent: 'space-between',
					paddingHorizontal: 16,
				}}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
				enableAutomaticScroll={true}
				// ref={scrollRef} // you can keep ref here for scrolling to errors
			>
				<View>
					<View className="items-center py-1 bg-light-screen dark:bg-gray-950 mb-8">
						<View className="relative">
							<Image
								// source={images.avatar}
								source={{ uri: formData.avatar! }}
								className="w-[120px] h-[120px] rounded-full"
							/>
							<TouchableOpacity
								className="absolute -bottom-1 right-3 w-8 h-8 bg-light-pallete-400 rounded-full justify-center items-center border-2 border-white dark:border-gray-950"
								onPress={handleCameraPress}
								accessibilityRole="button"
								accessibilityLabel="Change profile photo"
							>
								{uploadingAvatar ? (
									<LottieLoader
										animation={animations.spinner}
										size={36}
										color={COLORS.light.pallete[800]}
									/>
								) : (
									<Image
										source={icons.camera}
										className="size-4"
										tintColor={COLORS.gray[700]}
									/>
								)}
							</TouchableOpacity>
						</View>
					</View>

					{/* fields */}
					<View className="mb-4">
						<CustomInputField
							label="Username"
							placeholder="Enter username"
							value={formData.username}
							onChangeText={(t) => updateFormData('username', t)}
							isFocused={focusedField === 'username'}
							onFocus={() => handleFocus('username')}
							editable={editProfile}
							onBlur={handleBlur}
							error={errors.username}
						/>
						<CustomInputField
							label="Full Name"
							placeholder="Enter full name"
							value={formData.name}
							editable={editProfile}
							onChangeText={(t) => updateFormData('name', t)}
							isFocused={focusedField === 'name'}
							onFocus={() => handleFocus('name')}
							onBlur={handleBlur}
							error={errors.name}
						/>

						{/* email input */}
						<View className="items-end">
							<CustomInputField
								label="Email Address"
								value={formData.email}
								onChangeText={(t) => updateFormData('email', t)}
								keyboardType="email-address"
								disabled
								autoComplete="email"
								isFocused={focusedField === 'email'}
								onFocus={() => handleFocus('email')}
								onBlur={handleBlur}
								error={errors.email}
								containerStyle={{ width: '100%', marginBottom: 8 }}
							/>
							<Link
								className="text-body-xs font-nexa text-light-pallete-600 dark:text-light-pallete-500 mr-3"
								href="/account/change-email"
							>
								Change email?
							</Link>
						</View>

						<View className="items-end">
							<CustomInputField
								label="Phone Number"
								value={formData.phone}
								onChangeText={(t) => updateFormData('phone', t)}
								keyboardType="phone-pad"
								disabled
								isFocused={focusedField === 'phone'}
								onFocus={() => handleFocus('phone')}
								onBlur={handleBlur}
								containerStyle={{ width: '100%', marginBottom: 8 }}
							/>
							<Link
								className="text-body-xs font-nexa text-light-pallete-600 dark:text-light-pallete-500 mr-3"
								// href="/account/change-phone"
								href="/account/change-email" //TODO: update route after phone change page is ready
							>
								Change phone?
							</Link>
						</View>

						<CustomInputField
							label="Address"
							value={formData.address}
							multiline
							editable={editProfile}
							numberOfLines={2}
							onChangeText={(t) => updateFormData('address', t)}
							isFocused={focusedField === 'address'}
							onFocus={() => handleFocus('address')}
							onBlur={handleBlur}
							error={errors.address}
						/>
					</View>

					{user?.createdAt && (
						<Text className="text-gray-500 dark:text-gray-400 text-center text-body-xs mb-2">
							Joined on {formatDate(user.createdAt)}
						</Text>
					)}
				</View>
			</KeyboardAwareScrollView>

			{/* Save Button */}
			{/* <View className="absolute bottom-0 left-0 right-0 p-4 bg-light-screen dark:bg-gray-950">
				<CustomButton
					label={!editProfile ? 'Edit Profile' : 'Update'}
					loading={processing}
					onPress={handleBtnPress}
					bgVariant="primary"
					disabled={processing}
					accessibilityLabel="Save profile changes"
					accessibilityRole="button"
				/>
			</View> */}
			<FixedBottomButton
				label={!editProfile ? 'Edit Profile' : 'Update'}
				onPress={handleBtnPress}
				loading={processing}
				showSecondary={editProfile}
				secondaryLabel="Cancel"
				disabled={processing}
				onSecondaryPress={() => setEditProfile(false)}
			/>

			{/* Permission Modal */}
			<PermissionModal
				visible={permissionModalVisible}
				message="Camera and photo library permissions are required to update your profile photo."
				onCancel={() => setPermissionModalVisible(false)}
				onOpenSettings={handleOpenSettings}
			/>
			{/* photo options modal */}
			<Modal visible={photoOptionsVisible} transparent animationType="slide">
				<TouchableOpacity
					className="flex-1 justify-end bg-black/40"
					activeOpacity={1}
					onPress={() => setPhotoOptionsVisible(false)} // Close when tapping outside
				>
					<View className="justify-end">
						<View className="bg-white dark:bg-gray-900 rounded-t-2xl p-6 space-y-3">
							<Text className="text-center text-body-lg font-nexa-extrabold dark:text-white">
								Change Profile Photo
							</Text>
							<CustomButton
								label="Take Photo"
								bgVariant="primary"
								onPress={() => {
									takePhoto();
									setPhotoOptionsVisible(false);
								}}
								className="mb-4 py-4 mt-4"
								icon={icons.camera}
							/>
							<CustomButton
								label="Choose from Library"
								bgVariant="primary"
								onPress={() => {
									pickImageFromLibrary();
									setPhotoOptionsVisible(false);
								}}
								icon={icons.gallery}
								className="mb-4 py-4"
								// icon={<Ionicons name="images-outline" size={18} color="#fff" />}
							/>
							<CustomButton
								label="Cancel"
								onPress={() => setPhotoOptionsVisible(false)}
								bgVariant="secondary"
								className="py-4 bg-transparent"
							/>
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
		</SafeAreaView>
	);
};

export default Profile;
