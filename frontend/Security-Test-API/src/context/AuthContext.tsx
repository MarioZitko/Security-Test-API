import React, { createContext, useState, ReactNode, useEffect } from "react";
import UsersApiClient from "../api/users/usersApi";
import { User, AuthContextType } from "../context/types";

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const usersApiClient = UsersApiClient.getInstance();

	async function login(username: string, password: string): Promise<void> {
		try {
			const token = await usersApiClient.login(username, password);
			localStorage.setItem("token", token);
			fetchCurrentUser();
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	}

	async function logout(): Promise<void> {
		try {
			await usersApiClient.logout();
			setCurrentUser(null);
			localStorage.removeItem("token");
		} catch (error) {
			console.error("Logout failed:", error);
			throw error;
		}
	}

	async function fetchCurrentUser(): Promise<void> {
		try {
			const user = await usersApiClient.fetchCurrentUser();
			setCurrentUser(user);
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	}

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			fetchCurrentUser();
		}
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
