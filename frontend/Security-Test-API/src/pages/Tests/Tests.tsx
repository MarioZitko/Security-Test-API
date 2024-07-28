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

    const testsApiClient = TestsApiClient.getInstance();

	useEffect(() => {
		const loadTests = async () => {
			const loadedTests = await testsApiClient.getTests();
			setTests(loadedTests.data);
		};
		loadTests();
	}, []);

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
