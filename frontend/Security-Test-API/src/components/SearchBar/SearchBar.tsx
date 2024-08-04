// src/components/SearchBar/SearchBar.tsx
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface SearchBarProps {
	onTestApi: (apiUrl: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onTestApi }) => {
	const [apiUrl, setApiUrl] = useState("");

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setApiUrl(event.target.value);
	};

	const handleTestApi = () => {
		if (apiUrl.trim() !== "") {
			onTestApi(apiUrl);
		}
	};

	return (
		<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
			<TextField
				label="API URL"
				variant="outlined"
				fullWidth
				value={apiUrl}
				onChange={handleInputChange}
			/>
			<Button variant="contained" color="primary" onClick={handleTestApi}>
				Test API Security
			</Button>
		</div>
	);
};

export default SearchBar;
