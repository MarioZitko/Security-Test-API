import { ITest } from "../tests/types";

export interface IResult {
	id: number;
	test: ITest; // Assuming the result includes a nested Test object
	api: {
		id: number;
		name: string;
	};
	status: string;
	detail: string;
	executed_at: string;
}
