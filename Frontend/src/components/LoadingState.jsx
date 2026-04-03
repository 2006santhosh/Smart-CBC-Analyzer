import { motion } from 'framer-motion';
import { Loader2, ScanLine, Brain, FileSearch } from 'lucide-react';

const steps = [
  { icon: FileSearch, label: 'Extracting data from report...' },
  { icon: ScanLine, label: 'Analyzing blood parameters...' },
  { icon: Brain, label: 'Generating AI triage assessment...' },
];

export default function LoadingState({ progress, stepMsg }) {
  // mapping step messages to roughly line up with overall progress layout
  let activeStep = 0;
  if (progress > 30) activeStep = 1;
  if (progress > 60) activeStep = 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 md:p-12 text-center"
    >
      {/* Spinning loader */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-t-primary-400 border-r-primary-400/30 border-b-primary-400/10 border-l-transparent animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary-400 text-lg font-bold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {stepMsg || 'Analyzing Your Report'}
      </h3>
      <p className="text-text-muted text-sm mb-8">
        Please wait while we process the medical data
      </p>

      {/* Steps */}
      <div className="max-w-sm mx-auto space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-primary-500/10 border border-primary-500/20'
                  : isDone
                  ? 'bg-triage-green/5 border border-triage-green/10'
                  : 'bg-white/[0.02] border border-white/5'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive
                    ? 'bg-primary-500/20'
                    : isDone
                    ? 'bg-triage-green/20'
                    : 'bg-white/5'
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                ) : isDone ? (
                  <Icon className="w-4 h-4 text-triage-green" />
                ) : (
                  <Icon className="w-4 h-4 text-text-muted" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-primary-300'
                    : isDone
                    ? 'text-triage-green'
                    : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8 h-2 bg-white/5 rounded-full overflow-hidden max-w-md mx-auto">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
