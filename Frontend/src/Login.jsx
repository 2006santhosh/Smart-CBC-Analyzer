import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ArrowRight, ShieldCheck, Activity, Stethoscope, Mail, Lock, Undo2, Hash } from "lucide-react";

// Move InputField outside to prevent React from re-mounting it on every render, which causes loss of focus!
const InputField = ({ id, type, label, icon: Icon, placeholder, value, focusedInput, setFocusedInput, onChange }) => (
  <div className="space-y-2 relative">
    <label htmlFor={id} className="text-xs font-bold text-text-secondary ml-1 flex items-center gap-2 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" /> {label}
    </label>
    <div className="relative group">
      <AnimatePresence>
        {focusedInput === id && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl blur opacity-30 transition duration-500" 
          />
        )}
      </AnimatePresence>
      <div className="relative flex items-center">
        <div className="absolute left-4 flex items-center pointer-events-none">
          <Icon className={`w-5 h-5 transition-colors duration-300 ${focusedInput === id ? 'text-primary-400' : 'text-white/30'}`} />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onFocus={() => setFocusedInput(id)}
          onBlur={() => setFocusedInput(null)}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-[#0a0f1c]/80 border border-white/10 hover:border-white/20 rounded-xl text-white placeholder-text-muted/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-300 shadow-inner text-sm font-medium"
          autoComplete="off"
        />
        <div className={`absolute right-4 w-2 h-2 rounded-full transition-colors duration-500 ${value?.trim() ? 'bg-triage-green shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-white/10'}`} />
      </div>
    </div>
  </div>
);

export default function Login({ setUser }) {
  const [view, setView] = useState("login"); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
  const [isHovered, setIsHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (view === "forgot") {
      alert("Password reset instructions have been sent to your email!");
      setView("login");
      return;
    }

    // Determine the user's display name to save
    let finalName = "Provider";
    if (view === "login") {
      finalName = formData.email.split('@')[0] || "Provider";
    } else if (view === "register") {
      finalName = formData.username || formData.name || "Provider";
    }

    if (!finalName.trim()) return;

    localStorage.setItem("username", finalName);
    setUser(finalName);
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      {/* Clean Ambient Background handled by CSS */}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="relative glass-card p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-t border-white/20">
          
          {/* Animated Top Border Glow */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-50" />
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="absolute top-0 left-0 w-[50%] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 shadow-[0_0_15px_rgba(255,255,255,1)]" 
          />

          {/* Logo Section */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full scale-150 -z-10" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="mx-auto w-20 h-20 mb-4 relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse-glow" />
              <div className="relative h-full w-full rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <Stethoscope className="w-10 h-10 text-primary-400 drop-shadow-[0_0_15px_rgba(51,145,255,0.5)]" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Triage<span className="gradient-text">AI</span>
            </h1>
            <p className="text-text-muted text-xs font-medium tracking-wide uppercase px-4">
              {view === "login" && "Clinical Authentication"}
              {view === "register" && "New Provider Registration"}
              {view === "forgot" && "Account Recovery"}
            </p>
          </div>

          {/* Dynamic Form Content */}
          <AnimatePresence mode="wait">
            <motion.form 
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit} 
              className="space-y-5 relative z-10"
            >
              
              {view === "register" && (
                <>
                  <InputField id="name" type="text" label="Full Name" icon={User} placeholder="Enter your full name" value={formData.name} focusedInput={focusedInput} setFocusedInput={setFocusedInput} onChange={handleInput} />
                  <InputField id="username" type="text" label="Username" icon={Hash} placeholder="Unique Provider ID" value={formData.username} focusedInput={focusedInput} setFocusedInput={setFocusedInput} onChange={handleInput} />
                  <InputField id="email" type="email" label="Email Address" icon={Mail} placeholder="provider@hospital.org" value={formData.email} focusedInput={focusedInput} setFocusedInput={setFocusedInput} onChange={handleInput} />
                </>
              )}
              
              {view === "login" && (
                <InputField id="email" type="text" label="Username or Email" icon={User} placeholder="provider_123 or email" value={formData.email} focusedInput={focusedInput} setFocusedInput={setFocusedInput} onChange={handleInput} />
              )}

              {view === "forgot" && (
                <InputField id="email" type="email" label="Email Address" icon={Mail} placeholder="provider@hospital.org" value={formData.email} focusedInput={focusedInput} setFocusedInput={setFocusedInput} onChange={handleInput} />
              )}

              {(view === "login" || view === "register") && (
                <InputField id="password" type="password" label="Password" icon={Lock} placeholder="••••••••" value={formData.password} focusedInput={focusedInput} setFocusedInput={setFocusedInput} onChange={handleInput} />
              )}

              {view === "login" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => setView('forgot')} className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-4 px-4 mt-2 transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(28,112,245,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(28,112,245,0.8)] flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
              >
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
                <span className="tracking-wide relative z-10 text-sm">
                  {view === "login" ? "Access System" : view === "register" ? "Create Account" : "Send Reset Link"}
                </span>
                <motion.div
                  animate={{ x: isHovered ? 6 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative z-10"
                >
                  {view === "forgot" ? <Activity className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </motion.div>
              </button>
              
              {/* Toggle Links */}
              <div className="pt-2 text-center text-sm font-medium">
                {view === "login" && (
                  <p className="text-text-muted">
                    New provider?{' '}
                    <button type="button" onClick={() => setView('register')} className="text-primary-400 hover:text-white transition-colors">Register here</button>
                  </p>
                )}
                {view === "register" && (
                  <p className="text-text-muted">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setView('login')} className="text-primary-400 hover:text-white transition-colors">Sign in</button>
                  </p>
                )}
                {view === "forgot" && (
                  <button type="button" onClick={() => setView('login')} className="text-text-muted hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                    <Undo2 className="w-4 h-4" /> Back to Login
                  </button>
                )}
              </div>

            </motion.form>
          </AnimatePresence>

          {/* Footer Badge */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-text-muted/70 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5 text-triage-green" /> HIPAA-Compliant
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner">
              <Activity className="w-3.5 h-3.5 text-primary-400" /> Active Encryption
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}