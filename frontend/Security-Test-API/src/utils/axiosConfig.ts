import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8000/api/", // Update this URL based on your actual API endpoint
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Token ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default axiosInstance;
