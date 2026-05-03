import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from '../models/userModel.js'
import { Doctor } from '../models/doctorModel.js'
import { ApiError } from '../utils/ApiError.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import ContactUs from "../models/contactus.js"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { validationResult } from "express-validator"
import { sendVerificationEmail, contactUS, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail } from "../utils/emails.js"
import { randomBytes } from "node:crypto"
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { Patient } from '../models/patientModel.js'

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        return accessToken;
    }
    catch (error) {
        throw new ApiError("Error in generating access token", 500, "Something went wrong while generating the access token");
    }
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token (single string — no deviceId needed)
        user.refreshTokens = refreshToken;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            "Error in generating tokens",
            500,
            "Something went wrong in generating refresh and access token"
        );
    }
};

export const registerUser = asyncHandler(async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError("Error while sign up", 400, errors.array())
    }

    const { name, email, password, mobile, role, speciality } = req.body

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new ApiError("Error while registering the user", 400, "Email already exists",)
    }
    const verificationToken = generateVerificationCode();

    let user;
    if (role === 'doctor') {
      user = new Doctor({
        email,
        password,
        name,
        mobile,
        speciality,
        role: 1,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });
    } else if (role === 'patient') {
      user = new Patient({
        email,
        password,
        name,
        mobile,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });
    } else {
        throw new ApiError("Error while choosing the role", 400, "Invalid role — choose 'patient' or 'doctor'",)
    }

    await user.save();

    sendVerificationEmail(user.name, user.email, verificationToken)

    res.status(200).json(new ApiResponse(200,
        {
            ...user._doc,
            password: undefined,
            refreshTokens: undefined,
        }, "User registered successfully. Please verify your email first."))
})

export const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError("Error while verifying the email", 400, "Invalid or expired verification code")
    }
    user.is_verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined
    await user.save();
    await sendWelcomeEmail(user.name, user.email);
    return res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully")
    )
})

export const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError("Error while login", 400, errors.array());
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError("Error while login", 400, "Email and password are not correct");
    }

    const correctPassword = await user.isPasswordCorrect(password);
    if (!correctPassword) {
        throw new ApiError("Error while login", 400, "Email and password are not correct");
    }

    // Bug 17 Fix: enforce email verification
    if (!user.is_verified) {
        throw new ApiError("Error while login", 403, "Please verify your email before logging in");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    ...user._doc,
                    password: undefined,
                    refreshTokens: undefined,
                },
                "User Logged In Successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    // Bug 3 Fix: actually clear the refresh token in DB
    const user = await User.findById(req.user._id);
    if (user) {
        user.refreshTokens = null;
        await user.save({ validateBeforeSave: false });
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    // Bug 2 Fix: remove deviceId requirement, use simple string comparison
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.query?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
        throw new ApiError("Unauthorized request", 401, "No refresh token provided");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError("Unauthorized request", 401, "Invalid refresh token");
        }

        // Simple string comparison — no deviceId
        if (user.refreshTokens !== incomingRefreshToken) {
            throw new ApiError("Unauthorized request", 401, "Refresh token mismatch");
        }

        const accessToken = await generateAccessToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200).cookie("accessToken", accessToken, options).json(new ApiResponse(200, { accessToken }, "Refresh Access Token Successfully"));
    } catch (error) {
        throw new ApiError("Unauthorized request", 401, "Invalid refresh token");
    }
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // Bug 16 Fix: removed duplicate if check
    if (!errors.isEmpty()) {
        throw new ApiError("Error while forget password", 400, errors.array())
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError("error in forgot password", 400, "Invalid email")
    }
    // Generate reset token
    const resetToken = randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    // Send email
    await sendResetPasswordEmail(user.name, email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    return res.status(200).json(new ApiResponse(200, {}, "Reset token successfully sent to your email address"))
})

