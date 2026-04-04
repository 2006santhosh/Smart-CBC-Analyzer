# 🏥 Smart CBC Analyzer - AI Driven Triage

Smart CBC Analyzer is a full-stack, medical-grade application designed to automatically extract data from pathology reports, perform expert clinical analysis, and provide AI-powered health explanations. It uses computer vision (OCR) and Large Language Models (LLMs) to transform raw reports into actionable insights.

---

## 🚀 Key Features

- **Multi-Format Extraction**: Support for both PDF and high-resolution image uploads (JPEG/PNG) using Tesseract.js and PDF.js.
- **Real-Time Clinical Analysis**: Instant identification of 15+ blood parameters with severity classification (High, Medium, Low Risk).
- **AI Clinical Expert**: Deep health explanations powered by Hugging Face (Phi-3 / T5-Base) and OpenAI via a dedicated Node.js backend.
- **Secure Data Storage**: Real-time synchronization with Firebase Firestore for persistent report history.
- **Official Authentication**: Integrated Firebase Auth for HIPAA-compliant user registrations and secure provider logins.
- **Premium UI/UX**: Stunning dark-mode interface with glassmorphism, fluid animations (Framer Motion), and responsive design.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **OCR/CV**: [Tesseract.js](https://tesseract.projectnaptha.com/) & [PDF.js](https://mozilla.github.io/pdf.js/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **AI Engine**: [Hugging Face Inference SDK](https://huggingface.co/docs/huggingface.js/inference/README) & [OpenAI](https://openai.com/)
- **API**: Custom REST API for expert health analysis.

### Infrastructure
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Hosting**: Designed for Firebase Hosting.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Firebase Project with "Email/Password" Auth and Firestore enabled.

### 1. Clone the Repository
```bash
git clone https://github.com/2006santhosh/Smart-CBC-Analyzer.git
cd Smart-CBC-Analyzer
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory for the backend:
```env
# /backend/.env
PORT=5000
HF_API_KEY=your_hugging_face_token
OPENAI_API_KEY=your_openai_token
```

Update the Firebase config in `/Frontend/src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // ... and the rest of your config
};
```

### 3. Install Dependencies
```bash
# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../Frontend
npm install
```

### 4. Run the Application
In separate terminal windows:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

---

## 🔒 Privacy & Safety Disclaimer
This application is for demonstration purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or enhancements.

**TriageAI © {new Date().getFullYear()} • Smart Medical Intelligence**
