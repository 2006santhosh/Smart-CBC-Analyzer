import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Siren } from 'lucide-react';

export default function EmergencyAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      className="emergency-alert p-6"
      id="emergency-alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 rounded-xl bg-triage-red/20 flex items-center justify-center"
          >
            <Siren className="w-6 h-6 text-triage-red" />
          </motion.div>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-triage-red flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" />
            ⚠️ Immediate Medical Attention Recommended
          </h4>
          <p className="text-red-200/80 text-sm leading-relaxed mb-4">
            Critical abnormalities detected in your blood report. Multiple
            parameters are outside safe reference ranges, indicating a
            potentially serious medical condition that requires urgent
            evaluation.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-triage-red/20 border border-triage-red/30 text-triage-red text-sm font-medium">
              <Phone className="w-4 h-4" />
              Contact your physician immediately
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-secondary text-sm">
              🏥 Visit nearest emergency room if symptomatic
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
