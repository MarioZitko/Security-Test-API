// src/pages/Dashboard.tsx
import React from "react";
import FileDropArea from "../../components/FileDropArea/FileDropArea";
import Typography from "@mui/material/Typography";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard: React.FC = () => {
	return (
		<div>
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