export const resetPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // Bug 16 Fix: removed duplicate if check
    if (!errors.isEmpty()) {
        throw new ApiError("Error while reset password", 400, errors.array())
    }

    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (confirmPassword !== password) {
        throw new ApiError("error in reset password", 400, "Confirm password does not match")
    }

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } })
    if (!user) {
        throw new ApiError("error in reset password", 400, "Invalid or expired reset token")
    }

    // Bug 4 Fix: use bcrypt.compare to detect old password reuse
    const isSamePassword = await bcryptjs.compare(password, user.password);
    if (isSamePassword) {
        throw new ApiError("error in reset password", 400, "Please choose a new password different from your old one");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();
    sendResetSuccessEmail(user.name, user.email);
    return res.status(200).json(new ApiResponse(200, {}, "Password successfully reset"));
})

export const updateEditProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError("Validation error while updating profile", 400, errors.array());
    }

    const { name, email, mobile, speciality } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError("User not found", 404, "User not found");
    }

    let image;
    if (req.file) {
        const localImagePath = req.file.path;
        image = await uploadOnCloudinary(localImagePath);
        user.image = image?.url || '';
    }

    user.name = name;
    user.email = email;
    user.mobile = mobile;

    // Bug 5 Fix: role is a Number — compare with 1 for Doctor
    if (user.role === 1) {
        user.speciality = speciality;
    }

    await user.save();
    res.status(200).json(new ApiResponse(200, {
        ...user._doc,
        password: undefined,
        refreshTokens: undefined,
    }, "Profile updated successfully"));
});

export const loadHome = async (req, res) => {
    const user = req.user;
    res.status(200).json(new ApiResponse(200, {
        user: {
            ...user._doc,
            password: undefined,
            refreshTokens: undefined,
        }
    }, "Home loaded"))
}

export const sendverification = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError("Error while sending verification", 400, errors.array())
    }

    const { email } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
        throw new ApiError("Error while verifying the email", 400, "Please enter a valid email",)
    }
    const verificationToken = generateVerificationCode();

    userData.verificationToken = verificationToken;
    userData.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await userData.save();

    sendVerificationEmail(userData.name, userData.email, verificationToken)

    res.status(200).json(new ApiResponse(200, { verificationToken }, "Check your email to verify"))
});

export const checkAuth = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
        throw new ApiError("Error while checking auth", 400, "User not found")
    }
    res.status(200).json(new ApiResponse(200, { user }, "Auth check successful"))
})

export const PatientProblemsUpdate = asyncHandler(async (req, res) => {
    const { doctorToConsult, diseaseName, symptoms, bookingDate } = req.body;

    const userId = req.user._id;
    const user = await Patient.findById(userId);

    if (!user) {
        throw new ApiError("Patient Problems Update error", 404, "User not found");
    }

    // Bug 6 Fix: role must be 0 (Patient), not role === 0 after the push
    if (user.role !== 0) {
        throw new ApiError("Unauthorized", 403, "Only patients can book appointments");
    }

    // Bug 6 Fix: use Doctor model to find doctor, not User model
    const doctor = await Doctor.findOne({
        name: { $regex: doctorToConsult, $options: 'i' }
    });

    if (!doctor) {
        throw new ApiError("Patient Problems Update error", 404, "Doctor not found");
    }

    user.patientDetails.push({
        doctorToConsult: doctor._id,
        diseaseName,
        symptoms,
        bookingDate,
    });

    await user.save();

    res.status(200).json(new ApiResponse(200, {
        ...user._doc,
        password: undefined,
        refreshTokens: undefined,
    }, "Appointment booked successfully"));
});

// Search API to get doctors based on disease (specialty)
export const searchDoctor = asyncHandler(async (req, res) => {
    const query = req.query.disease?.toLowerCase() || '';

    const doctors = await Doctor.find({
        speciality: { $regex: query, $options: 'i' }
    }).select('-password -refreshTokens');

    res.status(200).json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});

