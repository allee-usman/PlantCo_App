import LottieLoadingIndicator from '@/components/LottieLoadingIndicator';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { OrderStep } from '@/interfaces/interface';
import { getMyOrders } from '@/services/order.services';
import { IOrderSummary } from '@/types/order.types';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { mapOrderToSummary } from '@/utils/order.helper';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import {
	FlatList,
	Image,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const OrderHistoryScreen: React.FC = () => {
	// const [orders, setOrders] = React.useState<Order[]>(ordersData);
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	const [orders, setOrders] = useState<IOrderSummary[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const toggleOrderExpansion = useCallback((orderId: string) => {
		setOrders((prev) =>
			prev.map((order) =>
				order._id === orderId ? { ...order, expanded: !order.expanded } : order
			)
		);
	}, []);

	const fetchOrders = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getMyOrders();
			const mapped = data.map(mapOrderToSummary);
			setOrders(mapped);
		} catch (err: any) {
			console.log('❌ Failed to fetch orders:', err);
			setError(err?.response?.data?.message || 'Failed to load orders');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const getStatusColor = (type: string, status: string): string => {
		if (type === 'bg') {
			switch (status) {
				case 'delivered':
					return 'bg-green-600 dark:bg-green-400';
				case 'pending':
				case 'processing':
					return 'bg-yellow-600 dark:bg-yellow-400';
				case 'refused':
				case 'cancelled':
					return 'bg-red-600 dark:bg-red-400';
				case 'out_for_delivery':
					return 'bg-blue-600 dark:bg-blue-400';
				case 'confirmed':
				case 'shipped':
					return 'bg-blue-600 dark:bg-blue-400';
				case 'refunded':
					return 'bg-purple-600 dark:bg-purple-400';
				default:
					return 'bg-gray-600 dark:bg-gray-400';
			}
		} else {
			switch (status) {
				case 'delivered':
					return 'text-green-600 dark:text-green-400';
				case 'pending':
				case 'processing':
					return 'text-yellow-600 dark:text-yellow-400';
				case 'refused':
				case 'cancelled':
					return 'text-red-600 dark:text-red-400';
				case 'out_for_delivery':
					return 'text-blue-600 dark:text-blue-400';
				default:
					return 'text-gray-600 dark:text-gray-400';
			}
		}
	};

	const getBoxIcon = useCallback(
		(orderStatus: string): JSX.Element => {
			let iconSource;

			switch (orderStatus) {
				case 'delivered':
					iconSource = icons.orderDelivered;
					break;
				case 'processing':
					iconSource = icons.orderProcessing;
					break;
				case 'out_for_delivery':
					iconSource = icons.orderOut;
					break;
				case 'cancelled':
				case 'refused':
					iconSource = icons.orderCancelled;
					break;
				default:
					iconSource = icons.orderPending;
			}

			return (
				<View className="w-[66px] h-[66px] bg-light-pallete-50 dark:bg-green-900/20 rounded-full justify-center items-center">
					<Image
						source={iconSource}
						className="w-[42px] h-[42px]"
						tintColor={
							isDark ? COLORS.light.pallete[600] : COLORS.light.pallete[500]
						}
					/>
				</View>
			);
		},
		[isDark]
	);

	const stepTemplate = useMemo(
		() => [
			'Order placed',
			'Order confirmed',
			'Order shipped',
			'Out for delivery',
			'Order delivered',
		],
		[]
	);

	// const getOrderSteps = useCallback(

	// 	(status: string, statusDate: string) => {
	// 		const statusOrder = [
	// 			'pending',
	// 			'processing',
	// 			'out_for_delivery',
	// 			'delivered',
	// 			'cancelled',
	// 			'refused',
	// 		];
	// 		const currentIndex = statusOrder.indexOf(status);

	// 		return stepTemplate.map((title, index) => {
	// 			let stepStatus: 'completed' | 'current' | 'pending' = 'pending';

	// 			if (index < currentIndex) stepStatus = 'completed';
	// 			else if (index === currentIndex) stepStatus = 'current';

	// 			return {
	// 				id: index + 1,
	// 				title,
	// 				date: stepStatus !== 'pending' ? statusDate : 'pending',
	// 				status: stepStatus,
	// 			};
	// 		});
	// 	},
	// 	[stepTemplate]
	// );

	const getOrderSteps = useCallback(
		(status: string, statusDate: string) => {
			const statusOrder = [
				'pending',
				'processing',
				'out_for_delivery',
				'delivered',
			];
			const cancelStatuses = ['cancelled', 'refused'];
			const currentIndex = statusOrder.indexOf(status);

			// Step 1: Base steps
			const steps: OrderStep[] = stepTemplate.map((title, index) => {
				let stepStatus: 'completed' | 'current' | 'pending' = 'pending';

				if (cancelStatuses.includes(status)) {
					// 🛑 For cancelled/refused orders:
					if (index === 0)
						stepStatus = 'completed'; // Order placed always happens
					else if (index === 1) stepStatus = 'current'; // Cancelled around processing
				} else {
					// ✅ Normal flow
					if (index < currentIndex) stepStatus = 'completed';
					else if (index === currentIndex) stepStatus = 'current';
				}

				return {
					id: index + 1,
					title,
					date: stepStatus !== 'pending' ? statusDate : 'pending',
					status: stepStatus,
				};
			});

			// Step 2: Append cancel step if needed
			if (cancelStatuses.includes(status)) {
				steps.push({
					id: stepTemplate.length + 1,
					title: 'Order cancelled',
					date: statusDate,
					status: 'current',
				});
			}

			return steps;
		},
		[stepTemplate]
	);

	const renderOrderStep = useCallback(
		(step: OrderStep, index: number, totalSteps: number) => {
			const isCompleted = step.status === 'completed';
			const isCurrent = step.status === 'current';
			const isLast = index === totalSteps - 1;

			return (
				<View key={step.id} className="flex-row items-start">
					<View className="flex-row gap-x-4">
						<View className="flex-col items-center">
							{/* Circle */}
							<View
								className={`w-[12px] h-[12px] rounded-full z-10 ${
									isCompleted
										? 'bg-light-pallete-400 dark:bg-light-pallete-500'
										: isCurrent
										? 'bg-red-500 dark:bg-red-600'
										: 'bg-gray-300 dark:bg-gray-600'
								}`}
							></View>
							{/* Line */}
							{!isLast && (
								<View
									className={`w-0.5 h-[44px] -m-1 ${
										isCompleted
											? 'bg-light-pallete-400 dark:bg-light-pallete-500'
											: 'bg-gray-300 dark:bg-gray-600'
									}`}
								></View>
							)}
						</View>
						<View className="flex-col justify-start items-start">
							<Text
								className={`text-body-sm -my-1 leading-6 font-nexa-extrabold capitalize ${
									isCompleted || isCurrent
										? 'text-light-title dark:text-dark-title'
										: 'text-gray-500 dark:text-gray-400'
								}`}
							>
								{step.title}
							</Text>
							<Text className="text-body-xs text-gray-500 dark:text-gray-400 mt-1">
								{formatDateTime(step.date)}
								{/* {step.date} */}
							</Text>
						</View>
					</View>
				</View>
			);
		},
		[]
	);

	const renderOrder = useCallback(
		({ item }: { item: IOrderSummary }) => (
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={() => toggleOrderExpansion(item._id)}
				className="bg-light-surface dark:bg-gray-800 rounded-lg p-5 mb-4 shadow-md shadow-gray-300 dark:shadow-gray-700
"
			>
				{/* Order Header */}
				<View className="flex-row items-start justify-between mb-4">
					<View className="flex-row items-start justify-center flex-1">
						{getBoxIcon(item.status)}
						<View className="ml-4 flex-1">
							<View className="flex-row items-center justify-between">
								<Text className="text-body font-nexa-extrabold text-light-title dark:text-dark-title">
									#{item.orderNumber}
								</Text>
								<Ionicons
									name={
										item.expanded
											? 'caret-up-circle-outline'
											: 'caret-down-circle-outline'
									}
									size={20}
									color={
										item.expanded ? COLORS.light.pallete[400] : COLORS.gray[400]
									}
								/>
							</View>
							<Text className="text-body-xs text-gray-500 dark:text-gray-400 mt-1">
								Placed On: {formatDate(item.placedDate)}
							</Text>
							<View className="flex-row items-center mt-2">
								<Text className="text-body-xs text-gray-600 dark:text-gray-400 mr-4">
									Items: {item.totalItems}
								</Text>
								<Text className="text-body-xs font-semibold text-light-title dark:text-dark-title">
									Price: Rs {item.totalPrice.toLocaleString()}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Full width separator line */}
				<View className="-mx-5 border-t border-gray-200 dark:border-gray-700 mb-4" />

				{/* Status */}
				<View className="flex-row items-center justify-between">
					<View className="flex-row justify-center items-center gap-x-2">
						<View
							className={`w-[8px] h-[8px] rounded-full ${getStatusColor(
								'bg',
								item.status
							)}`}
						></View>
						<Text
							className={`flex-row justify-start items-center text-body-xs capitalize font-nexa-bold ${getStatusColor(
								'text',
								item.status
							)}`}
						>
							{item.status.replaceAll('_', ' ')}
						</Text>
					</View>
					<Text className="text-body-xs text-gray-500 dark:text-gray-400">
						{formatDateTime(item.statusDate)}
					</Text>
				</View>

				{/* Expanded Steps */}
				{item.expanded && (
					<View className="mt-4 pt-6 -mx-5 px-5 border-t border-gray-200 dark:border-gray-700">
						{getOrderSteps(item.status, item.statusDate).map(
							(step, index, steps) => renderOrderStep(step, index, steps.length)
						)}
					</View>
				)}
			</TouchableOpacity>
		),
		[toggleOrderExpansion, getBoxIcon, getOrderSteps, renderOrderStep]
	);

	if (loading) return <LottieLoadingIndicator />;

	if (!loading && orders.length === 0) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-light-screen dark:bg-gray-950">
				<Text className="text-gray-500 dark:text-gray-400">
					No orders found
				</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-light-screen dark:bg-gray-950">
				<Text className="text-red-500 mb-4">{error}</Text>
				<TouchableOpacity
					onPress={() => fetchOrders()}
					className="px-4 py-2 bg-light-pallete-500 rounded-md"
				>
					<Text className="text-white font-semibold">Try Again</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<StatusBar
				backgroundColor="transparent"
				barStyle={isDark ? 'light-content' : 'dark-content'}
			/>
			{/* <View className="w-full h-[250px] dark:bg-gray-800 p-5">
				<View className="flex-row gap-2">
					<View className="flex-col items-center">
						<View
							className={`w-3 h-3 rounded-full ${'bg-green-600 dark:bg-green-400'}`}
						/>
						<View className="w-[2px] h-8 bg-gray-200 -m-[1px]"></View>
					</View>
				</View>
			</View> */}

			{/* Orders List */}
			<FlatList
				data={orders}
				renderItem={renderOrder}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
				className="pt-2"
			/>
		</SafeAreaView>
	);
};

export default OrderHistoryScreen;
