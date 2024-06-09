// src/components/Navbar.tsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Navbar: React.FC = () => {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" component="div">
					My Application
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
