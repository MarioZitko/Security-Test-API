import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SearchBar: React.FC = () => {
	return (
		<div className="search-bar" style={{ padding: 16 }}>
            <TextField label="Enter your API URL" variant="outlined" fullWidth sx={{ marginBottom: 2 }} />
            <Button variant="contained" color="primary">
                Test API Security
            </Button>
        </div>
	);
};

export default SearchBar;
