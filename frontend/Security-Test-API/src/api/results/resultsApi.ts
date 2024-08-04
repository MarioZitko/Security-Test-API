// UTILITY
import BaseApi from "../baseApi";

// TYPES
import { ApiResponse } from "../types";
import { IResult } from "../results/types";

export default class ResultsApiClient extends BaseApi {
	private static instance: ResultsApiClient;

	private constructor() {
		super("results");
	}

	public static getInstance() {
		if (!ResultsApiClient.instance) {
			ResultsApiClient.instance = new ResultsApiClient();
		}
		return ResultsApiClient.instance;
	}

	public async getResults(): Promise<ApiResponse<IResult[]>> {
		const response = await this.axiosInstance.get<ApiResponse<IResult[]>>("/");
		return response.data;
	}

	public async getResult(id: number): Promise<ApiResponse<IResult>> {
		const response = await this.axiosInstance.get<ApiResponse<IResult>>(`/${id}`);
		return response.data;
	}

	public async deleteResult(id: number): Promise<void> {
		await this.axiosInstance.delete(`/${id}/`);
	}
}
