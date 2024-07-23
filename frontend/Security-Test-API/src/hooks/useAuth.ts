// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext,  } from "../context/AuthContext";
import { AuthContextType } from "../context/types"

export function useAuth(): AuthContextType {
	return useContext(AuthContext) as AuthContextType;
}
