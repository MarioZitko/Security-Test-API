import axios, {
	AxiosInstance,
	AxiosError,
	AxiosResponse,
} from "axios";
import { ApiError, ApiErrorResponse, ApiResponse } from "./types";

// Update this URL based on your actual API endpoint
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
		// Correctly setting request interceptors
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("token");
				if (token) {
					config.headers["Authorization"] = `Token ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		// Setting response interceptors to handle data and errors
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			(error) => this.handleError(error)
		);
	};

	// Adjust handleResponse to return the full response
	private handleResponse = <T>(
		response: AxiosResponse<ApiResponse<T>>
	): AxiosResponse<ApiResponse<T>> => {
		return response;
	};

	protected handleError = (
		error: AxiosError<ApiErrorResponse>
	): Promise<ApiError> => {
		let errorMessage = "An unexpected error occurred";

		// Assert the type of error.response.data as ApiErrorResponse
		if (error.response && error.response.data) {
			const errorData = error.response.data as ApiErrorResponse;
			errorMessage = errorData.message || "Server responded with an error";
		} else if (error.request) {
			errorMessage = "No response from server. Check your network connection.";
		}

		const apiError: ApiError = { message: errorMessage };
		return Promise.reject(apiError);
	};
}

export default BaseAPI;
