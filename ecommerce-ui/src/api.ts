import axios from "axios";

const defaultLocal = process.env.NODE_ENV === 'development' ? 'https://localhost:5001' : undefined;
const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || defaultLocal || "https://asmprn232-3.onrender.com",
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;