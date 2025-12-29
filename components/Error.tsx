import { Text, View } from 'react-native';

type ErrorProps = {
	message: string;
};

export default function ErrorMessage({ message }: ErrorProps) {
	return (
		<View className="mb-6 mx-2 p-3 w-full rounded-lg border bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700">
			<Text className="text-center text-xs font-nexa text-red-700 dark:text-red-300">
				{message}
			</Text>
		</View>
	);
}
