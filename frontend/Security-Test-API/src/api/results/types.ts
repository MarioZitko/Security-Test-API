import { IAPI } from "../apiUrlTest/types";
import { ITest } from "../tests/types";

export interface IResult {
	id: number;
	test: ITest;
	api: IAPI;
	status: "Vulnerable" | "Error" | "Safe"; // Enum-like type
	detail: string;
	executed_at: string;
}
