// src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path as necessary
import { useEffect } from "react";

const Navbar = () => {
	const { currentUser, logout } = useAuth(); // Use authentication context

	useEffect(() => {
		console.log("Navbar: Current User Changed:", currentUser);
	}, [currentUser]); // Depend directly on currentUser

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
						<Button color="inherit" component={Link} to="/tests">
							Tests
						</Button>
						<Button color="inherit" component={Link} to="/config">
							App Config
						</Button>
						<Button color="inherit" component={Link} to="/results">
							Results
						</Button>
						{currentUser ? (
							<>
								<Typography
									component="span"
									style={{ color: "white", margin: "0 10px" }}
								>
									Welcome, {currentUser.username}
								</Typography>
								<Button color="inherit" onClick={logout}>
									Logout
								</Button>
							</>
						) : (
							<Button color="inherit" component={Link} to="/login">
								Login
							</Button>
						)}
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
