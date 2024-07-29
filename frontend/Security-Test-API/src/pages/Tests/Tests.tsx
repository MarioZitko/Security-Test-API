import { useEffect, useState } from "react";
import TestsApiClient from "../../api/tests/testApi";
import { ITest } from "../../api/tests/types";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
} from "@mui/material";

const Tests = () => {
	const [tests, setTests] = useState<ITest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const testsApiClient = TestsApiClient.getInstance();

	useEffect(() => {
		const loadTests = async () => {
			try {
				const loadedTests = await testsApiClient.getTests();
				setTests(loadedTests.data);
			} catch (err) {
				setError("Failed to load tests");
			} finally {
				setLoading(false);
			}
		};
		loadTests();
	}, [testsApiClient]);

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
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Description</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{tests.map((test) => (
						<TableRow key={test.id}>
							<TableCell>{test.name}</TableCell>
							<TableCell>{test.description}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Tests;
