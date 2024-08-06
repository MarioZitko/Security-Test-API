import { useEffect, useState } from "react";
import TestsApiClient from "../../api/tests/testApi";
import ApiUrlTestApiClient from "../../api/apiUrlTest/apiUrlTestApi";
import { ITest } from "../../api/tests/types";
import { ITestResult } from "../../api/tests/types";
import { IAPI } from "../../api/apiUrlTest/types";
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
	Snackbar,
	Alert,
	CircularProgress
} from "@mui/material";

const Tests = () => {
	const [tests, setTests] = useState<ITest[]>([]);
	const [apis, setApis] = useState<IAPI[]>([]);
	const [selectedApi, setSelectedApi] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [testResults, setTestResults] = useState<ITestResult[]>([]);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [loadingTests, setLoadingTests] = useState<{ [key: number]: boolean }>({});

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

	const handleRunSingleTest = async (testId: number) => {
		if (selectedApi !== null) {
			setLoadingTests((prev) => ({ ...prev, [testId]: true })); // Set loading to true for the specific test
			try {
				const result = await testsApiClient.runSingleTest(selectedApi, testId);
				setTestResults((prevResults) => {
					const updatedResults = [...prevResults];
					const resultIndex = updatedResults.findIndex(
						(res) => res.testId === testId
					);
					if (resultIndex > -1) {
						updatedResults[resultIndex] = result.data;
					} else {
						updatedResults.push(result.data);
					}
					return updatedResults;
				});
				setSnackbarOpen(true);
			} catch (err) {
				handleError(err);
				setSnackbarOpen(true);
			} finally {
				setLoadingTests((prev) => ({ ...prev, [testId]: false })); // Set loading to false once done
			}
		}
	};


	// Handle unknown error type
	const handleError = (err: unknown) => {
		if (err instanceof Error) {
			// Check if it's an Axios error
			const axiosError = err as any; // Typecasting because AxiosError is not directly available
			if (
				axiosError.response &&
				axiosError.response.data &&
				axiosError.response.data.detail
			) {
				setError(axiosError.response.data.detail);
			} else {
				setError(err.message);
			}
		} else {
			setError("An unexpected error occurred.");
		}
	};

	const getTestResult = (testId: number): ITestResult | undefined => {
		return testResults.find((result) => result.testId === testId);
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
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
										disabled={selectedApi === null || loadingTests[test.id]}
									>
										{loadingTests[test.id] ? (
											<CircularProgress size={24} />
										) : (
											"Run Test"
										)}
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{/* Snackbar for displaying success or error messages */}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity={error ? "error" : "success"}
				>
					{error ? error : "Operation completed successfully"}
				</Alert>
			</Snackbar>
		</TableContainer>
	);
};

export default Tests;
