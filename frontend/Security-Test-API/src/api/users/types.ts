export interface IUser {
	pk: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
}

export interface AuthContextType {
	currentUser: IUser | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

export interface AxiosError {
	response: {
		data: {
			message: string;
			details?: string;
		};
		status: number;
	};
}
