import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';

export default function ParameterTable({ parameters }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'high':
        return <ArrowUp className="w-3.5 h-3.5" />;
      case 'low':
        return <ArrowDown className="w-3.5 h-3.5" />;
      default:
        return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'high':
        return 'High';
      case 'low':
        return 'Low';
      default:
        return 'Normal';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ShieldAlert className="w-4 h-4 text-triage-red" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-triage-yellow" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-triage-green" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-5 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
            📊
          </span>
          Parameter Analysis
        </h3>
        <p className="text-text-muted text-sm mt-1">
          Detailed breakdown of your CBC values
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" id="parameter-table">
          <thead>
            <tr className="border-b border-white/5 text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-5 font-medium">Parameter</th>
              <th className="text-left py-3 px-5 font-medium">Value</th>
              <th className="text-left py-3 px-5 font-medium">Normal Range</th>
              <th className="text-left py-3 px-5 font-medium">Status</th>
              <th className="text-left py-3 px-5 font-medium">Severity</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, i) => (
              <motion.tr
                key={param.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                  param.status !== 'normal' ? 'bg-white/[0.01]' : ''
                }`}
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(param.severity)}
                    <span className="text-white font-medium text-sm">
                      {param.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`text-sm font-mono font-bold ${
                      param.status === 'low'
                        ? 'text-triage-red'
                        : param.status === 'high'
                        ? 'text-triage-yellow'
                        : 'text-triage-green'
                    }`}
                  >
                    {param.value.toLocaleString()}
                  </span>
                  <span className="text-text-muted text-xs ml-1">
                    {param.unit}
                  </span>
                </td>
                <td className="py-4 px-5 text-text-muted text-sm">
                  {param.normalRange} {param.unit}
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`status-pill ${
                      param.status === 'normal'
                        ? 'status-normal'
                        : param.status === 'low'
                        ? 'status-low'
                        : 'status-high'
                    }`}
                  >
                    {getStatusIcon(param.status)}
                    {getStatusLabel(param.status)}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`status-pill ${
                      param.severity === 'high'
                        ? 'status-low'
                        : param.severity === 'medium'
                        ? 'status-high'
                        : 'status-normal'
                    }`}
                  >
                    {param.severity === 'high'
                      ? '🔴'
                      : param.severity === 'medium'
                      ? '🟡'
                      : '🟢'}{' '}
                    {param.severity.charAt(0).toUpperCase() +
                      param.severity.slice(1)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-3">
        {parameters.map((param, i) => (
          <motion.div
            key={param.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className={`p-4 rounded-xl border ${
              param.status !== 'normal'
                ? param.status === 'low'
                  ? 'border-triage-red/20 bg-triage-red/5'
                  : 'border-triage-yellow/20 bg-triage-yellow/5'
                : 'border-white/5 bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSeverityIcon(param.severity)}
                <span className="text-white font-medium text-sm">
                  {param.name}
                </span>
              </div>
              <span
                className={`status-pill ${
                  param.status === 'normal'
                    ? 'status-normal'
                    : param.status === 'low'
                    ? 'status-low'
                    : 'status-high'
                }`}
              >
                {getStatusIcon(param.status)}
                {getStatusLabel(param.status)}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span
                className={`text-2xl font-bold font-mono ${
                  param.status === 'low'
                    ? 'text-triage-red'
                    : param.status === 'high'
                    ? 'text-triage-yellow'
                    : 'text-triage-green'
                }`}
              >
                {param.value.toLocaleString()}
                <span className="text-xs text-text-muted ml-1 font-sans">
                  {param.unit}
                </span>
              </span>
              <span className="text-text-muted text-xs">
                Ref: {param.normalRange}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
