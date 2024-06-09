import React from "react";
import "./SearchBar.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SearchBar: React.FC = () => {
	return (
		<div className="search-bar">
			<TextField label="Search" variant="outlined" fullWidth />
			<Button variant="contained" color="primary">
				Search
			</Button>
		</div>
	);
};

export default SearchBar;
