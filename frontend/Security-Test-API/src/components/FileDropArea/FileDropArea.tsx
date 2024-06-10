// src/components/FileDropArea.tsx
import React, { useCallback } from "react";
import { Paper, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";

const FileDropArea: React.FC = () => {
	const onDrop = useCallback((acceptedFiles: File[]) => {
		// Here you can handle the files further (e.g., upload to a server)
		console.log(acceptedFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const StyledPaper = styled(Paper)(({ theme }) => ({
		padding: theme.spacing(3),
		border: "3px grey",
		marginTop: theme.spacing(1),
		backgroundColor: theme.palette.background.default,
		textAlign: "center",
		cursor: "pointer",
		color: theme.palette.text.secondary,
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
	}));

	return (
		<StyledPaper {...getRootProps()} elevation={8}>
			<input {...getInputProps()} />
			<Typography variant="body2">
				{isDragActive
					? "Drop the files here ..."
					: "Drag and drop the Swagger Open API configuration file"}
			</Typography>
		</StyledPaper>
	);
};

export default FileDropArea;
