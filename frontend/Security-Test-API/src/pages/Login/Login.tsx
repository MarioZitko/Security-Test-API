import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { login } = useAuth();
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			setError("");
			setLoading(true);
			await login(email, password);
		} catch {
			setError("Failed to log in");
		}

		setLoading(false);
	}

	return (
		<div>
			<h2>Login</h2>
			{error && <p>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<button type="submit" disabled={loading}>
					Log In
				</button>
			</form>
		</div>
	);
};

export default Login;
