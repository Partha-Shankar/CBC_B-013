import { Router } from 'express';
const userRouter = Router();
import {
    loginUser, logoutUser, refreshAccessToken, registerUser, verifyEmail,
    forgotPassword, resetPassword, updateEditProfile, PatientProblemsUpdate,
    loadHome, sendverification, checkAuth, searchDoctor, getPatientsByDoctor,
    contactUs, chatWithAI, saveAssessment, getAssessmentHistory, saveJournal, getJournals
} from '../controllers/userController.js';
import { upload } from "../middlewares/multerMiddleware.js"
import { verifyJWT, onlyPatientAccess } from '../middlewares/authMiddleware.js';
import { registerValidator, loginValidator, resetPasswordValidator, forgetPasswordValidator, updateUserValidator } from '../utils/validator.js'
import { ApiResponse } from '../utils/ApiResponse.js';

// ─── Auth Routes ─────────────────────────────────────────────────────────────
userRouter.route("/signup").post(registerValidator, registerUser);
userRouter.route("/login").post(loginValidator, loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route('/verify-email').post(verifyEmail);
userRouter.route('/verify').post(forgetPasswordValidator, sendverification);
userRouter.route('/forgot-password').post(forgetPasswordValidator, forgotPassword);
userRouter.route('/reset-password/:token').post(resetPasswordValidator, resetPassword);

// ─── Profile & User Routes ───────────────────────────────────────────────────
userRouter.get("/check-auth", verifyJWT, checkAuth);
userRouter.post("/update-profile", verifyJWT, upload.single('image'), updateUserValidator, updateEditProfile);
userRouter.post("/contactus", verifyJWT, contactUs);
userRouter.get('/home', verifyJWT, onlyPatientAccess, loadHome);

// ─── Patient/Doctor Routes ───────────────────────────────────────────────────
userRouter.post("/update-patientProblem", verifyJWT, PatientProblemsUpdate);
userRouter.get("/search", verifyJWT, searchDoctor);
userRouter.get('/patients', verifyJWT, getPatientsByDoctor);

// ─── Bug 8 Fix: /predict proxy to Python Flask ML service ───────────────────
userRouter.post("/predict", verifyJWT, async (req, res) => {
    try {
        const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(200).json(new ApiResponse(200, data, "Prediction fetched successfully"));
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, "Python ML service unavailable. Please ensure the Flask server is running on port 5000."));
    }
});

// ─── Gemini AI Suggestions proxy to Python Flask ─────────────────────────────
userRouter.post("/suggestions", verifyJWT, async (req, res) => {
    try {
        const response = await fetch("http://localhost:5000/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(200).json(new ApiResponse(200, data, "Suggestions generated successfully"));
    } catch (err) {
        res.status(500).json(new ApiResponse(500, null, "Python Gemini service unavailable"));
    }
});

// ─── AI Chatbot (Gemini via Node backend) ────────────────────────────────────
userRouter.post("/chat", verifyJWT, chatWithAI);

// ─── Assessment History ───────────────────────────────────────────────────────
userRouter.post("/save-assessment", verifyJWT, saveAssessment);
userRouter.get("/assessment-history", verifyJWT, getAssessmentHistory);

// ─── Journal ─────────────────────────────────────────────────────────────────
userRouter.post("/journal", verifyJWT, saveJournal);
userRouter.get("/journal", verifyJWT, getJournals);

export default userRouter;
