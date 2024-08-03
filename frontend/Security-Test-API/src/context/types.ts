
export interface IUser {
	pk: number;
	username: string;
	email: string;
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