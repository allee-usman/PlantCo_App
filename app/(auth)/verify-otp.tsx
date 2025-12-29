import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
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

// Custom Hook: Countdown Timer
const useOtpCountdown = (email: string, context: string, start: boolean) => {
	const [resendLeft, setResendLeft] = useState(0);
	const [isCountdownActive, setIsCountdownActive] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const storageKeys = useMemo(
		() => ({
			countdownKey: `otp_countdown_${email}_${context}`,
			timestampKey: `otp_timestamp_${email}_${context}`,
		}),
		[email, context]
	);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const saveCountdown = useCallback(
		async (count: number) => {
			await AsyncStorage.multiSet([
				[storageKeys.countdownKey, count.toString()],
				[storageKeys.timestampKey, Date.now().toString()],
			]);
		},
		[storageKeys]
	);

	const clearCountdown = useCallback(async () => {
		await AsyncStorage.multiRemove([
			storageKeys.countdownKey,
			storageKeys.timestampKey,
		]);
	}, [storageKeys]);

	const startCountdown = useCallback(
		async (initialCount: number = RESEND_COOLDOWN) => {
			clearTimer();
			setResendLeft(initialCount);
			setIsCountdownActive(true);
			await saveCountdown(initialCount);

			timerRef.current = setInterval(async () => {
				setResendLeft((prev) => {
					const newCount = prev - 1;
					if (newCount <= 0) {
						clearTimer();
						setIsCountdownActive(false);
						clearCountdown();
						return 0;
					}
					if (newCount % 10 === 0) saveCountdown(newCount);
					return newCount;
				});
			}, 1000);
		},
		[clearTimer, saveCountdown, clearCountdown]
	);

	const loadCountdown = useCallback(async () => {
		try {
			const [savedCountdown, savedTimestamp] = await Promise.all([
				AsyncStorage.getItem(storageKeys.countdownKey),
				AsyncStorage.getItem(storageKeys.timestampKey),
			]);
			if (savedCountdown && savedTimestamp) {
				const elapsed = Math.floor(
					(Date.now() - parseInt(savedTimestamp)) / 1000
				);
				const remaining = parseInt(savedCountdown) - elapsed;
				if (remaining > 0) {
					setResendLeft(remaining);
					setIsCountdownActive(true);
					return remaining;
				} else {
					await clearCountdown();
				}
			}
		} catch (err) {
			console.error('Countdown load error:', err);
		}
		return 0;
	}, [storageKeys, clearCountdown]);

	useEffect(() => {
		if (start) {
			startCountdown(RESEND_COOLDOWN);
		} else {
			loadCountdown().then((remain) => {
				if (remain > 0) startCountdown(remain);
			});
		}

		return () => clearTimer();
	}, [start, startCountdown, loadCountdown, clearTimer]);

	return { resendLeft, isCountdownActive, startCountdown };
};

// Sub-component: Resend Timer
const ResendOtpTimer: React.FC<{
	resendLeft: number;
	isCountdownActive: boolean;
	canResend: boolean;
	onResend: () => void;
	loading: boolean;
}> = ({ resendLeft, isCountdownActive, canResend, onResend, loading }) => {
	const formatTime = (total: number) =>
		`${String(Math.floor(total / 60)).padStart(2, '0')}:${String(
			total % 60
		).padStart(2, '0')}`;

	return (
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
					<Text className="text-body-sm">Didn&apos;t receive the code? </Text>
					{loading ? (
						<LottieLoader
							animation={animations.spinner}
							color={COLORS.light.pallete[500]}
						/>
					) : (
						<Text
							className={`font-nexa-extrabold ${
								canResend ? 'text-link' : 'text-gray-400'
							}`}
							onPress={canResend ? onResend : undefined}
						>
							Resend
						</Text>
					)}
				</View>
			)}
		</View>
	);
};

// Sub-component: OTP Cell
const OtpCell: React.FC<{
	symbol: string | null;
	isFocused: boolean;
	index: number;
	getCellOnLayoutHandler: any;
}> = ({ symbol, isFocused, index, getCellOnLayoutHandler }) => (
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
);

