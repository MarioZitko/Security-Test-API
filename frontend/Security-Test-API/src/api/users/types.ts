export interface IUser {
	pk: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
}

export interface IUserRegister {
	username: string;
	first_name: string; // Use snake_case if your backend expects this format
	last_name: string;
	email: string;
	password1: string;
	password2: string;
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
