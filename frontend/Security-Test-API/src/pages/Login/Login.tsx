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
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/types";

const Login: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { login } = useAuth();
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate(); // Initiate useNavigate

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		try {
			login(username, password); // Attempt to log in
			navigate("/", { replace: true });
		} catch (error: unknown) {
			const err = error as ApiError
			const message = err.message || "Failed to log in";
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
						label="Username"
						type="string"
						variant="outlined"
						fullWidth
						margin="normal"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
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
