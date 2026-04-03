# 🌐 TriageAI Frontend - Smart CBC Analyzer

The TriageAI Frontend is a high-performance React application built with Vite, designed to provide a premium, HIPAA-compliant user experience for medical blood report analysis.

---

## 🎨 UI & UX Highlights

- **Glassmorphism**: Elegant, transparent components for a modern medical feel.
- **Micro-Animations**: Smooth transitions powered by [Framer Motion](https://www.framer.com/motion/).
- **Responsive Architecture**: Fully functional on mobile and desktop devices.
- **HIPAA-Ready Interface**: Clean, secure design focusing on data privacy.

---

## 🏗️ Project Structure

### `/src` - Core Implementation
- **`/components`**: Reusable UI elements (`Header`, `UploadSection`, `ResultCard`, `ParameterTable`).
- **`/utils`**: High-performance clinical logic:
  - `extractText.js`: OCR (Tesseract) and PDF parsing (pdf.js).
  - `parseCBC.js`: High-precision Regex parsing for 20+ blood markers.
  - `analyzeCBC.js`: Medical range comparisons and severity logic.
  - `generateExplanation.js`: Rule-based clinical insights (local).
- **`/assets`**: Project-specific styling and UI assets.

### State & Authentication
- **Firebase Auth**: Session management integrated via `onAuthStateChanged` hook in `App.jsx`.
- **Local State**: Context-free React hooks for lightweight and fast UI updates.

---

## 🚀 Development Quick Start

### 📦 Installation
```bash
npm install
```

### 🏁 Start Development Server
```bash
npm run dev
```

### 🔨 Build for Production
```bash
npm run build
```

---

## 🛡️ Key Scripts
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the application into the `dist` folder.
- `npm run lint`: Perfroms code quality checks using ESLint.

---

**Built with 💙 by TriageAI Engineering**
