// UTILITY
import BaseAPI from "../baseApi";
import { ApiResponse } from "../types";
import { User } from "../../context/types";

class UsersApiClient extends BaseAPI {
	private static instance: UsersApiClient;

	private constructor() {
		super(""); // Using the base URL, because auth endpoints are usually not nested under a specific path.
	}

	public static getInstance() {
		if (!UsersApiClient.instance) {
			UsersApiClient.instance = new UsersApiClient();
		}
		return UsersApiClient.instance;
	}

	async login(username: string, password: string): Promise<string> {
		const response = await this.axiosInstance.post<ApiResponse<{ key: string }>>(
			"auth/login/",
			{ username, password }
		);

		if (!response.data.key) {
			throw new Error("Login response did not include a key.");
		}

		return response.data.key;
	}

	async fetchCurrentUser(): Promise<User> {
		const response = await this.axiosInstance.get<ApiResponse<User>>("auth/user/");

		if (!response.data) {
		throw new Error("Fetch current user response did not include user data.");
		}

		return response.data;
	}

	async logout(): Promise<void> {
		await this.axiosInstance.post("auth/logout/");
	}
}

export default UsersApiClient;