// Main Component: VerifyOtp
export default function VerifyOtp() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isLoading, error, user, token, pendingEmail, resetVerified } =
		useAppSelector((state: RootState) => state.auth);
	const {
		email: emailFromParam,
		context,
		startCountdown,
	} = useLocalSearchParams<{
		email: string;
		context: OtpContext;
		startCountdown: string;
	}>();

	// Derived values
	const email = useMemo(
		() => (emailFromParam as string) || pendingEmail || user?.email || '',
		[emailFromParam, pendingEmail, user?.email]
	);
	const apiContext = useMemo(() => {
		const raw = (context as string) || 'signup';
		if (raw === 'reset-password' || raw === 'password-reset')
			return 'password-reset';
		if (raw === 'change-email' || raw === 'email-change') return 'change-email';
		return 'signup';
	}, [context]);

	// OTP input
	const [value, setValue] = useState('');
	const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	// Modal handling
	const [modalData, setModalData] = useState<ModalProps | null>(null);
	const openModal = useCallback((data: ModalProps) => setModalData(data), []);

	// Loading states
	const [loading, setLoading] = useReducer(
		(state: any, newState: any) => ({ ...state, ...newState }),
		{ verify: false, resend: false }
	);

	// Countdown hook
	const {
		resendLeft,
		isCountdownActive,
		startCountdown: startResendCooldown,
	} = useOtpCountdown(email, apiContext, startCountdown === 'true');

	const canResend =
		!isCountdownActive && !!email && !isLoading && !loading.resend;

	// Verify OTP Handler
	const handleVerify = async () => {
		if (value.length !== CELL_COUNT) return;
		setLoading({ verify: true });

		try {
			if (apiContext === 'change-email') {
				const response = await verifyEmailChange(email, value);
				if (response.success) {
					openModal({
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
					dispatch(updateUser(response.user!));
				}
			} else {
				await dispatch(verifyOTP({ email, otp: value, context: apiContext }));
			}
		} catch (err: any) {
			console.error('OTP verify error:', err.response?.data || err.message);
		} finally {
			setLoading({ verify: false });
		}
	};

	// Resend OTP Handler
	const resendOTP = useCallback(async () => {
		if (!email || !canResend) return;
		setLoading({ resend: true });

		try {
			const action = await dispatch(sendOTP({ email, context: apiContext }));
			if (sendOTP.fulfilled.match(action)) {
				setValue('');
				openModal({
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
		} catch (err) {
			console.error('Resend OTP error:', err);
		} finally {
			setLoading({ resend: false });
		}
	}, [dispatch, email, canResend, apiContext, startResendCooldown, openModal]);

	// Modal effects for signup/password-reset
	useEffect(() => {
		if (token && apiContext === 'signup') {
			openModal({
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
			openModal({
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
	}, [token, resetVerified, apiContext, router, email, openModal]);

	// Theme
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';

	// Render OTP Cell
	const renderCellContent = useCallback(
		({ index, symbol, isFocused }: any) => (
			<OtpCell
				index={index}
				symbol={symbol}
				isFocused={isFocused}
				getCellOnLayoutHandler={getCellOnLayoutHandler}
			/>
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
					<View className="flex justify-center items-center mb-8 border-2 border-light-pallete-500 px-3 py-2 rounded-[10px]">
						<Ionicons
							name="mail-outline"
							size={50}
							color={
								isDark ? COLORS.light.pallete[400] : COLORS.light.pallete[500]
							}
						/>
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

					<ResendOtpTimer
						resendLeft={resendLeft}
						isCountdownActive={isCountdownActive}
						canResend={canResend}
						onResend={resendOTP}
						loading={loading.resend}
					/>

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
						label={
							loading.verify
								? 'Verifying...'
								: apiContext === 'signup'
								? 'Verify & Continue'
								: apiContext === 'change-email'
								? 'Verify Email'
								: 'Verify'
						}
						accessibilityLabel="Verify OTP"
						accessibilityRole="button"
						onPress={handleVerify}
						disabled={loading.verify || value.length !== CELL_COUNT}
						loading={loading.verify}
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
