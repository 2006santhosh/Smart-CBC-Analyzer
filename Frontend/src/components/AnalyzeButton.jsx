import { motion } from 'framer-motion';
import { Scan, Loader2 } from 'lucide-react';

export default function AnalyzeButton({ disabled, loading, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex justify-center"
    >
      <button
        id="analyze-button"
        disabled={disabled || loading}
        onClick={onClick}
        className={`
          relative group px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300
          ${
            disabled
              ? 'bg-white/5 text-text-muted cursor-not-allowed border border-white/5'
              : loading
              ? 'bg-primary-600/80 text-white cursor-wait'
              : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {/* Glow effect */}
        {!disabled && !loading && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
        )}

        <span className="flex items-center gap-3">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Report...
            </>
          ) : (
            <>
              <Scan className="w-5 h-5" />
              Analyze Report
            </>
          )}
        </span>
      </button>
    </motion.div>
  );
}
