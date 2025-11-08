import Alert from '@/components/Alert';
import CustomButton from '@/components/CustomButton';
import LottieLoader from '@/components/LottieLoader';
import DynamicModal from '@/components/Modal';
import { animations } from '@/constants/animations';
import { COLORS } from '@/constants/colors';
import { CELL_COUNT, RESEND_COOLDOWN } from '@/constants/constant';
import { ModalProps, OtpContext } from '@/interfaces/interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
	clearError,
	sendOTP,
	updateUser,
	verifyOTP,
} from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { verifyEmailChange } from '@/services/user.services';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyOtp() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isLoading, error, user, token, pendingEmail, resetVerified } =
		useAppSelector((state: RootState) => state.auth);

	// Get email and context from params
	const {
		email: emailFromParam,
		context,
		startCountdown,
	} = useLocalSearchParams<{
		email: string;
		context: OtpContext;
		startCountdown: string;
	}>();

	// Resolve email
	const email = useMemo(
		() => (emailFromParam as string) || pendingEmail || user?.email || '',
		[emailFromParam, pendingEmail, user?.email]
	);

	// Normalize context to backend values
	const apiContext = useMemo(() => {
		const raw = (context as string) || 'signup';
		if (raw === 'reset-password' || raw === 'password-reset')
			return 'password-reset';
		if (raw === 'change-email' || raw === 'email-change') return 'change-email';
		return 'signup';
	}, [context]);

	// OTP input state
	const [value, setValue] = useState('');
	const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});
	const [startTimer, setStartTimer] = useState<boolean | null>(
		startCountdown === 'true'
	);

	const [verifyLoading, setVerifyLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);

	// Resend cooldown state with persistent storage
	const [resendLeft, setResendLeft] = useState(0);
	const [isCountdownActive, setIsCountdownActive] = useState(false);
	const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Modal state
	const [modalData, setModalData] = useState<ModalProps | null>(null);

	// Storage keys for persisting countdown
	const getStorageKeys = useCallback(
		() => ({
			countdownKey: `otp_countdown_${email}_${apiContext}`,
			timestampKey: `otp_timestamp_${email}_${apiContext}`,
		}),
		[email, apiContext]
	);

	// Clear timer utility
	const clearTimer = useCallback(() => {
		if (resendTimerRef.current) {
			clearInterval(resendTimerRef.current);
			resendTimerRef.current = null;
		}
	}, []);

	// Load persisted countdown state
	const loadCountdownState = useCallback(async () => {
		try {
			const { countdownKey, timestampKey } = getStorageKeys();
			const [savedCountdown, savedTimestamp] = await Promise.all([
				AsyncStorage.getItem(countdownKey),
				AsyncStorage.getItem(timestampKey),
			]);

			if (savedCountdown && savedTimestamp) {
				const lastTimestamp = parseInt(savedTimestamp);
				const currentTime = Date.now();
				const elapsedSeconds = Math.floor((currentTime - lastTimestamp) / 1000);
				const remainingTime = parseInt(savedCountdown) - elapsedSeconds;

				if (remainingTime > 0) {
					setResendLeft(remainingTime);
					setIsCountdownActive(true);
					return remainingTime;
				} else {
					await AsyncStorage.multiRemove([countdownKey, timestampKey]);
				}
			}
		} catch (error) {
			console.error('Error loading countdown state:', error);
		}
		return 0;
	}, [getStorageKeys]);

	// Save countdown state
	const saveCountdownState = useCallback(
		async (countdown: number) => {
			try {
				const { countdownKey, timestampKey } = getStorageKeys();
				await AsyncStorage.multiSet([
					[countdownKey, countdown.toString()],
					[timestampKey, Date.now().toString()],
				]);
			} catch (error) {
				console.error('Error saving countdown state:', error);
			}
		},
		[getStorageKeys]
	);

	// Clear countdown state
	const clearCountdownState = useCallback(async () => {
		try {
			const { countdownKey, timestampKey } = getStorageKeys();
			await AsyncStorage.multiRemove([countdownKey, timestampKey]);
		} catch (error) {
			console.error('Error clearing countdown state:', error);
		}
	}, [getStorageKeys]);

	// Start resend cooldown
	const startResendCooldown = useCallback(
		async (initialCount = RESEND_COOLDOWN) => {
			clearTimer();
			setResendLeft(initialCount);
			setIsCountdownActive(true);
			await saveCountdownState(initialCount);

			resendTimerRef.current = setInterval(async () => {
				setResendLeft((prev) => {
					const newCount = prev - 1;
					if (newCount <= 0) {
						clearTimer();
						setIsCountdownActive(false);
						clearCountdownState();
						return 0;
					}
					if (newCount % 10 === 0) {
						saveCountdownState(newCount);
					}
					return newCount;
				});
			}, 1000);
		},
		[clearTimer, saveCountdownState, clearCountdownState]
	);

	// load existing countdown
	useEffect(() => {
		const initializeCountdown = async () => {
			if (context === 'signup' && startTimer) {
				setStartTimer(false);
				await startResendCooldown(RESEND_COOLDOWN);
			} else {
				const remainingTime = await loadCountdownState();
				if (remainingTime > 0) {
					startResendCooldown(remainingTime);
				}
			}
		};

		initializeCountdown();

		return () => {
			clearTimer();
			if (error) dispatch(clearError());
		};
	}, [
		loadCountdownState,
		startResendCooldown,
		clearTimer,
		dispatch,
		error,
		context,
		emailFromParam,
		startTimer,
	]);

	// Show success modal
	useEffect(() => {
		if (token && apiContext === 'signup') {
			setModalData({
				visible: true,
				title: 'Verified!',
				description: 'Welcome aboard. You can now enjoy all features.',
				icon: <Ionicons name="checkmark-circle" size={70} color="#22C55E" />,
				primaryButton: {
					label: 'Go to Home',
					onPress: () => {
						setModalData(null);
						router.replace('/(root)/home');
					},
					className: 'bg-green-600',
					textClassName: 'text-white',
				},
			});
		} else if (resetVerified && apiContext === 'password-reset') {
			setModalData({
				visible: true,
				title: 'Verification Successful!',
				description: 'You can now reset your password.',
				icon: <Ionicons name="checkmark-circle" size={70} color="#22C55E" />,
				primaryButton: {
					label: 'Reset Password',
					onPress: () => {
						setModalData(null);
						router.replace({
							pathname: '/(auth)/reset-password',
							params: { email },
						});
					},
					className: 'bg-green-600',
					textClassName: 'text-white',
				},
			});
		}
	}, [token, resetVerified, apiContext, router, email]);

	// Verify OTP handler
	// const handleVerify = useCallback(async () => {
	// 	console.log(apiContext);

	// 	if (value.length !== CELL_COUNT) return;
	// 	setVerifyLoading(true);

	// 	try {
	// 		const action = await dispatch(
	// 			verifyOTP({ email, otp: value, context: apiContext })
	// 		);

	// 		if (verifyOTP.fulfilled.match(action)) {
	// 			const { user } = action.payload;

	// 			if (apiContext === 'change-email') {
	// 				if (user) {
	// 					dispatch(updateUser(user));
	// 				}
	// 				setModalData({
	// 					visible: true,
	// 					title: 'Email Updated',
	// 					description: 'Your email has been successfully updated.',
	// 					icon: (
	// 						<Ionicons name="checkmark-circle" size={70} color="#22C55E" />
	// 					),
	// 					primaryButton: {
	// 						label: 'OK',
	// 						onPress: () => {
	// 							setModalData(null);
	// 							router.back();
	// 						},
	// 						className: 'bg-green-500',
	// 						textClassName: 'text-white',
	// 					},
	// 				});
	// 			}
	// 			// signup and reset flows handled via useEffect
	// 		}
	// 	} catch (err) {
	// 		console.error('Verification error: ', err);
	// 	} finally {
	// 		setVerifyLoading(false);
	// 	}
	// }, [value, email, apiContext, dispatch, router]);

	const handleVerify = async () => {
		if (value.length !== CELL_COUNT) return;
		setVerifyLoading(true);

		try {
			if (apiContext === 'change-email') {
				const response = await verifyEmailChange(email, value);

				if (response.success) {
					// update UI with modal
					setModalData({
						visible: true,
						title: 'Email Updated',
						description: 'Your email has been successfully updated.',
						icon: (
							<Ionicons name="checkmark-circle" size={70} color="#22C55E" />
						),
						primaryButton: {
							label: 'OK',
							onPress: () => {
								setModalData(null);
								router.back();
							},
							className: 'bg-green-500',
							textClassName: 'text-white',
						},
					});

					// update user
					dispatch(updateUser(response.user!));
				}
			} else {
				// existing signup / password-reset flow (redux thunk)
				await dispatch(verifyOTP({ email, otp: value, context: apiContext }));
			}
		} catch (err: any) {
			console.error(
				'Email change verify error:',
				err.response?.data || err.message
			);
		} finally {
			setVerifyLoading(false);
		}
	};

	const canResend =
		!isCountdownActive && !!email && !isLoading && !resendLoading;

	// Resend OTP handler
	const resendOTP = useCallback(async () => {
		if (!email || !canResend) return;
		setResendLoading(true);

		try {
			const action = await dispatch(sendOTP({ email, context: apiContext }));
			if (sendOTP.fulfilled.match(action)) {
				setValue('');
				setModalData({
					visible: true,
					title: 'OTP Sent!',
					description: `A new verification code has been sent to ${email}`,
					icon: <Ionicons name="mail" size={70} color="#22C55E" />,
					primaryButton: {
						label: 'OK',
						onPress: () => setModalData(null),
						className: 'bg-green-500',
						textClassName: 'text-white',
					},
				});
				startResendCooldown();
			}
		} catch (error) {
			console.error('Resend OTP error:', error);
		} finally {
			setResendLoading(false);
		}
	}, [dispatch, email, canResend, startResendCooldown, apiContext]);

	const formatTime = useCallback((total: number) => {
		const mm = Math.floor(total / 60)
			.toString()
			.padStart(2, '0');
		const ss = (total % 60).toString().padStart(2, '0');
		return `${mm}:${ss}`;
	}, []);

	const getVerifyButtonLabel = () => {
		switch (apiContext) {
			case 'signup':
				return verifyLoading ? 'Verifying...' : 'Verify & Continue';
			case 'change-email':
				return verifyLoading ? 'Verifying...' : 'Verify Email';
			case 'password-reset':
				return verifyLoading ? 'Verifying...' : 'Verify & Reset';
			default:
				return verifyLoading ? 'Verifying...' : 'Verify';
		}
	};

	const renderCellContent = useCallback(
		({
			index,
			symbol,
			isFocused,
		}: {
			index: number;
			symbol: string | null;
			isFocused: boolean;
		}) => (
			<View
				key={index}
				className={`w-[55px] h-[55px] justify-center items-center border-2 rounded-lg ${
					isFocused
						? 'border-light-accent dark:border-dark-accent'
						: 'border-gray-300 dark:border-gray-600'
				} mx-[6px]`}
				onLayout={getCellOnLayoutHandler(index)}
			>
				<Text className="text-2xl font-nexa-extrabold text-light-pallete-950 dark:text-gray-50">
					{symbol || (isFocused ? <Cursor /> : null)}
				</Text>
			</View>
		),
		[getCellOnLayoutHandler]
	);

	return (
		<SafeAreaView className="flex-1 bg-light-screen dark:bg-gray-950">
			<KeyboardAwareScrollView
				contentContainerStyle={styles.container}
				enableOnAndroid
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={20}
				showsVerticalScrollIndicator={false}
			>
				<View className="main-container">
					<View className="flex justify-center items-center mb-8 border border-light-pallete-500 px-3 py-2 rounded-[10px]">
						<Ionicons name="mail-outline" size={50} color="#4d7111" />
					</View>

					<Text className="text-3xl font-nexa-heavy mb-4 text-light-pallete-950 dark:text-white">
						Verify Your Email
					</Text>

					<Text className="text-sm font-nexa leading-5 text-center max-w-[80%] mb-4 text-gray-500 dark:text-white">
						Enter the {CELL_COUNT}-digit verification code we sent to{' '}
						<Text className="font-nexa-extrabold">{email || 'your email'}</Text>
					</Text>

					<CodeField
						ref={ref}
						{...props}
						value={value}
						onChangeText={setValue}
						cellCount={CELL_COUNT}
						rootStyle={styles.codeFieldRoot}
						keyboardType="number-pad"
						textContentType="oneTimeCode"
						renderCell={renderCellContent}
					/>

					<View className="flex-row justify-center items-center mt-2">
						{isCountdownActive && resendLeft > 0 ? (
							<Text className="text-body-sm text-gray-500">
								Resend in{' '}
								<Text className="font-nexa-extrabold text-link">
									{formatTime(resendLeft)}
								</Text>
							</Text>
						) : (
							<View className="flex flex-row items-center h-[40px]">
								<Text className="text-body-sm">
									Didn&apos;t receive the code?{' '}
								</Text>
								{resendLoading ? (
									<LottieLoader
										animation={animations.spinner}
										color={COLORS.light.pallete[500]}
									/>
								) : (
									<Text
										className={`font-nexa-extrabold ${
											canResend ? 'text-link' : 'text-gray-400'
										}`}
										onPress={canResend ? resendOTP : undefined}
									>
										Resend
									</Text>
								)}
							</View>
						)}
					</View>

					{error && (
						<Alert
							variant="error"
							message={error}
							className="mt-6"
							dismissible
							onDismiss={() => dispatch(clearError())}
						/>
					)}
				</View>

				<View className="w-full px-4 mb-6 mt-12">
					<CustomButton
						label={getVerifyButtonLabel()}
						accessibilityLabel={getVerifyButtonLabel()}
						accessibilityRole="button"
						onPress={handleVerify}
						disabled={verifyLoading || value.length !== CELL_COUNT}
						loading={verifyLoading}
					/>
				</View>
			</KeyboardAwareScrollView>

			{modalData && (
				<DynamicModal
					visible={modalData.visible}
					title={modalData.title}
					description={modalData.description}
					icon={modalData.icon}
					primaryButton={modalData.primaryButton}
					secondaryButton={modalData.secondaryButton}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flexGrow: 1, justifyContent: 'center' },
	codeFieldRoot: { marginTop: 20, justifyContent: 'center' },
});
