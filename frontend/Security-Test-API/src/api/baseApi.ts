import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError,
} from "axios";
import { ApiResponse, ApiError, ApiErrorResponse } from "./types";

class BaseAPI {
	protected axiosInstance: AxiosInstance;

	constructor(baseURL: string) {
		this.axiosInstance = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.initializeInterceptors();
	}

	private initializeInterceptors = (): void => {
		this.axiosInstance.interceptors.response.use(
			this.handleResponse,
			this.handleError
		);
	};

	private handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
		return response.data.data;
	};

	protected handleError = (
		error: AxiosError<ApiErrorResponse>
	): Promise<ApiError> => {
		// Default message
		let errorMessage = "An unexpected error occurred";

		if (error.response && error.response.data) {
			// Now TypeScript knows `message` exists on `error.response.data`
			errorMessage =
				error.response.data.message || "Server responded with an error";
		} else if (error.request) {
			errorMessage = "No response from server. Check your network connection.";
		}

		const apiError: ApiError = { message: errorMessage };
		return Promise.reject(apiError);
	};

	public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance
			.get<ApiResponse<T>>(url, config)
			.then(this.handleResponse);
	}

	public post<T>(
		url: string,
		data?: object,
		config?: AxiosRequestConfig
	): Promise<T> {
		return this.axiosInstance
			.post<ApiResponse<T>>(url, data, config)
			.then(this.handleResponse);
	}

	public put<T>(
		url: string,
		data?: object,
		config?: AxiosRequestConfig
	): Promise<T> {
		return this.axiosInstance
			.put<ApiResponse<T>>(url, data, config)
			.then(this.handleResponse);
	}

	public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance
			.delete<ApiResponse<T>>(url, config)
			.then(this.handleResponse);
	}
}

export default BaseAPI;
