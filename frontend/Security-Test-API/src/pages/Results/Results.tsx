import { useEffect, useState } from "react";
import ResultsApiClient from "../../api/results/resultsApi";
import { IResult } from "../../api/results/types";
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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TableSortLabel,
	IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { Delete } from "@mui/icons-material"; // Import the Delete icon

const Results = () => {
	const [results, setResults] = useState<IResult[]>([]);
	const [filteredResults, setFilteredResults] = useState<IResult[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("All");
	const [apiFilter, setApiFilter] = useState<string>("All");
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [orderBy, setOrderBy] = useState<keyof IResult>("executed_at");
	const [uniqueApis, setUniqueApis] = useState<IAPI[]>([]);

	const resultsApiClient = ResultsApiClient.getInstance();

	useEffect(() => {
		const loadResults = async () => {
			try {
				const loadedResults = await resultsApiClient.getResults();
				console.log(loadedResults.data);

				// Extract unique APIs for the filter dropdown
				const uniqueApisMap = new Map<number, IAPI>();
				loadedResults.data.forEach((result: IResult) => {
					if (!uniqueApisMap.has(result.api.id)) {
						uniqueApisMap.set(result.api.id, result.api);
					}
				});
				setUniqueApis(Array.from(uniqueApisMap.values()));

				setResults(loadedResults.data);
				setFilteredResults(loadedResults.data);
			} catch (error) {
				console.error("Error loading results:", error);
			}
		};
		loadResults();
	}, []);

	// Filter results based on status and API
	useEffect(() => {
		let updatedResults = results;

		if (statusFilter !== "All") {
			updatedResults = updatedResults.filter(
				(result) => result.status === statusFilter
			);
		}

		if (apiFilter !== "All") {
			updatedResults = updatedResults.filter(
				(result) => result.api.name === apiFilter
			);
		}

		setFilteredResults(updatedResults);
	}, [results, statusFilter, apiFilter]);

	const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setStatusFilter(event.target.value as string);
	};

	const handleApiChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setApiFilter(event.target.value as string);
	};

	// Sort results
	const handleSortRequest = (property: keyof IResult) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);

		const sortedResults = [...filteredResults].sort((a, b) => {
			if (a[property] < b[property]) return isAsc ? -1 : 1;
			if (a[property] > b[property]) return isAsc ? 1 : -1;
			return 0;
		});

		setFilteredResults(sortedResults);
	};

	const handleDeleteResult = async (id: number) => {
		try {
			await resultsApiClient.deleteResult(id);
			// Remove the deleted result from state
			setResults((prevResults) =>
				prevResults.filter((result) => result.id !== id)
			);
			setFilteredResults((prevResults) =>
				prevResults.filter((result) => result.id !== id)
			);
		} catch (error) {
			console.error("Error deleting result:", error);
		}
	};

	return (
		<TableContainer component={Paper} style={{ margin: 20 }}>
			<Typography variant="h4" style={{ margin: 20 }}>
				Results
			</Typography>
			<FormControl style={{ marginBottom: 20, minWidth: 200, marginRight: 20 }}>
				<InputLabel>Status</InputLabel>
				<Select value={statusFilter} onChange={handleStatusChange}>
					<MenuItem value="All">All</MenuItem>
					<MenuItem value="Vulnerable">Vulnerable</MenuItem>
					<MenuItem value="Error">Error</MenuItem>
					<MenuItem value="Safe">Safe</MenuItem>
				</Select>
			</FormControl>
			<FormControl style={{ marginBottom: 20, minWidth: 200 }}>
				<InputLabel>API</InputLabel>
				<Select value={apiFilter} onChange={handleApiChange}>
					<MenuItem value="All">All</MenuItem>
					{uniqueApis.map((api) => (
						<MenuItem key={api.id} value={api.name}>
							{api.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<TableSortLabel
								active={orderBy === "test"}
								direction={orderBy === "test" ? order : "asc"}
								onClick={() => handleSortRequest("test")}
							>
								Test Name
							</TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={orderBy === "api"}
								direction={orderBy === "api" ? order : "asc"}
								onClick={() => handleSortRequest("api")}
							>
								API Name
							</TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={orderBy === "status"}
								direction={orderBy === "status" ? order : "asc"}
								onClick={() => handleSortRequest("status")}
							>
								Status
							</TableSortLabel>
						</TableCell>
						<TableCell>Details</TableCell>
						<TableCell>
							<TableSortLabel
								active={orderBy === "executed_at"}
								direction={orderBy === "executed_at" ? order : "asc"}
								onClick={() => handleSortRequest("executed_at")}
							>
								Executed
							</TableSortLabel>
						</TableCell>
						<TableCell>Action</TableCell> {/* New column for actions */}
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredResults.map((result) => (
						<TableRow key={result.id}>
							<TableCell>{result.test.name}</TableCell>
							<TableCell>{result.api.name}</TableCell>
							<TableCell>{result.status}</TableCell>
							<TableCell>{result.detail}</TableCell>
							<TableCell>
								{format(new Date(result.executed_at), "HH:mm:ss | yyyy-MM-dd")}
							</TableCell>
							<TableCell>
								<IconButton
									color="secondary"
									onClick={() => handleDeleteResult(result.id)}
								>
									<Delete />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Results;
