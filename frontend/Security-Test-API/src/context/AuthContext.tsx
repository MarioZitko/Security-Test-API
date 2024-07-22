import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
	id: number;
	username: string;
	email: string;
}

export interface AuthContextType {
	currentUser: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	async function login(email: string, password: string) {
		const response = await axios.post<{ user: User; token: string }>(
			"http://localhost:8000/api/login/",
			{ email, password }
		);
		setCurrentUser(response.data.user);
		localStorage.setItem("token", response.data.token);
		axios.defaults.headers.common[
			"Authorization"
		] = `Token ${response.data.token}`;
	}

	function logout() {
		setCurrentUser(null);
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
	}

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Token ${token}`;
			axios
				.get<User>("http://localhost:8000/api/user/")
				.then((response) => {
					setCurrentUser(response.data);
				})
				.catch(() => logout());
		}
		setLoading(false);
	}, []);

	const value = {
		currentUser,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
