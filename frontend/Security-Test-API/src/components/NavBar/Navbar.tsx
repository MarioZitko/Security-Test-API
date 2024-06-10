// src/components/Navbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
	isAdmin: boolean;
}

const Navbar: React.FC<Props> = ({ isAdmin }) => {
	return (
		<AppBar position="static" color="primary">
			<Toolbar>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography
							variant="h6"
							component={Link}
							to="/"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							API Security Test
						</Typography>
					</Grid>
					<Grid item>
						<Button color="inherit" component={Link} to="/test">
							Test
						</Button>
						<Button color="inherit" component={Link} to="/config">
							Config
						</Button>
						<Button color="inherit" component={Link} to="/about">
							About Us
						</Button>
						{isAdmin && (
							<Button color="inherit" component={Link} to="/admin">
								Admin Dashboard
							</Button>
						)}
						<Button color="inherit" component={Link} to="/login">
							Login
						</Button>
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
