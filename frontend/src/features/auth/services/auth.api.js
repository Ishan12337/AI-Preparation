import axios from "axios";

// Use environment variable for backend URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", {
            username,
            email,
            password
        });
        return response.data;
    } catch (err) {
        console.log("Error connecting to backend during register");
        console.log("REGISTER ERROR:", err.response?.data || err.message);
        throw err;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password });
        return response.data;
    } catch (err) {
        console.log("Error connecting to backend during login");
        throw err;
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.log("Error connecting to backend during logout");
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        console.log("Error connecting to backend during get-me");
        throw err;
    }
}

// export const getMe = async () => {
//   try {
//     const res = await api.get("/auth/get-me");
//     return res.data;
//   } catch (err) {
//     if (err.response?.status === 401) {
//       return null; // silently ignore
//     }
//     throw err;
//   }
// };
