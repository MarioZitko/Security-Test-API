// src/pages/Register.tsx

import React, { useState, FormEvent } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Paper,
	CircularProgress,
	Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import UsersApiClient from "../../api/users/usersApi"; // Updated path
import { ApiError } from "../../api/types";

const Register: React.FC = () => {
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState(""); // For password confirmation
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Get the instance of the Users API client
	const usersApiClient = UsersApiClient.getInstance();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		try {
			setError("");

			if (password !== confirmPassword) {
				throw new Error("Passwords do not match.");
			}

			await usersApiClient.register({
				username,
				email,
				password1: password,
				password2: confirmPassword,
				first_name: firstName,
				last_name: lastName,
			});

			navigate("/login");
		} catch (err: unknown) {
			const error = err as ApiError;
			const message = error.message || "Registration failed";
			setError(message);
			console.error("Registration error:", message);
		}
		setLoading(false);
	}

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
		>
			<Paper sx={{ padding: 3, width: 400, m: 1 }} elevation={3}>
				<Typography variant="h5" gutterBottom>
					Register
				</Typography>
				{error && <Typography color="error">{error}</Typography>}
				<form onSubmit={handleSubmit} noValidate>
					<TextField
						label="Username"
						type="text"
						variant="outlined"
						fullWidth
						margin="normal"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<TextField
						label="First Name"
						type="text"
						variant="outlined"
						fullWidth
						margin="normal"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
					<TextField
						label="Last Name"
						type="text"
						variant="outlined"
						fullWidth
						margin="normal"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
					<TextField
						label="Email"
						type="email"
						variant="outlined"
						fullWidth
						margin="normal"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<TextField
						label="Password"
						type="password"
						variant="outlined"
						fullWidth
						margin="normal"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<TextField
						label="Confirm Password"
						type="password"
						variant="outlined"
						fullWidth
						margin="normal"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					<Button
						type="submit"
						color="primary"
						variant="contained"
						fullWidth
						disabled={loading}
						sx={{ mt: 2 }}
					>
						{loading ? <CircularProgress size={24} /> : "Register"}
					</Button>
					<Typography sx={{ mt: 2, textAlign: "center" }}>
						Already have an account?{" "}
						<Link component={RouterLink} to="/login">
							Login
						</Link>
					</Typography>
				</form>
			</Paper>
		</Box>
	);
};

export default Register;
