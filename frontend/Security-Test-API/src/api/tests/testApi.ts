// UTILITY
import BaseApi from "../baseApi";

// TYPES
import { ApiResponse } from "../types";
import { ITest } from "../tests/types";

export default class TestsApiClient extends BaseApi {
	private static instance: TestsApiClient;

	private constructor() {
		super("tests");
	}

	public static getInstance() {
		if (!TestsApiClient.instance) {
			TestsApiClient.instance = new TestsApiClient();
		}
		return TestsApiClient.instance;
	}

	public async getTests(): Promise<ApiResponse<ITest[]>> {
		const response = await this.axiosInstance.get<ApiResponse<ITest[]>>("");
		return response.data;
	}
}
