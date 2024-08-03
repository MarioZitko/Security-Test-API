export interface ITest {
	id: number;
	name: string;
	description: string;
	test_function: string;
}

export interface ITestResult {
	testId: number;
	status: string;
	detail: string;
}

export interface ITestResultsResponse {
	data: ITestResult[];
}

export interface ISingleTestResult {
	data: {
		testId: number;
		status: string;
		detail: string;
	};
}
