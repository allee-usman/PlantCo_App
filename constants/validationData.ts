export const INPUT_CONSTRAINTS = {
	EMAIL_MAX_LENGTH: 254,
	PASSWORD_MIN_LENGTH: 8,
	PASSWORD_MAX_LENGTH: 128,
	USERNAME_MIN_LENGTH: 6,
	USERNAME_MAX_LENGTH: 15,
	MIN_NAME_LENGTH: 2,
	MAX_NAME_LENGTH: 50,
} as const;
export const VALIDATION_MESSAGES = {
	EMAIL_REQUIRED: 'Email is required',
	EMAIL_INVALID: 'Please enter a valid email',
	PASSWORD_REQUIRED: 'Password is required',
	PASSWORD_TOO_SHORT: `Password must be at least ${INPUT_CONSTRAINTS.PASSWORD_MIN_LENGTH} characters`,
	PASSWORD_NOT_MATCH: 'Passwords do not match',

	USERNAME_REQUIRED: 'Username is required',
	USERNAME_TOO_SHORT: `Username must be at least ${INPUT_CONSTRAINTS.USERNAME_MIN_LENGTH} characters`,
	USERNAME_TOO_LONG: `Username must be no more than ${INPUT_CONSTRAINTS.USERNAME_MAX_LENGTH} characters`,
	USERNAME_INVALID:
		'Username can only contain letters, numbers, and underscores',
} as const;

// validation patterns
export const VALIDATION_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	PHONE: /^[\+]?[1-9][\d]{0,15}$/,
	ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
	NAME: /^[a-zA-Z\s'-]+$/,
	USERNAME: /^[a-zA-Z0-9_]+$/,
} as const;
