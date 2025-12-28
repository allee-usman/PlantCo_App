import CustomButton from '@/components/CustomButton';
import CustomHeader from '@/components/CustomHeader';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import LottieLoader from '@/components/LottieLoader';
import SectionHeader from '@/components/SectionHeader';
import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { icons } from '@/constants/icons';
import {
	bookingService,
	CreateBookingPayload,
} from '@/services/booking.services';
import {
	serviceProviderService,
	ServiceWithPartialProvider,
} from '@/services/sm.services';
import { Service } from '@/types/service.types';
import { formatServiceType } from '@/utils/service.utils';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
	FlatList,
	Image,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// booking state
interface BookingState {
	selectedDate: Date;
	selectedTime: Date;
	showDatePicker: boolean;
	showTimePicker: boolean;
	address: string;
	phone: string; // NEW: Phone number field
	notes: string;
	promoCode: string; // NEW: Promo code field
	duration: number;
	termsAccepted: boolean;
	additionalServices: string[]; // NEW: Array of selected service IDs
}

type BookingAction =
	| { type: 'SET_DATE'; payload: Date }
	| { type: 'SET_TIME'; payload: Date }
	| { type: 'TOGGLE_DATE_PICKER' }
	| { type: 'TOGGLE_TIME_PICKER' }
	| { type: 'SET_ADDRESS'; payload: string }
	| { type: 'SET_PHONE'; payload: string }
	| { type: 'SET_NOTES'; payload: string }
	| { type: 'SET_PROMO_CODE'; payload: string }
	| { type: 'SET_DURATION'; payload: number }
	| { type: 'TOGGLE_TERMS' }
	| { type: 'ADD_SERVICE'; payload: string }
	| { type: 'REMOVE_SERVICE'; payload: string };

// Booking reducer with new actions
function bookingReducer(
	state: BookingState,
	action: BookingAction
): BookingState {
	switch (action.type) {
		case 'SET_DATE':
			return { ...state, selectedDate: action.payload, showDatePicker: false };
		case 'SET_TIME':
			return { ...state, selectedTime: action.payload, showTimePicker: false };
		case 'TOGGLE_DATE_PICKER':
			return { ...state, showDatePicker: !state.showDatePicker };
		case 'TOGGLE_TIME_PICKER':
			return { ...state, showTimePicker: !state.showTimePicker };
		case 'SET_ADDRESS':
			return { ...state, address: action.payload };
		case 'SET_PHONE':
			return { ...state, phone: action.payload };
		case 'SET_NOTES':
			return { ...state, notes: action.payload };
		case 'SET_PROMO_CODE':
			return { ...state, promoCode: action.payload };
		case 'SET_DURATION':
			return { ...state, duration: action.payload };
		case 'TOGGLE_TERMS':
			return { ...state, termsAccepted: !state.termsAccepted };
		case 'ADD_SERVICE':
			return {
				...state,
				additionalServices: [...state.additionalServices, action.payload],
			};
		case 'REMOVE_SERVICE':
			return {
				...state,
				additionalServices: state.additionalServices.filter(
					(id) => id !== action.payload
				),
			};
		default:
			return state;
	}
}

