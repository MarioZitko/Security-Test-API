import { useEffect, useState } from "react";
import TestsApiClient from "../../api/tests/testApi";
import ApiUrlTestApiClient from "../../api/apiUrlTest/apiUrlTestApi";
import { ITest } from "../../api/tests/types";
import { IAPI } from "../../api/apiUrlTest/types";
import { IResult } from "../../api/results/types";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

const Tests = () => {
	const [tests, setTests] = useState<ITest[]>([]);
	const [apis, setApis] = useState<IAPI[]>([]);
	const [selectedApi, setSelectedApi] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [testResults, setTestResults] = useState<IResult[]>([]);

	const testsApiClient = TestsApiClient.getInstance();
	const apiUrlTestApiClient = ApiUrlTestApiClient.getInstance();

	useEffect(() => {
		const loadData = async () => {
			try {
				const loadedTests = await testsApiClient.getTests();
				const loadedApis = await apiUrlTestApiClient.getAPIs();
				setTests(loadedTests.data);
				setApis(loadedApis.data);
			} catch (err) {
				setError("Failed to load tests or APIs");
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const handleApiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectedApi(event.target.value as number);
		setTestResults([]); // Reset test results when a new API is selected
	};

	const handleRunTests = async () => {
		if (selectedApi !== null) {
			try {
				const resultData = await testsApiClient.runTests(selectedApi);
				setTestResults(resultData.data); // Assume backend returns results as an array
			} catch (err) {
				setError("Failed to run tests");
			}
		}
	};

	const handleRunSingleTest = async (testId: number) => {
		if (selectedApi !== null) {
			try {
				const result = await testsApiClient.runSingleTest(selectedApi, testId);
				setTestResults((prevResults) => {
					const updatedResults = [...prevResults];
					const resultIndex = updatedResults.findIndex(
						(res) => res.test.id === testId
					);
					if (resultIndex > -1) {
						updatedResults[resultIndex] = result.data;
					} else {
						updatedResults.push(result.data);
					}
					return updatedResults;
				});
			} catch (err) {
				setError(`Failed to run test ID: ${testId}`);
			}
		}
	};

	const getTestResult = (testId: number): IResult | undefined => {
		return testResults.find((result) => result.test.id === testId);
	};

	if (loading) {
		return <Typography variant="h6">Loading...</Typography>;
	}

	if (error) {
		return (
			<Typography variant="h6" color="error">
				{error}
			</Typography>
		);
	}

	return (
		<TableContainer component={Paper} style={{ margin: 20 }}>
			<Typography variant="h4" style={{ margin: 20 }}>
				Tests
			</Typography>
			<FormControl fullWidth style={{ marginBottom: 20 }}>
				<InputLabel>Select API</InputLabel>
				<Select value={selectedApi || ""} onChange={handleApiChange}>
					{apis.map((api) => (
						<MenuItem key={api.id} value={api.id}>
							{api.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Button
				variant="contained"
				color="primary"
				onClick={handleRunTests}
				disabled={selectedApi === null}
				style={{ marginBottom: 20 }}
			>
				Run All Tests
			</Button>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Detail</TableCell>
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{tests.map((test) => {
						const result = getTestResult(test.id);
						return (
							<TableRow key={test.id}>
								<TableCell>{test.name}</TableCell>
								<TableCell>{test.description}</TableCell>
								<TableCell>{result ? result.status : "Not Run"}</TableCell>
								<TableCell>{result ? result.detail : "-"}</TableCell>
								<TableCell>
									<Button
										variant="outlined"
										color="secondary"
										onClick={() => handleRunSingleTest(test.id)}
										disabled={selectedApi === null}
									>
										Run Test
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Tests;
