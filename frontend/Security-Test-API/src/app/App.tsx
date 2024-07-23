import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/NavBar/Navbar"; // Adjust the import path as necessary
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import Dashboard from "../pages/Dashboard/Dashboard"; // Assuming you have a Dashboard component

const App: React.FC = () => {
	return (
		<AuthProvider>
			<Navbar isAdmin={true} />
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</AuthProvider>
	);
};

export default App;
