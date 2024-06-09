// src/components/FileDropArea.tsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileDropArea: React.FC = () => {
	const onDrop = useCallback((acceptedFiles: File[]) => {
		// Here you can handle the files further (e.g., upload to a server)
		console.log(acceptedFiles);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div
			{...getRootProps()}
			style={{ padding: "20px", border: "1px dashed gray", marginTop: "20px" }}
		>
			<input {...getInputProps()} />
			{isDragActive ? (
				<p>Drop the files here ...</p>
			) : (
				<p>Drag 'n' drop some files here, or click to select files</p>
			)}
		</div>
	);
};

export default FileDropArea;
