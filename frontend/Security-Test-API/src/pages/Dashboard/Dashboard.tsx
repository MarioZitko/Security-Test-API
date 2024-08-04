// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileDropArea from "../../components/FileDropArea/FileDropArea";
import Typography from "@mui/material/Typography";
import SearchBar from "../../components/SearchBar/SearchBar";
import ApiDetailsModal from "../../components/ApiDetailsModal/ApiDetailsModal";
import ApiUrlTestApiClient from "../../api/apiUrlTest/apiUrlTestApi";
import TestsApiClient from "../../api/tests/testApi";

const Dashboard: React.FC = () => {
	const [apiUrl, setApiUrl] = useState<string>("");
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const navigate = useNavigate();
	const apiUrlTestApiClient = ApiUrlTestApiClient.getInstance();
	const testsApiClient = TestsApiClient.getInstance();

	const handleTestApi = (url: string) => {
		setApiUrl(url);
		setModalOpen(true); // Open the modal to collect API details
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	const handleModalSubmit = async (name: string, description: string) => {
		try {
			// Post the API details to the backend
			const response = await apiUrlTestApiClient.createAPI({
				id: 0,
				name,
				url: apiUrl,
				description,
				added_by: 1, // Use actual user ID or handle authentication context
			});

			// Run all tests after successfully posting API
			await testsApiClient.runTestsForApi(response.data.id);

			// Redirect to the results page
			navigate(`/results?apiId=${response.data.id}`);
		} catch (error) {
			console.error("Error testing API:", error);
			// Optionally, show error feedback to the user
		} finally {
			setModalOpen(false);
		}
	};

	return (
		<div>
			<main style={{ padding: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Dashboard
				</Typography>
				<SearchBar onTestApi={handleTestApi} />
				<FileDropArea />

				{/* API Details Modal */}
				<ApiDetailsModal
					open={modalOpen}
					onClose={handleModalClose}
					onSubmit={handleModalSubmit}
				/>
			</main>
		</div>
	);
};

export default Dashboard;
