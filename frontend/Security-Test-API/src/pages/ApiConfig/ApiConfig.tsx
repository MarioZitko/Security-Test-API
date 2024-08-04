import { useEffect, useState } from "react";
import ApiUrlTestApiClient from "../../api/apiUrlTest/apiUrlTestApi";
import { IAPI } from "../../api/apiUrlTest/types";
import UsersApiClient from "../../api/users/usersApi";
import { IUser } from "../../api/users/types";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
	IconButton,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const Apis = () => {
	const [apis, setApis] = useState<IAPI[]>([]);
	const [selectedApi, setSelectedApi] = useState<IAPI | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [openDialog, setOpenDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

	const apiApiClient = ApiUrlTestApiClient.getInstance();
	const userApiClient = UsersApiClient.getInstance();

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const userResponse = await userApiClient.fetchCurrentUser();
                setCurrentUser(userResponse);
            } catch (err) {
                console.error("Failed to load current user", err);
            }
        };
		const loadAPIs = async () => {
			try {
				const loadedApis = await apiApiClient.getAPIs();
				setApis(loadedApis.data);
			} catch (err) {
				setError("Failed to load APIs");
			} finally {
				setLoading(false);
			}
        };
        
        loadCurrentUser();
		loadAPIs();
	}, []);

    const handleOpenDialog = (api?: IAPI) => {
        if (currentUser) {
		setSelectedApi(
			api || {
				id: 0,
				name: "",
				url: "",
				description: "",
				added_by: currentUser.pk,
			}
		);
        }
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedApi(null);
	};

	const handleSaveApi = async () => {
		if (!selectedApi || !currentUser) return;

		const apiData: IAPI = {
			...selectedApi,
			added_by: currentUser.pk,
		};

		try {
			if (selectedApi.id) {
				// Update existing API
				await apiApiClient.updateAPI(selectedApi.id, apiData);
				setSnackbarMessage("API updated successfully");
			} else {
				// Create new API
				const response = await apiApiClient.createAPI(apiData);
				setApis((prevApis) => [...prevApis, response.data]);
				setSnackbarMessage("API created successfully");
			}
			handleCloseDialog();
			refreshAPIs();
		} catch (err) {
			setError("Failed to save API");
		}
	};

	const handleDeleteApi = async (id: number) => {
		try {
			await apiApiClient.deleteAPI(id);
			setApis((prevApis) => prevApis.filter((api) => api.id !== id));
			setSnackbarMessage("API deleted successfully");
		} catch (err) {
			setError("Failed to delete API");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedApi({
			...selectedApi!,
			[e.target.name]: e.target.value,
		});
	};

	const refreshAPIs = async () => {
		setLoading(true);
		try {
			const loadedApis = await apiApiClient.getAPIs();
			setApis(loadedApis.data);
		} catch (err) {
			setError("Failed to refresh APIs");
		} finally {
			setLoading(false);
		}
	};

	return (
		<TableContainer component={Paper} style={{ margin: 20 }}>
			<Typography variant="h4" style={{ margin: 20 }}>
				APIs
			</Typography>
			<Button
				variant="contained"
				color="primary"
				startIcon={<Add />}
				onClick={() => handleOpenDialog()}
				style={{ marginBottom: 20 }}
			>
				Add New API
			</Button>
			{loading ? (
				<Typography variant="h6">Loading...</Typography>
			) : error ? (
				<Typography variant="h6" color="error">
					{error}
				</Typography>
			) : (
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>URL</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{apis.map((api) => (
							<TableRow key={api.id}>
								<TableCell>{api.name}</TableCell>
								<TableCell>{api.url}</TableCell>
								<TableCell>{api.description}</TableCell>
								<TableCell>
									<IconButton
										color="primary"
										onClick={() => handleOpenDialog(api)}
									>
										<Edit />
									</IconButton>
									<IconButton
										color="secondary"
										onClick={() => handleDeleteApi(api.id)}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					{selectedApi?.id ? "Edit API" : "Add New API"}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						name="name"
						label="Name"
						type="text"
						fullWidth
						value={selectedApi?.name || ""}
						onChange={handleChange}
					/>
					<TextField
						margin="dense"
						name="url"
						label="URL"
						type="url"
						fullWidth
						value={selectedApi?.url || ""}
						onChange={handleChange}
					/>
					<TextField
						margin="dense"
						name="description"
						label="Description"
						type="text"
						fullWidth
						value={selectedApi?.description || ""}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSaveApi} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={!!snackbarMessage}
				autoHideDuration={6000}
				onClose={() => setSnackbarMessage(null)}
				message={snackbarMessage}
			/>
		</TableContainer>
	);
};

export default Apis;