export const getPatientsByDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.user._id;

    const patients = await Patient.find({
        'patientDetails.doctorToConsult': doctorId,
    }).populate({
        path: 'patientDetails.doctorToConsult',
        // Bug 7 Fix: Doctor model field is `speciality`, not `specialization`
        select: 'name speciality',
    });

    const formattedPatients = patients.flatMap((patient) => {
        if (!Array.isArray(patient.patientDetails)) {
            return [];
        }

        return patient.patientDetails
            .filter((detail) => {
                const doctorToConsultId = detail.doctorToConsult?._id?.toString();
                const normalizedDoctorId = doctorId.toString();
                return doctorToConsultId === normalizedDoctorId;
            })
            .map((detail) => ({
                name: patient.name,
                email: patient.email,
                mobile: patient.mobile,
                symptoms: detail.symptoms,
                diseaseName: detail.diseaseName,
                doctor: detail.doctorToConsult,
                bookingDate: detail.bookingDate,
            }));
    });

    res.status(200).json(new ApiResponse(200, formattedPatients, "Patients fetched successfully"));
});

export const contactUs = asyncHandler(async (req, res) => {
    const { email, message } = req.body;
    const user = new ContactUs({
        email,
        message,
    });
    await user.save()
    await contactUS(message, email);
    res.status(200).json(new ApiResponse(200, {}, "Message sent successfully"))
})

// ─── AI Chat (Gemini via backend) ───────────────────────────────────────────
export const chatWithAI = asyncHandler(async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        throw new ApiError("Chat error", 400, "Message is required");
    }

    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemContext = "You are a compassionate mental health support assistant named MindBridge AI. You never diagnose medical conditions. You listen empathetically, validate feelings, offer coping strategies, and always suggest seeking professional help when appropriate. Keep responses warm, concise, and supportive.";

        const chatHistory = history.map(h => ({
            role: h.role,
            parts: [{ text: h.content }]
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemContext }] },
                { role: "model", parts: [{ text: "Understood. I'm here to listen and support." }] },
                ...chatHistory
            ]
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.status(200).json(new ApiResponse(200, { reply: response }, "Chat response generated"));
    } catch (error) {
        throw new ApiError("Chat error", 500, "AI service unavailable: " + error.message);
    }
});

// ─── Save Assessment History ─────────────────────────────────────────────────
export const saveAssessment = asyncHandler(async (req, res) => {
    const { scores, overallRisk } = req.body;
    const userId = req.user._id;

    try {
        const { AssessmentHistory } = await import('../models/assessmentModel.js');
        const assessment = new AssessmentHistory({
            userId,
            scores,
            overallRisk,
        });
        await assessment.save();
        res.status(200).json(new ApiResponse(200, assessment, "Assessment saved successfully"));
    } catch (error) {
        throw new ApiError("Assessment save error", 500, error.message);
    }
});

// ─── Get Assessment History ──────────────────────────────────────────────────
export const getAssessmentHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const { AssessmentHistory } = await import('../models/assessmentModel.js');
        const history = await AssessmentHistory.find({ userId }).sort({ date: -1 }).limit(10);
        res.status(200).json(new ApiResponse(200, history, "Assessment history fetched"));
    } catch (error) {
        throw new ApiError("Assessment history error", 500, error.message);
    }
});

// ─── Journal ─────────────────────────────────────────────────────────────────
export const saveJournal = asyncHandler(async (req, res) => {
    const { text, moodRating, emoji } = req.body;
    const userId = req.user._id;

    try {
        const { JournalEntry } = await import('../models/journalModel.js');
        const entry = new JournalEntry({ userId, text, moodRating, emoji });
        await entry.save();
        res.status(200).json(new ApiResponse(200, entry, "Journal entry saved"));
    } catch (error) {
        throw new ApiError("Journal save error", 500, error.message);
    }
});

export const getJournals = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const { JournalEntry } = await import('../models/journalModel.js');
        const entries = await JournalEntry.find({ userId }).sort({ date: -1 }).limit(7);
        res.status(200).json(new ApiResponse(200, entries, "Journal entries fetched"));
    } catch (error) {
        throw new ApiError("Journal fetch error", 500, error.message);
    }
});