const ServiceBooking = () => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

	// Service data state
	const [service, setService] = useState<ServiceWithPartialProvider | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// NEW: Other services from same provider
	const [providerServices, setProviderServices] = useState<Service[]>([]);
	const [loadingServices, setLoadingServices] = useState(false);

	// IMPROVED: Initialize booking state with new fields
	const [bookingState, dispatch] = useReducer(bookingReducer, {
		selectedDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
		selectedTime: new Date(new Date().setHours(9, 0, 0, 0)),
		showDatePicker: false,
		showTimePicker: false,
		address: '',
		phone: '',
		notes: '',
		promoCode: '',
		duration: 1,
		termsAccepted: false,
		additionalServices: [],
	});

	// Fetch Service data
	useEffect(() => {
		if (!serviceId) {
			setError('Service ID is required');
			setLoading(false);
			return;
		}

		const fetchService = async () => {
			setLoading(true);
			setError(null);

			try {
				const resp = await serviceProviderService.getServiceByIdOrSlug(
					serviceId
				);
				setService(resp);
				if (resp.durationHours) {
					dispatch({ type: 'SET_DURATION', payload: resp.durationHours });
				}
			} catch (err) {
				console.error('Failed to fetch service:', err);
				setError('Unable to load service details. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchService();
	}, [serviceId]);

	// Fetch other services from the same provider
	useEffect(() => {
		if (!service?.provider?._id) return;

		const fetchProviderServices = async () => {
			setLoadingServices(true);
			try {
				const resp = await serviceProviderService.getProviderServices(
					service.provider._id,
					{
						active: true,
						limit: 3,
					}
				);
				// console.log('Api response for provider services: ', resp);

				// Filter out the current service
				const otherServices =
					resp?.data?.filter((s: Service) => s._id !== serviceId) || [];
				setProviderServices(otherServices);
			} catch (err) {
				console.error('Failed to fetch provider services:', err);
			} finally {
				setLoadingServices(false);
			}
		};

		fetchProviderServices();
	}, [service, serviceId]);

	// IMPROVED: Calculate total price including additional services
	const calculateTotalPrice = useCallback(() => {
		if (!service) return 0;

		// Base service price
		const basePrice = service.hourlyRate || 0;
		const extraHours = Math.max(
			0,
			bookingState.duration - (service.durationHours || 0)
		);
		const extraCost = extraHours * (service.hourlyRate || 0);
		let total = basePrice + extraCost;

		// Add additional services prices
		bookingState.additionalServices.forEach((serviceId) => {
			const additionalService = providerServices.find(
				(s) => s._id === serviceId
			);
			if (additionalService) {
				total += additionalService.hourlyRate || 0;
			}
		});

		// TODO: Apply promo code discount
		// if (bookingState.promoCode) {
		//   total = applyPromoCode(total, bookingState.promoCode);
		// }

		return total;
	}, [
		service,
		bookingState.duration,
		bookingState.additionalServices,
		providerServices,
	]);

	// Format date for display
	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Format time for display
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	//  Toggle additional service selection
	const handleToggleService = useCallback(
		(serviceId: string) => {
			if (bookingState.additionalServices.includes(serviceId)) {
				dispatch({ type: 'REMOVE_SERVICE', payload: serviceId });
			} else {
				dispatch({ type: 'ADD_SERVICE', payload: serviceId });
			}
		},
		[bookingState.additionalServices]
	);

	// Inside your component, update handleSubmitBooking:
	const handleSubmitBooking = useCallback(async () => {
		if (!service || !bookingState.termsAccepted) return;

		// Validation
		if (!bookingState.address.trim()) {
			alert('Please enter your service address');
			return;
		}

		if (!bookingState.phone.trim()) {
			alert('Please enter your phone number');
			return;
		}

		// Phone validation (basic)
		const phoneRegex = /^[0-9]{10,15}$/;
		if (!phoneRegex.test(bookingState.phone.replace(/\s+/g, ''))) {
			alert('Please enter a valid phone number');
			return;
		}

		setSubmitting(true);

		try {
			// Calculate price breakdown
			const basePrice = service.hourlyRate || 0;
			const baseDuration = service.durationHours || 0;
			const extraHours = Math.max(0, bookingState.duration - baseDuration);

			// Calculate additional services total
			let additionalServicesTotal = 0;
			const additionalServicesData = bookingState.additionalServices
				.map((serviceId) => {
					const additionalService = providerServices.find(
						(s) => s._id === serviceId
					);
					if (additionalService) {
						additionalServicesTotal += additionalService.hourlyRate || 0;
						return {
							serviceId: additionalService._id!,
							title: additionalService.title,
							price: additionalService.hourlyRate || 0,
							durationHours: additionalService.durationHours || 0,
						};
					}
					return null;
				})
				.filter(Boolean) as any[];

			const totalAmount = calculateTotalPrice();

			// Prepare booking payload
			const bookingPayload: CreateBookingPayload = {
				serviceId: service._id!,
				providerId: service.provider?._id!,
				scheduledDate: bookingState.selectedDate.toISOString(),
				scheduledTime: bookingState.selectedTime.toISOString(),
				address: bookingState.address,
				phone: bookingState.phone,
				notes: bookingState.notes || undefined,
				promoCode: bookingState.promoCode || undefined,
				duration: bookingState.duration,
				additionalServices: additionalServicesData,
				priceBreakdown: {
					basePrice,
					baseDuration,
					extraHours,
					additionalServicesTotal,
					promoDiscount: 0, // TODO: Calculate from promo code
					totalAmount,
				},
			};

			console.log('Booking payload:', bookingPayload);

			// Make API call
			const response = await bookingService.createBooking(bookingPayload);

			console.log('Booking response:', response);

			// Show success message
			// alert(response.message || 'Booking created successfully!');

			// Navigate to confirmation screen
			router.push({
				pathname: '/(root)/plant-care/booking/confirmation',
				params: {
					bookingId: response.data._id,
					bookingNumber: response.data.bookingNumber,
				},
			});
		} catch (err: any) {
			console.error('Booking failed:', err);
			const errorMessage =
				err.response?.data?.message ||
				'Failed to create booking. Please try again.';
			alert(errorMessage);
		} finally {
			setSubmitting(false);
		}
	}, [service, bookingState, calculateTotalPrice, providerServices]);

	// Render additional service item
	const renderServiceItem = useCallback(
		({ item }: { item: Service }) => {
			const isSelected = bookingState.additionalServices.includes(item?._id!);

			return (
				<TouchableOpacity
					onPress={() => handleToggleService(item._id!)}
					className={`mb-3 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border ${
						isSelected
							? 'border-light-pallete-400 dark:border-light-pallete-300'
							: 'border-gray-100 dark:border-gray-800'
					}`}
					style={{ width: '100%' }}
					activeOpacity={0.7}
				>
					<View className="flex-row items-center p-3 gap-3">
						{/* Image Section */}
						<View className="relative">
							{item.image?.url ? (
								<Image
									source={{ uri: item.image.url }}
									className="size-[64px] rounded-full"
									resizeMode="cover"
								/>
							) : (
								<View className="size-16 rounded-xl bg-gray-100 dark:bg-gray-800 items-center justify-center">
									<Ionicons
										name="image-outline"
										size={24}
										color={COLORS.gray[400]}
									/>
								</View>
							)}
						</View>

						{/* Content Section */}
						<View className="flex-1 gap-1">
							<Text
								className="text-base font-nexa-bold leading-5 text-gray-900 dark:text-gray-100"
								numberOfLines={1}
							>
								{item.title}
							</Text>

							<Text
								className="text-sm font-nexa text-justify text-gray-500 dark:text-gray-400 leading-4"
								numberOfLines={2}
							>
								{item.description}
							</Text>

							{/* Price & Duration inline */}
							<View className="flex-row items-center gap-3 mt-1">
								<View className="flex-row items-center gap-1">
									<Text className="text-sm font-nexa-extrabold text-gray-600 dark:text-gray-500">
										Rs {item.hourlyRate || 0}
									</Text>
								</View>

								<View className="flex-row items-center gap-1">
									<Ionicons
										name="time-outline"
										size={14}
										color={COLORS.gray[400]}
									/>
									<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa">
										{item.durationHours}h
									</Text>
								</View>
							</View>
						</View>

						{/* Action Button */}
						<View className="ml-2">
							<View
								className={`size-8 rounded-full items-center justify-center 
										bg-light-pallete-400 dark:bg-light-pallete-300
										'
								}`}
							>
								<Image
									source={isSelected ? icons.checkmark : icons.add}
									className="w-4 h-4"
									resizeMode="contain"
									tintColor="white"
								/>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			);
		},
		[bookingState.additionalServices, handleToggleService]
	);

	// LOADING STATE
	if (loading) {
		return (
			<LoadingScreen
				headerTitle="Booking Details"
				description="Loading booking details..."
			/>
		);
	}

	// ERROR STATE
	if (error || !service) {
		return <ErrorScreen error={error!} headerTitle="Book Service" />;
	}

	const totalPrice = calculateTotalPrice();

	// MAIN BOOKING SCREEN
	return (
		<SafeAreaView
			className="flex-1 bg-light-screen dark:bg-gray-950"
			edges={['bottom', 'left', 'right']}
		>
			<CustomHeader
				title="Book Service"
				iconLeft={
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={isDark ? 'white' : 'black'}
					/>
				}
				onIconLeftPress={() => router.back()}
			/>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* SERVICE SUMMARY CARD */}
				<View className="mx-4 mt-4 mb-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
					<View className="flex-row">
						{service.image?.url ? (
							<Image
								source={{ uri: service.image.url }}
								className="w-20 h-20 rounded-lg"
								resizeMode="cover"
							/>
						) : (
							<View className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-800 items-center justify-center">
								<Ionicons
									name="image-outline"
									size={32}
									color={COLORS.gray[400]}
								/>
							</View>
						)}
						<View className="flex-1 ml-3">
							<Text className="text-xs text-primary font-nexa-bold mb-1">
								{formatServiceType(service.serviceType)}
							</Text>
							<Text
								className="text-base font-nexa-bold text-gray-900 dark:text-gray-100"
								numberOfLines={2}
							>
								{service.title}
							</Text>
							<Text className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-nexa">
								{service.provider?.serviceProviderProfile?.businessName}
							</Text>
						</View>
					</View>
				</View>

				{/* DATE & TIME SELECTION */}
				<View className="mx-4 px-4 py-2 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<View className="flex-row gap-x-1">
						<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
							Schedule
						</Text>
						<Text className="text-xl text-red-500 dark:text-red-400 font-nexa">
							*
						</Text>
					</View>

					<TouchableOpacity
						onPress={() => dispatch({ type: 'TOGGLE_DATE_PICKER' })}
						className="bg-transparent rounded-xl p-2 mb-3 flex-row items-center justify-between border border-gray-300 dark:border-gray-700"
					>
						<View className="flex-row items-center flex-1">
							<Image
								source={icons.calendar}
								className="w-5 h-5"
								resizeMode="contain"
								tintColor={isDark ? COLORS.gray[400] : COLORS.gray[500]}
							/>
							<View className="ml-3">
								<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa">
									Date
								</Text>
								<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
									{formatDate(bookingState.selectedDate)}
								</Text>
							</View>
						</View>
						<Ionicons
							name="chevron-forward-outline"
							size={16}
							color={COLORS.gray[400]}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => dispatch({ type: 'TOGGLE_TIME_PICKER' })}
						className="bg-transparent rounded-xl p-2 mb-1 flex-row items-center justify-between border border-gray-300 dark:border-gray-700"
					>
						<View className="flex-row items-center flex-1">
							<Image
								source={icons.clock}
								className="w-6 h-6"
								resizeMode="contain"
								tintColor={isDark ? COLORS.gray[400] : COLORS.gray[500]}
							/>
							<View className="ml-3">
								<Text className="text-xs text-gray-500 dark:text-gray-400 font-nexa">
									Time
								</Text>
								<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
									{formatTime(bookingState.selectedTime)}
								</Text>
							</View>
						</View>
						<Ionicons
							name="chevron-forward-outline"
							size={16}
							color={COLORS.gray[400]}
						/>
					</TouchableOpacity>

					{bookingState.showDatePicker && (
						<DateTimePicker
							value={bookingState.selectedDate}
							mode="date"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={(event, selectedDate) => {
								if (selectedDate) {
									dispatch({ type: 'SET_DATE', payload: selectedDate });
								} else {
									dispatch({ type: 'TOGGLE_DATE_PICKER' });
								}
							}}
							minimumDate={new Date()}
						/>
					)}

					{bookingState.showTimePicker && (
						<DateTimePicker
							value={bookingState.selectedTime}
							mode="time"
							display={Platform.OS === 'ios' ? 'spinner' : 'default'}
							onChange={(event, selectedTime) => {
								if (selectedTime) {
									dispatch({ type: 'SET_TIME', payload: selectedTime });
								} else {
									dispatch({ type: 'TOGGLE_TIME_PICKER' });
								}
							}}
						/>
					)}
				</View>

				{/* DURATION SELECTION */}
				<View className="mx-4 px-4 py-4 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<View className="flex-row items-center justify-between">
						<View className="flex-row gap-x-1">
							<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
								Duration
							</Text>
							<Text className="text-xl text-red-500 dark:text-red-400 font-nexa">
								*
							</Text>
						</View>
						<View className="flex-row items-center">
							{/* Minus Btn */}
							<TouchableOpacity
								onPress={() =>
									dispatch({
										type: 'SET_DURATION',
										payload: Math.max(1, bookingState.duration - 0.5),
									})
								}
								className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
							>
								<Ionicons
									name="remove-outline"
									size={18}
									color={isDark ? 'white' : 'black'}
								/>
							</TouchableOpacity>
							{/* Hours */}
							<Text className="text-base font-nexa-bold text-gray-900 dark:text-gray-100 mx-2 px-2 text-center w-[60px]">
								{bookingState.duration} hr
							</Text>
							<TouchableOpacity
								onPress={() =>
									dispatch({
										type: 'SET_DURATION',
										payload: bookingState.duration + 0.5,
									})
								}
								className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
							>
								<Ionicons
									name="add-outline"
									size={18}
									color={isDark ? 'white' : 'black'}
								/>
							</TouchableOpacity>
						</View>
					</View>
					{bookingState.duration > (service.durationHours || 0) && (
						<Text className="text-xs text-blue-600 dark:text-blue-400 mt-3 mb-1 font-nexa">
							Additional Rs {service.hourlyRate}/hr will be charged for extra
							hours
						</Text>
					)}
				</View>

				{/* SERVICE ADDRESS */}
				<View className="mx-4 px-4 py-2 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<View className="flex-row gap-x-1">
						<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100 mb-3">
							Location Address
						</Text>
						<Text className="text-xl text-red-500 dark:text-red-400 font-nexa">
							*
						</Text>
					</View>
					<TextInput
						value={bookingState.address}
						onChangeText={(text) =>
							dispatch({ type: 'SET_ADDRESS', payload: text })
						}
						placeholder="Enter your complete address"
						placeholderTextColor={COLORS.gray[400]}
						multiline
						numberOfLines={3}
						className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-gray-100 font-nexa mb-1"
						style={{ textAlignVertical: 'top' }}
					/>
				</View>

				{/* PHONE NUMBER */}
				<View className="mx-4 px-4 py-2 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<View className="flex-row gap-x-1">
						<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100 mb-3">
							Phone Number
						</Text>
						<Text className="text-xl text-red-500 dark:text-red-400 font-nexa">
							*
						</Text>
					</View>
					<TextInput
						value={bookingState.phone}
						onChangeText={(text) =>
							dispatch({ type: 'SET_PHONE', payload: text })
						}
						placeholder="Enter your phone number"
						placeholderTextColor={COLORS.gray[400]}
						keyboardType="phone-pad"
						className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-gray-100 font-nexa mb-1"
					/>
				</View>

				{/* ADDITIONAL NOTES */}
				<View className="mx-4 px-4 py-2 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<View className="mb-3 flex-row items-center gap-x-1">
						<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
							Additional Notes
						</Text>
						<Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-nexa">
							(Optional)
						</Text>
					</View>
					<TextInput
						value={bookingState.notes}
						onChangeText={(text) =>
							dispatch({ type: 'SET_NOTES', payload: text })
						}
						placeholder="Any special instructions or requirements..."
						placeholderTextColor={COLORS.gray[400]}
						multiline
						numberOfLines={4}
						className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-gray-100 font-nexa mb-1"
						style={{ textAlignVertical: 'top' }}
					/>
				</View>

				{/* PROMO CODE */}
				<View className="mx-4 px-4 py-2 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<View className="mb-3 flex-row items-center gap-x-1">
						<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
							Promo Code
						</Text>
						<Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-nexa">
							(Optional)
						</Text>
					</View>

					<View className="flex-row items-center gap-2">
						<TextInput
							value={bookingState.promoCode}
							onChangeText={(text) =>
								dispatch({
									type: 'SET_PROMO_CODE',
									payload: text.toUpperCase(),
								})
							}
							placeholder="Enter promo code"
							placeholderTextColor={COLORS.gray[400]}
							autoCapitalize="characters"
							className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-gray-100 font-nexa"
						/>

						<TouchableOpacity
							onPress={() => {
								// TODO: Validate promo code
								console.log('Apply promo code:', bookingState.promoCode);
							}}
							disabled={!bookingState.promoCode.trim()}
							className={`px-5 py-3.5 rounded-xl ${
								bookingState.promoCode.trim()
									? 'bg-primary'
									: 'bg-gray-300 dark:bg-gray-700'
							}`}
						>
							<Text
								className={`font-nexa-bold ${
									bookingState.promoCode.trim() ? 'text-white' : 'text-gray-500'
								}`}
							>
								Apply
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* PRICE BREAKDOWN */}
				<View className="mx-4 px-4 py-2 mb-6 bg-white dark:bg-gray-900 rounded-xl">
					<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100 mb-3">
						Bill Summary
					</Text>
					<View className="bg-white dark:bg-gray-900 rounded-xl">
						<View className="flex-row justify-between mb-2">
							<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa">
								Base Price ({service.durationHours || 0}h)
							</Text>
							<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
								Rs {service?.hourlyRate || 0}
							</Text>
						</View>
						{bookingState.duration > (service.durationHours || 0) && (
							<View className="flex-row justify-between mb-2">
								<Text className="text-sm text-gray-600 dark:text-gray-400 font-nexa">
									Extra Hours (
									{bookingState.duration - (service.durationHours || 0)}h)
								</Text>
								<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
									Rs{' '}
									{(bookingState.duration - (service.durationHours || 0)) *
										(service.hourlyRate || 0)}
								</Text>
							</View>
						)}
						{/*  Show additional services in breakdown */}
						{bookingState.additionalServices.map((serviceId) => {
							const additionalService = providerServices.find(
								(s) => s._id === serviceId
							);
							if (!additionalService) return null;
							return (
								<View key={serviceId} className="flex-row justify-between mb-2">
									<Text
										className="text-sm text-gray-600 dark:text-gray-400 font-nexa flex-1"
										numberOfLines={1}
									>
										{additionalService.title}
									</Text>
									<Text className="text-sm font-nexa-bold text-gray-900 dark:text-gray-100">
										Rs {additionalService.hourlyRate || 0}
									</Text>
								</View>
							);
						})}
						<View className="border-t border-dashed border-gray-200 dark:border-gray-700 mt-2 pt-2">
							<View className="flex-row justify-between">
								<Text className="text-sm mb-1 font-nexa-bold text-gray-900 dark:text-gray-100">
									Payable Amount
								</Text>
								<Text className="text-sm font-nexa-extrabold text-primary">
									Rs {totalPrice}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* OTHER SERVICES FROM PROVIDER */}
				{providerServices.length > 0 && (
					<View className="mb-6">
						<View className="px-4">
							<SectionHeader
								label="You may also need"
								subtitle={`Other services by ${service.provider?.serviceProviderProfile?.businessName}`}
							/>
						</View>
						{loadingServices ? (
							<View className="px-4">
								<LottieLoader
									animation={animations.spinner}
									size={40}
									color={COLORS.light.pallete[400]}
								/>
							</View>
						) : (
							<FlatList
								data={providerServices}
								keyExtractor={(item) => item._id!}
								scrollEnabled={false}
								renderItem={renderServiceItem}
								contentContainerStyle={{
									paddingHorizontal: 16,
									paddingBottom: 20,
									flexGrow: 1,
								}}
								showsVerticalScrollIndicator={false}
								ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
								ListEmptyComponent={
									<View className="flex-1 items-center justify-center py-16 px-6">
										<View className="bg-gray-100 dark:bg-gray-800 rounded-full size-20 items-center justify-center mb-4">
											<Ionicons
												name="cube-outline"
												size={40}
												color={COLORS.gray[400]}
											/>
										</View>
										<Text className="text-lg font-nexa-bold text-gray-900 dark:text-gray-100 text-center mb-2">
											No Additional Services
										</Text>
										<Text className="text-sm text-gray-500 dark:text-gray-400 font-nexa text-center leading-5">
											This provider doesn&apos;t have any extra services
											available at the moment
										</Text>
									</View>
								}
								// Performance optimization
								removeClippedSubviews={true}
								maxToRenderPerBatch={10}
								updateCellsBatchingPeriod={50}
								initialNumToRender={8}
								windowSize={10}
								// Refresh functionality (optional)
								refreshing={false}
								onRefresh={() => {
									// Add your refresh logic here if needed
								}}
							/>
						)}
					</View>
				)}

				{/* TERMS & CONDITIONS */}
				<View className="px-4 mb-6">
					<TouchableOpacity
						onPress={() => dispatch({ type: 'TOGGLE_TERMS' })}
						className="flex-row items-start justify-center"
						activeOpacity={0.7}
					>
						<View
							className={`size-6 rounded border-2 items-center justify-center mr-3 ${
								bookingState.termsAccepted
									? 'bg-primary border-primary'
									: 'border-gray-300 dark:border-gray-600'
							}`}
						>
							{bookingState.termsAccepted && (
								<Ionicons name="checkmark" size={16} color="white" />
							)}
						</View>

						<Text className="flex-1 text-xs leading-4 text-gray-600 dark:text-gray-400 font-nexa">
							I agree to the{' '}
							<Text className="text-primary font-nexa-bold">
								Terms & Conditions
							</Text>{' '}
							and{' '}
							<Text className="text-primary font-nexa-bold">
								Cancellation Policy
							</Text>
						</Text>
					</TouchableOpacity>
				</View>

				{/* BOOK BUTTON */}
				<View className="px-4 pb-6">
					<CustomButton
						label={submitting ? 'Processing...' : 'Confirm Booking'}
						onPress={handleSubmitBooking}
						disabled={!bookingState.termsAccepted || submitting}
						className="mb-2"
					/>

					<Text className="text-xs text-center text-gray-500 dark:text-gray-400 font-nexa">
						You won&apos;t be charged until the service is completed
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
export default ServiceBooking;
