import React, { useState, FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import {
	Box,
	Button,
	TextField,
	Typography,
	Paper,
	CircularProgress,
	Link,
} from "@mui/material";

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { login } = useAuth();
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		try {
			setError(""); // Clear any existing errors
			await login(email, password); // Attempt to log in
		} catch (err: any) {
			// Assuming err.response.data contains the error message
			// Adjust based on your API response structure
			const message = err.response?.data?.message || "Failed to log in";
			setError(message);
			console.error("Login error:", message); // Optionally log error to console
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
					Login
				</Typography>
				{error && <Typography color="error">{error}</Typography>}
				<form onSubmit={handleSubmit} noValidate>
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
					<Button
						type="submit"
						color="primary"
						variant="contained"
						fullWidth
						disabled={loading}
						sx={{ mt: 2 }}
					>
						{loading ? <CircularProgress size={24} /> : "Log In"}
					</Button>
					<Typography sx={{ mt: 2, textAlign: "center" }}>
						Don't have an account?{" "}
						<Link component={RouterLink} to="/register">
							Register
						</Link>
					</Typography>
				</form>
			</Paper>
		</Box>
	);
};

export default Login;
