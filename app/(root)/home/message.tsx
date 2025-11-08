import CustomButton from '@/components/CustomButton';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Message = () => {
	return (
		<SafeAreaView>
			<View className="block">
				<Text>Message</Text>
				<CustomButton
					label="Login"
					onPress={() => {}}
					// loading={isLoading}
					// disabled={isLoading}
					size="sm"
					accessibilityLabel="Log in to your account"
					accessibilityRole="button"
				/>
			</View>
		</SafeAreaView>
	);
};

export default Message;
