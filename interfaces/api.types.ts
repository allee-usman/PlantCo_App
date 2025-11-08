// src/interfaces/api.types.ts
import { User } from './types';

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
}

export interface AuthResponse {
	user: User;
	token?: string;
	expiresAt?: string;
}

export interface OTPResponse {
	expiresAt: string;
}

export interface PasswordResetResponse {
	success: boolean;
	message: string;
}
