import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import ProfilePage from "./pages/Profile"
import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import SendEmailVerification from "./pages/SendEmailVerification"
import ContactUsPage from "./pages/ContactUsPage"
import AboutUs from "./pages/AboutUs"
import Model from "./pages/Model"
import DoctorDashboard from "./pages/DoctorDashboard"
import BookAppointment from "./pages/BookAppointment"
import Journal from "./pages/Journal"
import ChatBot from "./pages/ChatBot"
import History from "./pages/History"
import Resources from "./pages/Resources"

// ─── Feature 8: Role-based Route Guards ─────────────────────────────────────

// Redirects to login if not authenticated
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    if (user && !user.is_verified && !user.verificationToken) {
        toast.error("Please verify your email first");
        return <Navigate to='/verify' replace />;
    }

    if (user && !user.is_verified) {
        return <Navigate to='/verify-email' replace />;
    }

    return children;
};

// Only for patients (role === 0) — redirects doctors to dashboard
const PatientRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) return <Navigate to='/login' replace />;
    if (user?.is_verified === false) return <Navigate to='/verify-email' replace />;
    if (user?.role === 1) return <Navigate to='/doctor-dashboard' replace />;

    return children;
};

// Only for doctors (role === 1) — redirects patients to home
const DoctorRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) return <Navigate to='/login' replace />;
    if (user?.is_verified === false) return <Navigate to='/verify-email' replace />;
    if (user?.role === 0) return <Navigate to='/' replace />;

    return children;
};

// Redirects authenticated + verified users away from auth pages
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user?.is_verified) {
        return <Navigate to='/' replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div className="min-h-screen font-['Inter',sans-serif]">
            <Routes>
                {/* ─── Public auth pages ──────────────────────────── */}
                <Route path="/login" element={
                    <RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>
                } />
                <Route path="/signup" element={
                    <RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>
                } />
                <Route path="/verify" element={
                    <RedirectAuthenticatedUser><SendEmailVerification /></RedirectAuthenticatedUser>
                } />
                <Route path="/verify-email" element={
                    <RedirectAuthenticatedUser><EmailVerificationPage /></RedirectAuthenticatedUser>
                } />
                <Route path="/forgot-password" element={
                    <RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>
                } />
                <Route path="/reset-password/:token" element={
                    <RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>
                } />

                {/* ─── Common protected routes ─────────────────────── */}
                <Route path="/" element={
                    <PrivateRoute><Home /></PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute><ProfilePage /></PrivateRoute>
                } />
                <Route path="/contactus" element={
                    <PrivateRoute><ContactUsPage /></PrivateRoute>
                } />
                <Route path="/aboutus" element={
                    <PrivateRoute><AboutUs /></PrivateRoute>
                } />
                <Route path="/resources" element={
                    <PrivateRoute><Resources /></PrivateRoute>
                } />

                {/* ─── Patient-only routes ─────────────────────────── */}
                <Route path="/model" element={
                    <PatientRoute><Model /></PatientRoute>
                } />
                <Route path="/book-appointment" element={
                    <PatientRoute><BookAppointment /></PatientRoute>
                } />
                <Route path="/journal" element={
                    <PatientRoute><Journal /></PatientRoute>
                } />
                <Route path="/chatbot" element={
                    <PatientRoute><ChatBot /></PatientRoute>
                } />
                <Route path="/history" element={
                    <PatientRoute><History /></PatientRoute>
                } />

                {/* ─── Doctor-only routes ──────────────────────────── */}
                <Route path="/doctor-dashboard" element={
                    <DoctorRoute><DoctorDashboard /></DoctorRoute>
                } />

                {/* ─── Catch-all ───────────────────────────────────── */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#f1f5f9',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                    },
                    success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
                }}
            />
        </div>
    );
}

export default App;