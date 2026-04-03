import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Brain,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
} from 'lucide-react';
import ParameterTable from './ParameterTable';
import EmergencyAlert from './EmergencyAlert';
import { downloadReportPDF } from '../utils/generatePDF';

function TriageBadge({ risk }) {
  const config = {
    LOW: {
      className: 'triage-low',
      icon: <ShieldCheck className="w-6 h-6" />,
      label: 'LOW RISK',
      description: 'No immediate action required',
    },
    MEDIUM: {
      className: 'triage-medium',
      icon: <AlertTriangle className="w-6 h-6" />,
      label: 'MEDIUM RISK',
      description: 'Consult a healthcare provider soon',
    },
    HIGH: {
      className: 'triage-high',
      icon: <ShieldAlert className="w-6 h-6" />,
      label: 'HIGH RISK',
      description: 'Seek medical attention promptly',
    },
  };

  const c = config[risk] || config.LOW;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      className="text-center"
    >
      <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-4">
        Overall Triage Assessment
      </p>
      <div className={`triage-badge text-2xl ${c.className}`}>
        {c.icon}
        {c.label}
      </div>
      <p className="text-text-muted text-sm mt-3">{c.description}</p>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card-light p-4 text-center">
      <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-text-muted text-xs mt-1">{label}</p>
    </div>
  );
}

function PriorityTag({ priority }) {
  const styles = {
    urgent: 'bg-triage-red/15 text-triage-red border-triage-red/20',
    high: 'bg-triage-yellow/15 text-triage-yellow border-triage-yellow/20',
    medium: 'bg-primary-500/15 text-primary-400 border-primary-500/20',
    low: 'bg-triage-green/15 text-triage-green border-triage-green/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
        styles[priority] || styles.low
      }`}
    >
      {priority.toUpperCase()}
    </span>
  );
}

export default function ResultCard({ results }) {
  const { parameters, overallRisk, aiExplanation, recommendations, emergencyAlert } =
    results;

  const abnormalCount = parameters.filter((p) => p.status !== 'normal').length;
  const criticalCount = parameters.filter((p) => p.severity === 'high').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      id="results-section"
    >
      {/* Emergency Alert */}
      {emergencyAlert && <EmergencyAlert />}

      {/* Triage Badge */}
      <div className="glass-card p-8">
        <TriageBadge risk={overallRisk} />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <StatCard
            icon={Activity}
            label="Parameters Tested"
            value={parameters.length}
            color="text-primary-400"
          />
          <StatCard
            icon={TrendingDown}
            label="Abnormal Values"
            value={abnormalCount}
            color="text-triage-yellow"
          />
          <StatCard
            icon={TrendingUp}
            label="Critical Flags"
            value={criticalCount}
            color="text-triage-red"
          />
        </div>
        
        {/* Download Button */}
        <div className="mt-8 flex justify-center">
           <button
             onClick={() => downloadReportPDF(results)}
             className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all shadow-lg"
           >
             <Download className="w-5 h-5" />
             Download PDF Report
           </button>
        </div>
      </div>

      {/* Parameter Table */}
      <ParameterTable parameters={parameters} />

      {/* AI Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI Clinical Analysis
            </h3>
            <p className="text-text-muted text-xs">
              Powered by Medical AI Engine
            </p>
          </div>
        </div>

        <div className="relative p-5 rounded-xl bg-white/[0.02] border border-white/5">
          {/* Decorative quote mark */}
          <span className="absolute top-3 left-4 text-4xl text-white/5 font-serif leading-none">
            "
          </span>
          <p className="text-text-secondary text-sm leading-relaxed pl-6">
            {aiExplanation}
          </p>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-triage-green/15 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-triage-green" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Recommended Actions
            </h3>
            <p className="text-text-muted text-xs">
              Prioritized next steps based on analysis
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{rec.icon}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{rec.text}</p>
              </div>
              <PriorityTag priority={rec.priority} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
