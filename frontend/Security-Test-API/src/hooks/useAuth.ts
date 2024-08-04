// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext,  } from "../context/AuthContext";
import { AuthContextType } from "../api/users/types"

export function useAuth(): AuthContextType {
	return useContext(AuthContext) as AuthContextType;
}
