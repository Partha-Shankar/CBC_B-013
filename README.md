# 🧠 MindBridge — AI-Powered Mental Health Platform

> An AI-powered mental health SaaS connecting patients and doctors with real ML-based mental health assessment, Gemini-powered insights, and a premium clinical UI.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧠 **AI Assessment** | 5-condition mental health screening (Depression, Anxiety, Bipolar, Schizophrenia, PTSD) |
| 👨‍⚕️ **Doctor Booking** | Search specialists by speciality and book appointments |
| 🤖 **AI Chatbot** | Gemini-powered compassionate mental health chat |
| 📓 **Wellness Journal** | Daily mood tracking with trend charts |
| 📊 **Assessment History** | Track your mental health trends over time |
| 🌿 **Resources Library** | Evidence-based CBT, meditation, and breathing tools |
| 🏥 **Doctor Dashboard** | Doctors see all their booked patients with status badges |
| 🔐 **Role-based Auth** | Separate patient/doctor experiences with JWT authentication |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS, Zustand, Axios
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT, Bcryptjs
- **ML Service:** Python Flask, Scikit-learn (Random Forest), Joblib
- **AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)
- **File Upload:** Cloudinary, Multer
- **Email:** Nodemailer

---

## 📁 Project Structure

```
MindBridge/
├── backend/src/
│   ├── controllers/userController.js
│   ├── models/
│   │   ├── userModel.js          # Base User schema (JWT + bcrypt)
│   │   ├── patientModel.js       # Patient discriminator
│   │   ├── doctorModel.js        # Doctor discriminator
│   │   ├── journalModel.js       # Daily journal entries
│   │   └── assessmentModel.js    # ML assessment history
│   ├── routes/userRoutes.js
│   ├── middlewares/authMiddleware.js
│   └── utils/
├── python-apis/
│   ├── app.py                    # Flask API (/predict, /suggestions)
│   ├── gemini_client.py          # Gemini AI integration
│   ├── predict.py                # ML inference (8-feature model)
│   ├── train.py                  # ML training (200 samples, 5 conditions)
│   └── generate_suggestions.py
├── frontend/src/
│   ├── pages/
│   │   ├── Home.jsx              # Premium landing page
│   │   ├── Login.jsx             # Split-screen auth
│   │   ├── Signup.jsx            # Role selector + speciality
│   │   ├── Model.jsx             # 3-step wizard assessment
│   │   ├── Profile.jsx           # Avatar upload, verified badge
│   │   ├── DoctorDashboard.jsx   # Patient management
│   │   ├── BookAppointment.jsx   # Doctor search + booking
│   │   ├── Journal.jsx           # Mood journal with chart
│   │   ├── ChatBot.jsx           # Gemini AI chat
│   │   ├── History.jsx           # Assessment trend history
│   │   ├── Resources.jsx         # Wellness library
│   │   └── AboutUs.jsx           # Team + mission
│   └── store/
│       ├── authStore.js
│       └── useMentalHealthStore.js
└── .env.example
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)
- Google Gemini API Key
- Cloudinary account (for image uploads)

### 1. Clone & install

```bash
git clone <repo-url>
cd CBC_B-013
cp .env.example .env
# Edit .env with your values
npm install
npm install --prefix frontend
```

### 2. Python ML Setup

```bash
cd python-apis
pip install -r requirements.txt
cp .env.example .env
# Add GEMINI_API_KEY to python-apis/.env
python train.py     # Train all 5 ML models
python app.py       # Start Flask server on port 5000
```

### 3. Start the Backend

```bash
# From project root
npm run dev
```

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

### Services Running:
- 🌐 Frontend: `http://localhost:5173`
- 🚀 Backend: `http://localhost:8000`
- 🐍 Python ML: `http://localhost:5000`

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `CLOUDINARY_*` | Cloudinary credentials |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail credentials for verification emails |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_URL` | Frontend URL (for password reset links) |

---

## 🩺 ML Model Details

**5 Conditions Assessed:**
- Depression, Anxiety, Bipolar Disorder, Schizophrenia, PTSD

**8 Unified Features:**
```
sleep_hours, mood_score, fatigue_level, stress_level,
social_interaction, restlessness_level, trauma_history, mood_swings
```

**Model:** Random Forest Classifier (100 estimators)  
**Training Data:** 200 synthetic samples per condition (medically informed)

---

## 📞 Emergency Helplines (India)

- **iCall:** 9152987821
- **Vandrevala Foundation:** 1860-2662-345  
- **NIMHANS:** 080-46110007

---

## ⚠️ Disclaimer

MindBridge is an academic project. It does not provide medical diagnosis or treatment. Always consult a qualified mental health professional for medical advice.
