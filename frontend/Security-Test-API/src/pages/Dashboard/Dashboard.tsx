// src/pages/Dashboard.tsx
import React from "react";
import Navbar from "../../components/NavBar/Navbar";
import FileDropArea from "../../components/FileDropArea/FileDropArea";
import Typography from "@mui/material/Typography";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard: React.FC = () => {
	const isAdmin = true; // This should come from your auth logic

	return (
		<div>
			<Navbar isAdmin={isAdmin} />
			<main style={{ padding: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Dashboard
				</Typography>
				<SearchBar />
				<FileDropArea />
			</main>
		</div>
	);
}

export default Dashboard;
