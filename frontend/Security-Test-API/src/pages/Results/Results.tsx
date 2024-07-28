import { useEffect, useState } from "react";
import ResultsApiClient from "../../api/results/resultsApi";
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
} from "@mui/material";

const Results = () => {
	const [results, setResults] = useState<IResult[]>([]);

    const resultsApiClient = ResultsApiClient.getInstance();


	useEffect(() => {
		const loadResults = async () => {
			const loadedResults = await resultsApiClient.getResults();
			setResults(loadedResults.data);
		};
		loadResults();
	}, []);

	return (
		<TableContainer component={Paper} style={{ margin: 20 }}>
			<Typography variant="h4" style={{ margin: 20 }}>
				Results
			</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Test Name</TableCell>
						<TableCell>API Name</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Details</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{results.map((result) => (
						<TableRow key={result.id}>
							<TableCell>{result.test.name}</TableCell>
							<TableCell>{result.api.name}</TableCell>
							<TableCell>{result.status}</TableCell>
							<TableCell>{result.detail}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Results;
