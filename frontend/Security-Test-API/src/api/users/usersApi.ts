// UTILITY
import BaseAPI from "../baseApi";
import { ApiResponse } from "../types";
import { IUser, IUserRegister } from "./types";

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
		const response = await this.axiosInstance.post<
			ApiResponse<{ key: string }>
		>("auth/login/", { username, password });

		if (!response.data.key) {
			throw new Error("Login response did not include a key.");
		}

		return response.data.key;
	}

	async fetchCurrentUser(): Promise<IUser> {
		const response = await this.axiosInstance.get<IUser>("auth/user/");

		if (!response) {
			throw new Error("Fetch current user response did not include user data.");
		}

		return response.data; // Return the user directly
	}

	async register(data: IUserRegister): Promise<void> {
		const response = await this.axiosInstance.post<ApiResponse<void>>(
			"auth/registration/",
			data
		);

		if (response.status !== 204) {
			// assuming successful creation returns 201
			throw new Error("Registration failed.");
		}
	}

	async logout(): Promise<void> {
		await this.axiosInstance.post("auth/logout/");
	}
}

export default UsersApiClient;
