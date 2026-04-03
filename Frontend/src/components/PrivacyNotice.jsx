import { Shield, Lock } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-text-muted" id="privacy-notice">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
        <Lock className="w-4 h-4 text-triage-green" />
        <p className="text-xs">
          <span className="text-triage-green font-medium">Privacy First</span>{' '}
          — This app does not store any medical reports. All processing is
          temporary and data is discarded after analysis.
        </p>
      </div>
    </div>
  );
}
