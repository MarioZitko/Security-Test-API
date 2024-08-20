import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import SearchBar from "../../components/SearchBar/SearchBar";
import ApiDetailsModal from "../../components/ApiDetailsModal/ApiDetailsModal";
import ApiUrlTestApiClient from "../../api/apiUrlTest/apiUrlTestApi";
import { Alert, Box, Button } from "@mui/material";
import UsersApiClient from "../../api/users/usersApi";

const Dashboard: React.FC = () => {
	const [apiUrl, setApiUrl] = useState<string>("");
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false); // Track user's login status
	const navigate = useNavigate();
	const apiUrlTestApiClient = ApiUrlTestApiClient.getInstance();
	const usersApiClient = UsersApiClient.getInstance();

	useEffect(() => {
		const checkUserLoggedIn = async () => {
			try {
				// Fetch the current user using the usersApiClient
				const user = await usersApiClient.fetchCurrentUser();
				if (user) {
					setUserLoggedIn(true);
				} else {
					setUserLoggedIn(false);
				}
			} catch (error) {
				console.error("Error fetching current user:", error);
				setUserLoggedIn(false);
			}
		};
		checkUserLoggedIn();
	});

	const handleTestApi = (url: string) => {
		setApiUrl(url);
		setModalOpen(true); // Open the modal to collect API details
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	const handleModalSubmit = async (name: string, description: string) => {
		try {
			await apiUrlTestApiClient.createAPI({id: 0, name, url: apiUrl, description, added_by: 1,});
			navigate(`/tests`);
		} catch (error) {
			console.error("Error testing API:", error);
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
				{/* Display login alert if user is not logged in */}
				{!userLoggedIn ? (
					<Box>
						<Alert severity="warning" style={{ marginBottom: "20px" }}>
							You need to log in to access this feature.
						</Alert>
						<Button
							variant="contained"
							color="primary"
							onClick={() => navigate("/login")}
						>
							Login
						</Button>
					</Box>
				) : (
					<>
						<SearchBar onTestApi={handleTestApi} />
						{/* API Details Modal */}
						<ApiDetailsModal
							open={modalOpen}
							onClose={handleModalClose}
							onSubmit={handleModalSubmit}
						/>
					</>
				)}
			</main>
		</div>
	);
};

export default Dashboard;
