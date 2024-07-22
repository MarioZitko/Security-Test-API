import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../components/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard"; // Assuming you have a Dashboard component

const App: React.FC = () => {
	return (
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Dashboard />} />
				</Routes>
			</AuthProvider>
	);
};

export default App;
