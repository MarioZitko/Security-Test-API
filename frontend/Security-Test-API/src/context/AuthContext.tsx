import React, {
	createContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import axios from "../utils/axiosConfig";
import { User, AuthContextType } from "../context/types";


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	async function login(username: string, password: string): Promise<void> {
		const response = await axios.post("auth/login/", { username, password });
		const { key: token, user } = response.data;
		setCurrentUser(user);
		localStorage.setItem("token", token);
		axios.defaults.headers["Authorization"] = `Token ${token}`;
	}

	async function logout(): Promise<void> {
		await axios.post("/auth/logout/");
		setCurrentUser(null);
		localStorage.removeItem("token");
		delete axios.defaults.headers["Authorization"];
	}

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios
				.get<User>("auth/user/")
				.then((response) => {
					setCurrentUser(response.data);
				})
				.catch(logout);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};