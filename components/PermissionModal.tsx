import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PermissionModalProps {
	visible: boolean;
	message: string;
	onCancel: () => void;
	onOpenSettings: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
	visible,
	message,
	onCancel,
	onOpenSettings,
}) => {
	return (
		<Modal animationType="slide" transparent visible={visible}>
			<View style={styles.backdrop}>
				<View style={styles.container}>
					<Ionicons name="camera-outline" size={40} color="#4B5563" />
					<Text style={styles.title}>Permissions Required</Text>
					<Text style={styles.message}>{message}</Text>
					<View style={styles.actions}>
						<TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttonConfirm}
							onPress={onOpenSettings}
						>
							<Text style={[styles.buttonText, { color: 'white' }]}>
								Open Settings
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'flex-end',
	},
	container: {
		backgroundColor: 'white',
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 10,
	},
	message: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
		marginVertical: 10,
	},
	actions: {
		flexDirection: 'row',
		marginTop: 20,
		width: '100%',
		justifyContent: 'space-between',
	},
	buttonCancel: {
		backgroundColor: '#E5E7EB',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	buttonConfirm: {
		backgroundColor: '#10B981',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});

export default PermissionModal;
