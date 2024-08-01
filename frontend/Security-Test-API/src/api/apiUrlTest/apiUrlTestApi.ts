import BaseAPI from "../baseApi";
import { ApiResponse } from "../types";
import { IAPI } from "./types";

class ApiUrlTestApiClient extends BaseAPI {
	private static instance: ApiUrlTestApiClient;

	private constructor() {
		super("apis");
	}

	public static getInstance() {
		if (!ApiUrlTestApiClient.instance) {
			ApiUrlTestApiClient.instance = new ApiUrlTestApiClient();
		}
		return ApiUrlTestApiClient.instance;
	}

	public async getAPIs(): Promise<ApiResponse<IAPI[]>> {
		const response = await this.axiosInstance.get<ApiResponse<IAPI[]>>("");
		return response.data;
	}

	public async getAPI(id: number): Promise<ApiResponse<IAPI>> {
		const response = await this.axiosInstance.get<ApiResponse<IAPI>>(`/${id}`);
		return response.data;
	}
}

export default ApiUrlTestApiClient;
