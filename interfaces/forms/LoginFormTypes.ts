export interface LoginErrors {
	email?: string;
	password?: string;
}

export interface LoginFormData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export interface LoginScreenProps {
	onLogin?: (data: LoginFormData) => Promise<void>;
	onForgotPassword?: () => void;
	onSignUp?: () => void;
}

export interface FieldState {
	email: boolean;
	password: boolean;
}
