import { Activity, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-triage-green rounded-full border-2 border-surface-dark animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Triage<span className="text-primary-400">AI</span>
              </h1>
              <p className="text-xs text-text-muted">Smart CBC Analyzer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-triage-green/10 border border-triage-green/20 text-triage-green text-xs font-medium">
              <span className="w-2 h-2 bg-triage-green rounded-full animate-pulse" />
              AI Engine Active
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-text-muted mb-6">
              <Zap className="w-4 h-4 text-primary-400" />
              Powered by Advanced Medical AI
              <Shield className="w-4 h-4 text-triage-green" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
          >
            Instant CBC Report{' '}
            <span className="gradient-text">Analysis</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Upload your Complete Blood Count report and get AI-powered triage
            assessment with severity classification in seconds.
          </motion.p>
        </div>
      </div>
    </motion.header>
  );
}
