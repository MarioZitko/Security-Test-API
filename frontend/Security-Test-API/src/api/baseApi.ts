// src/api/baseApi.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { ApiError, ApiErrorResponse, ApiResponse } from "./types";

const apiUrl: string = "http://localhost:8000/api/";

class BaseAPI {
	protected axiosInstance: AxiosInstance;

	constructor(moduleUrl: string) {
		this.axiosInstance = axios.create({
			baseURL: apiUrl + moduleUrl,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.initializeInterceptors();
	}

	private initializeInterceptors = (): void => {
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("token"); // Retrieve token from local storage
				if (token) {
					config.headers["Authorization"] = `Token ${token}`; // Add token to headers
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => this.handleError(error)
		);
	};

	protected handleError = (
		error: AxiosError<ApiErrorResponse>
	): Promise<ApiError> => {
		let errorMessage = "An unexpected error occurred";

		if (error.response && error.response.data) {
			const errorData = error.response.data as ApiErrorResponse;
			errorMessage = errorData.message || "Server responded with an error";
		} else if (error.request) {
			errorMessage = "No response from server. Check your network connection.";
		}

		const apiError: ApiError = { message: errorMessage };
		return Promise.reject(apiError);
	};

	public get<T>(url: string, config?: ApiResponse<T>): Promise<T> {
		return this.axiosInstance
			.get<T>(url, config)
			.then((response) => response.data);
	}
}

export default BaseAPI;
