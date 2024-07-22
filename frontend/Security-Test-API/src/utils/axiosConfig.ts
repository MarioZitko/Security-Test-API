import axios from "axios";

const baseURL = "http://localhost:8000/api/";

const instance = axios.create({
	baseURL: baseURL,
});

// Insert token from localStorage if available
const token = localStorage.getItem("token");
if (token) {
	instance.defaults.headers.common["Authorization"] = `Token ${token}`;
}

export default instance;
