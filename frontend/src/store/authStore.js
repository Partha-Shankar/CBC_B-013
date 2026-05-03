import { create } from "zustand";
import axios from "axios"

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/users"
    : "/api/users";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // Bug 13 Fix: accept role and speciality
    signup: async (email, password, name, mobile, role, speciality) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name,
                mobile,
                role,
                speciality,
            });
            set({ user: response.data.data, isAuthenticated: false, isLoading: false });
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                isAuthenticated: true,
                user: response.data.data,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error logging out", isLoading: false });
            throw error;
        }
    },

    refreshToken: async () => {
        if (get().isCheckingAuth) return;
        set({ isCheckingAuth: true });
        try {
            const response = await axios.post(`${API_URL}/refresh-token`);
            set({ isCheckingAuth: false });
            return response.data.accessToken;
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage, user: null, isCheckingAuth: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.data.user, isCheckingAuth: false, isAuthenticated: true });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error sending reset password email", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password, confirmPassword });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error resetting password", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.data, isAuthenticated: false, isLoading: false });
            return response.data;
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    verify: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify`, { email });
            set({ user: response.data.data, isLoading: false });
            return response.data;
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage || "Error sending verification email", isLoading: false });
            throw error;
        }
    },

    updateProfile: async (formData) => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/update-profile`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ user: response.data.data, isCheckingAuth: false, isAuthenticated: true });
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage, isCheckingAuth: false });
            throw error;
        }
    },

    sendContactus: async (email, message) => {
        try {
            const response = await axios.post(`${API_URL}/contactus`, { email, message });
            return response.data;
        } catch (error) {
            console.error("Error sending contact message:", error);
            return null;
        }
    },

    // AI Chat
    sendChatMessage: async (message, history) => {
        try {
            const response = await axios.post(`${API_URL}/chat`, { message, history });
            return response.data.data.reply;
        } catch (error) {
            throw error;
        }
    },

    // Get patients for doctor dashboard
    getPatients: async () => {
        try {
            const response = await axios.get(`${API_URL}/patients`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching patients:", error);
            return [];
        }
    },

    // Book appointment (patient books a doctor)
    bookAppointment: async (appointmentData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/update-patientProblem`, appointmentData);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            let errorMessage = extractErrors(error);
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    // Search doctors
    searchDoctors: async (disease) => {
        try {
            const response = await axios.get(`${API_URL}/search?disease=${encodeURIComponent(disease)}`);
            return response.data.data;
        } catch (error) {
            console.error("Error searching doctors:", error);
            return [];
        }
    },
}))

function extractErrors(error) {
    let errorMessage;
    if (error.response && error.response.data) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
            errorMessage = errors.map((err) => err.msg).join(", ");
        } else if (typeof errors === "string") {
            errorMessage = errors;
        }
    }
    return errorMessage;
}

let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = useAuthStore.getState().refreshToken();
                }
                await refreshPromise;
                refreshPromise = null;
                return axios(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
