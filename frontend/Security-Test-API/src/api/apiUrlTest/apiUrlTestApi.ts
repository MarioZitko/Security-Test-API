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

	public async createAPI(data: IAPI): Promise<ApiResponse<IAPI>> {
		const response = await this.axiosInstance.post<ApiResponse<IAPI>>("/", data);
		return response.data;
	}

	public async updateAPI(id: number, data: IAPI): Promise<ApiResponse<IAPI>> {
		const response = await this.axiosInstance.put<ApiResponse<IAPI>>(`/${id}/`, data);
		return response.data;
	}

	public async deleteAPI(id: number): Promise<ApiResponse<null>> {
		const response = await this.axiosInstance.delete<ApiResponse<null>>(`/${id}`);
		return response.data;
	}
}

export default ApiUrlTestApiClient;
