// src/pages/Dashboard.tsx
import React from "react";
import Navbar from "../../components/NavBar/Navbar";
import FileDropArea from "../../components/FileDropArea/FileDropArea";
import Typography from "@mui/material/Typography";

const Dashboard: React.FC = () => {
	return (
		<div>
			<Navbar />
			<main style={{ padding: "20px" }}>
				<Typography variant="h4" gutterBottom>
					Dashboard
				</Typography>
				<FileDropArea />
			</main>
		</div>
	);
};

export default Dashboard;
