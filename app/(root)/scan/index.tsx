import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import {
	CameraType,
	CameraView,
	FlashMode,
	useCameraPermissions,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function VisualSearchCamera() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [flash, setFlash] = useState<FlashMode>('off');
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);

	useEffect(() => {
		(async () => {
			if (!permission?.granted) {
				await requestPermission();
			}
		})();
	}, []);

	const takePicture = async () => {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync({
					quality: 0.8,
				});
				console.log('Photo taken:', photo?.uri);
				Alert.alert('Success', 'Photo captured! URI: ' + photo?.uri);
				// Handle the captured photo here
			} catch (error) {
				console.error('Error taking picture:', error);
				Alert.alert('Error', 'Failed to capture photo');
			}
		}
	};

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: false,
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				console.log('Image selected:', result.assets[0].uri);
				Alert.alert('Success', 'Image selected! URI: ' + result.assets[0].uri);
				// Handle the selected image here
			}
		} catch (error) {
			console.error('Error picking image:', error);
			Alert.alert('Error', 'Failed to select image');
		}
	};

	const toggleFlash = () => {
		setFlash((current) => (current === 'off' ? 'on' : 'off'));
	};

	if (!permission) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Requesting camera permission...</Text>
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Camera permission is required</Text>
				<TouchableOpacity
					onPress={requestPermission}
					style={styles.permissionButton}
				>
					<Text style={styles.permissionButtonText}>Grant Permission</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				{/* <View style={styles.header}>
					<TouchableOpacity style={styles.backButton}>
						<Ionicons name="chevron-back" size={24} color="#000" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Search by taking photo</Text>
					<TouchableOpacity style={styles.tipButton} onPress={showTips}>
						<Ionicons name="help-circle-outline" size={24} color="#000" />
					</TouchableOpacity>
				</View> */}

				{/* Camera View */}
				<View style={styles.cameraContainer}>
					<CameraView
						ref={cameraRef}
						style={styles.camera}
						facing={facing}
						flash={flash}
					>
						{/* Camera Frame Overlay */}
						<View style={styles.frameOverlay}>
							<View style={styles.cornerTopLeft} />
							<View style={styles.cornerTopRight} />
							<View style={styles.cornerBottomLeft} />
							<View style={styles.cornerBottomRight} />
						</View>

						{/* Instruction Text */}
						<View className="absolute bottom-3 left-0 right-0 items-center">
							<Text className="text-body-sm text-white bg-black/40 px-4 py-1 border-md ">
								Capture one plant inside the frame
							</Text>
						</View>
					</CameraView>
				</View>

				{/* Footer Controls */}
				<View style={styles.footer}>
					<TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
						<Ionicons
							name={flash === 'on' ? 'flash' : 'flash-off'}
							size={28}
							color={flash === 'on' ? '#FFD700' : '#333'}
						/>
					</TouchableOpacity>

					<TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
						<View
							style={styles.shutterInner}
							className="justify-center items-center"
						>
							<Image
								source={icons.camera}
								className="size-6"
								tintColor={'#fff'}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.controlButton} onPress={pickImage}>
						<Image
							source={icons.gallery}
							className="size-6"
							// tintColor={'#fff'}
						/>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#fff',
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: '#000',
		flex: 1,
		textAlign: 'center',
		marginHorizontal: 8,
	},
	tipButton: {
		padding: 4,
	},
	cameraContainer: {
		flex: 1,
		backgroundColor: '#000',
	},
	camera: {
		flex: 1,
	},
	frameOverlay: {
		flex: 1,
		margin: 40,
	},
	cornerTopLeft: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 50,
		height: 50,
		borderTopWidth: 4,
		borderLeftWidth: 4,
		borderColor: '#fff',
	},
	cornerTopRight: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 50,
		height: 50,
		borderTopWidth: 4,
		borderRightWidth: 4,
		borderColor: '#fff',
	},
	cornerBottomLeft: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 4,
		borderLeftWidth: 4,
		borderColor: '#fff',
	},
	cornerBottomRight: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 4,
		borderRightWidth: 4,
		borderColor: '#fff',
	},
	
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingVertical: 24,
		paddingHorizontal: 32,
		backgroundColor: '#fff',
	},
	controlButton: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	shutterButton: {
		width: 60,
		height: 60,
		borderRadius: 35,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: COLORS.light.pallete[400],
	},
	shutterInner: {
		width: 48,
		height: 48,
		borderRadius: 29,
		backgroundColor: COLORS.light.pallete[400],
	},
	message: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 16,
		marginTop: 100,
	},
	permissionButton: {
		backgroundColor: '#8BC34A',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		marginTop: 20,
		alignSelf: 'center',
	},
	permissionButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
