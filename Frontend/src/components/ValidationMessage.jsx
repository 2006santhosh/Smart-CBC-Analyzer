import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Search } from 'lucide-react';

export default function ValidationMessage({ status, confidence, keywords }) {
  // status: 'idle' | 'validating' | 'valid' | 'invalid'

  const content = {
    validating: {
      icon: <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />,
      title: 'Validating Report...',
      subtitle: 'Scanning document for CBC parameters',
      bg: 'bg-primary-500/10 border-primary-500/20',
      textColor: 'text-primary-300',
    },
    valid: {
      icon: <CheckCircle2 className="w-5 h-5 text-triage-green" />,
      title: 'Valid CBC Report Detected ✅',
      subtitle: `${confidence}% confidence • ${keywords?.length || 0} parameters identified`,
      bg: 'bg-triage-green/10 border-triage-green/20',
      textColor: 'text-triage-green',
    },
    invalid: {
      icon: <XCircle className="w-5 h-5 text-triage-red" />,
      title: 'Uploaded file is not a valid blood report ❌',
      subtitle: 'Please upload a valid CBC / blood test report',
      bg: 'bg-triage-red/10 border-triage-red/20',
      textColor: 'text-triage-red',
    },
  };

  if (status === 'idle') return null;

  const c = content[status];
  if (!c) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`mt-4 flex items-start gap-3 p-4 rounded-xl border ${c.bg}`}
        id="validation-message"
      >
        <div className="mt-0.5">{c.icon}</div>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${c.textColor}`}>{c.title}</p>
          <p className="text-text-muted text-xs mt-1">{c.subtitle}</p>

          {status === 'valid' && keywords && keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-triage-green/10 text-triage-green text-xs font-medium"
                >
                  <Search className="w-3 h-3" />
                  {kw}
                </span>
              ))}
            </div>
          )}

          {status === 'validating' && (
            <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '80%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
