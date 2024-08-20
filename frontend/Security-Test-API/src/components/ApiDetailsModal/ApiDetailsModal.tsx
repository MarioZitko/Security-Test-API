import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ApiDetailsModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (name: string, description: string) => void;
}

const ApiDetailsModal: React.FC<ApiDetailsModalProps> = ({
	open,
	onClose,
	onSubmit,
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const navigate = useNavigate(); // Initialize the useNavigate hook

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleDescriptionChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setDescription(event.target.value);
	};

	const handleFormSubmit = () => {
		if (name.trim() !== "" && description.trim() !== "") {
			onSubmit(name, description);
			navigate("/tests"); // Adjust the route as needed
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Enter API Details</DialogTitle>
			<DialogContent>
				<TextField
					label="API Name"
					variant="outlined"
					fullWidth
					margin="normal"
					value={name}
					onChange={handleNameChange}
				/>
				<TextField
					label="API Description"
					variant="outlined"
					fullWidth
					margin="normal"
					value={description}
					onChange={handleDescriptionChange}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleFormSubmit} color="primary">
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ApiDetailsModal;
