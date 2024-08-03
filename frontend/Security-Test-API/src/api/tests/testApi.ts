import BaseApi from "../baseApi";
import { ApiResponse } from "../types";
import {
	ITest,
	ITestResult,
	ITestResultsResponse,
	ISingleTestResult,
} from "../tests/types";

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

	public async runTestsForApi(apiId: number): Promise<ApiResponse<ITestResult[]>> {
		// Make a POST request to the run_tests_for_api endpoint
		const response = await this.axiosInstance.post<ITestResultsResponse>(`/run-tests/${apiId}/`);
		return response.data;
	}

	public async runSingleTest(apiId: number, testId: number): Promise<ApiResponse<ISingleTestResult>> {
        // Correct endpoint path for running a single test
		const response = await this.axiosInstance.post<ISingleTestResult>(`/run-test/${apiId}/${testId}/`);
        return response.data;
    }
}
