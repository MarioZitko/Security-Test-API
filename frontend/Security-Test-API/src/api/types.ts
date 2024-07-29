// src/api/types.ts
export interface ApiResponse<T> {
	data: T;
	key?: string;
}

export interface ApiError {
	message: string;
}

export interface ApiErrorResponse {
	message?: string; // Standard error message field
	// Include other fields that might be expected in the error response
}