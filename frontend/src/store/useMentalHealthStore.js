// Bug 11 Fix: Import useAuthStore (was missing before)
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore.js";

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/users"
    : "/api/users";

export const useMentalStore = create((set, get) => ({
    // Bug 10 Fix: inputData keys now match unified 8-feature model
    inputData: {
        sleep_hours: 7,
        mood_score: 7,
        fatigue_level: 3,
        stress_level: 3,
        social_interaction: 7,
        restlessness_level: 3,
        trauma_history: 0,
        mood_swings: 3,
    },
    prediction: "",
    predictionData: null,  // Full structured response from API
    suggestions: [],
    isLoading: false,
    error: null,

    // Update a single input value
    setInputValue: (key, value) =>
        set((state) => ({
            inputData: {
                ...state.inputData,
                [key]: value,
            },
        })),

    // Reset all inputs
    resetInputs: () =>
        set({
            inputData: {
                sleep_hours: 7,
                mood_score: 7,
                fatigue_level: 3,
                stress_level: 3,
                social_interaction: 7,
                restlessness_level: 3,
                trauma_history: 0,
                mood_swings: 3,
            },
            prediction: "",
            predictionData: null,
            suggestions: [],
            error: null,
        }),

    // Predict using inputData
    predict: async (inputData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/predict`, inputData);
            const data = res.data.data;

            // Bug 12 Fix: removed undefined `console.log(prediction)` — use res.data.data instead
            set({
                prediction: data.prediction || "",
                predictionData: data,
                isLoading: false,
            });

            return data;
        } catch (error) {
            const msg = extractError(error);
            set({ error: msg, isLoading: false });
            throw error;
        }
    },

    // Generate AI suggestions based on prediction results
    generateSuggestions: async (inputData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/suggestions`, inputData);
            const suggestionsData = res.data.data?.suggestions || [];
            set({ suggestions: suggestionsData, isLoading: false });
            return suggestionsData;
        } catch (error) {
            const msg = extractError(error);
            set({ error: msg, isLoading: false });
            throw error;
        }
    },

    // Save assessment to backend
    saveAssessment: async (scores, overallRisk) => {
        try {
            await axios.post(`${API_URL}/save-assessment`, { scores, overallRisk });
        } catch (error) {
            console.error("Failed to save assessment:", error);
        }
    },

    // Get assessment history
    getAssessmentHistory: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_URL}/assessment-history`);
            set({ isLoading: false });
            return res.data.data;
        } catch (error) {
            const msg = extractError(error);
            set({ error: msg, isLoading: false });
            return [];
        }
    },

    clearMentalData: () =>
        set({
            inputData: {
                sleep_hours: 7,
                mood_score: 7,
                fatigue_level: 3,
                stress_level: 3,
                social_interaction: 7,
                restlessness_level: 3,
                trauma_history: 0,
                mood_swings: 3,
            },
            prediction: "",
            predictionData: null,
            suggestions: [],
            error: null,
            isLoading: false,
        }),
}));

function extractError(error) {
    return error?.response?.data?.errors || error?.message || "Something went wrong";
}

// Bug 11 Fix: Axios interceptor now has useAuthStore properly imported
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
