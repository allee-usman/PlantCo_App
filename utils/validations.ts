import {
	INPUT_CONSTRAINTS,
	VALIDATION_MESSAGES,
	VALIDATION_PATTERNS,
} from '@/constants/validationData';

export const validateEmail = (email: string): string | null => {
	if (!email.trim()) {
		return VALIDATION_MESSAGES.EMAIL_REQUIRED;
	}
	if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
		return VALIDATION_MESSAGES.EMAIL_INVALID;
	}
	return null;
};

export const validatePassword = (password: string): string | null => {
	if (!password.trim()) {
		return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
	}
	if (password.length < INPUT_CONSTRAINTS.PASSWORD_MIN_LENGTH) {
		return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
	}
	return null;
};

export const validateUsername = (username: string): string | null => {
	if (!username.trim()) {
		return VALIDATION_MESSAGES.USERNAME_REQUIRED;
	} else if (!VALIDATION_PATTERNS.USERNAME.test(username)) {
		return VALIDATION_MESSAGES.USERNAME_INVALID;
	} else if (username.length < INPUT_CONSTRAINTS.USERNAME_MIN_LENGTH) {
		return VALIDATION_MESSAGES.USERNAME_TOO_SHORT;
	} else {
		return null;
	}
};

export const validateConfirmPassword = (
	password: string,
	confirmPassword: string
): string | null => {
	if (!confirmPassword.trim()) {
		return 'Confirm password is required';
	}
	if (password !== confirmPassword) {
		return 'Passwords do not match';
	}
	return null;
};
