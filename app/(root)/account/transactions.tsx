import CustomButton from '@/components/CustomButton';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { dummyTransactions } from '@/constants/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	RefreshControl,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';

interface Transaction {
	id: string;
	title: string;
	amount: number;
	date: string;
	type: 'credit' | 'debit';
	category?: string;
	description?: string;
}

const TransactionHistoryScreen: React.FC = () => {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	// State management
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadTransactions();
	}, []);

	const loadTransactions = async (isRefresh = false) => {
		try {
			if (!isRefresh) setLoading(true);
			setError(null);

			// TODO: Replace with actual API call
			// const response = await transactionService.getTransactions();
			// setTransactions(response.data);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// For demo: use empty array to show empty state
			// Change to DUMMY_TRANSACTIONS to see populated state
			setTransactions(dummyTransactions); //TODO: fix hardcoded data
		} catch (err) {
			console.error('Error loading transactions:', err);
			setError('Failed to load transactions');
		} finally {
			setLoading(false);
			if (isRefresh) setRefreshing(false);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadTransactions(true);
	}, []);

	const handleStartShopping = () => {
		console.log('TransactionHistory: Navigate to shop screen');
		// TODO: Navigate to shop screen
		// navigation.navigate('Shop');
	};

	// Format date for better readability
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year:
					date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
			});
		}
	};

	// Format amount with proper currency
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('en-PK', {
			style: 'currency',
			currency: 'PKR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(amount);
	};

	const getTransactionIcon = (type: 'credit' | 'debit') => {
		return type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle';
	};

	const getTransactionColor = (type: 'credit' | 'debit') => {
		return type === 'credit' ? '#22c55e' : '#ef4444';
	};

	const renderItem = useCallback(
		({ item }: { item: Transaction }) => (
			<View className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl mb-2 shadow-sm">
				{/* Left side */}
				<View className="flex-row items-center flex-1">
					<View className="mr-3">
						<Ionicons
							name={getTransactionIcon(item.type)}
							size={24}
							color={getTransactionColor(item.type)}
						/>
					</View>
					<View className="flex-1">
						<Text
							className="font-nexa-bold text-gray-900 dark:text-gray-100 mb-1"
							numberOfLines={1}
						>
							{item.title}
						</Text>
						<Text className="text-gray-500 dark:text-gray-400 text-body-xs">
							{formatDate(item.date)}
						</Text>
						{item.category && (
							<Text className="text-gray-400 dark:text-gray-500 text-body-xs mt-1">
								{item.category}
							</Text>
						)}
					</View>
				</View>

				{/* Right side */}
				<View className="items-end">
					<Text
						className={`font-nexa-bold ${
							item.type === 'credit' ? 'text-green-500' : 'text-red-500'
						}`}
					>
						{item.type === 'credit' ? '+' : '-'} {formatAmount(item.amount)}
					</Text>
				</View>
			</View>
		),
		[]
	);

	const renderEmptyComponent = useCallback(
		() => (
			<View className="flex-1 justify-center items-center px-8 py-20">
				<Image
					source={icons.transactions}
					className="w-[80px] h-[80px] mb-6"
					tintColor={COLORS.light.pallete[400]}
				/>
				<Text className="text-gray-900 dark:text-gray-100 font-nexa-bold text-lg mb-2 text-center">
					No Transactions Yet
				</Text>
				<Text className="text-gray-500 dark:text-gray-400 text-body-sm leading-5 text-center mb-8">
					Your transaction history will appear here once you make your first
					purchase.
				</Text>
				<CustomButton
					label="Start Shopping"
					bgVariant="primary"
					textVariant="primary"
					className="w-[180px] h-[50px]"
					onPress={handleStartShopping}
				/>
			</View>
		),
		[]
	);

	const renderFooter = useCallback(() => <View className="h-4" />, []);

	// Loading state
	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
				<StatusBar
					backgroundColor="transparent"
					barStyle={isDark ? 'light-content' : 'dark-content'}
				/>
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator
						size="large"
						color={isDark ? '#ffffff' : '#000000'}
					/>
					<Text className="mt-4 text-gray-500 dark:text-gray-400">
						Loading transactions...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	// Error state
	if (error && transactions.length === 0) {
		return (
			<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
				<StatusBar
					backgroundColor="transparent"
					barStyle={isDark ? 'light-content' : 'dark-content'}
				/>
				<View className="flex-1 justify-center items-center px-6">
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color={isDark ? '#ef4444' : '#dc2626'}
					/>
					<Text className="text-red-500 dark:text-red-400 text-center mb-4 mt-4">
						{error}
					</Text>
					<CustomButton
						label="Retry"
						bgVariant="primary"
						textVariant="primary"
						className="w-[120px] h-[40px]"
						onPress={() => loadTransactions()}
					/>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			<FlatList
				data={transactions}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={renderEmptyComponent}
				ListFooterComponent={renderFooter}
				contentContainerStyle={{
					flexGrow: 1,
					padding: 16,
				}}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[COLORS.light.pallete[500]]} // Android
						tintColor={COLORS.light.pallete[500]} // iOS
					/>
				}
				// Performance optimizations
				removeClippedSubviews={true}
				maxToRenderPerBatch={15}
				windowSize={10}
				initialNumToRender={10}
				getItemLayout={(data, index) => ({
					length: 80, // Approximate item height
					offset: 80 * index,
					index,
				})}
			/>
		</SafeAreaView>
	);
};

export default TransactionHistoryScreen;
