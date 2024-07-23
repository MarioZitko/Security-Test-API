import React, {
	createContext,
	useContext,
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

	async function login(email: string, password: string): Promise<void> {
		const response = await axios.post("auth/login/", { email, password });
		const { token, user } = response.data;
		localStorage.setItem("token", token);
		axios.defaults.headers["Authorization"] = `Token ${token}`;
		setCurrentUser(user);
	}

	function logout(): void {
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

export function useAuth() {
	return useContext(AuthContext);
}
