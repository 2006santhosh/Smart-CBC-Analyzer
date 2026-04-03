import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ValidationMessage from './components/ValidationMessage';
import AnalyzeButton from './components/AnalyzeButton';
import LoadingState from './components/LoadingState';
import ResultCard from './components/ResultCard';
import PrivacyNotice from './components/PrivacyNotice';
import { validateCBCReport, analyzeReport } from './data/mockData';

export default function App() {
  const [file, setFile] = useState(null);
  const [validationStatus, setValidationStatus] = useState('idle');
  const [validationData, setValidationData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const resultsRef = useRef(null);
  const progressInterval = useRef(null);

  const handleFileValidated = useCallback(async (selectedFile) => {
    setResults(null);
    setProgress(0);

    if (!selectedFile) {
      setFile(null);
      setValidationStatus('idle');
      setValidationData(null);
      return;
    }

    setFile(selectedFile);
    setValidationStatus('validating');

    try {
      const result = await validateCBCReport(selectedFile);
      setValidationData(result);
      setValidationStatus(result.isValid ? 'valid' : 'invalid');
    } catch {
      setValidationStatus('invalid');
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file || validationStatus !== 'valid') return;

    setIsAnalyzing(true);
    setResults(null);
    setProgress(0);

    // Simulate progress
    let p = 0;
    progressInterval.current = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p > 95) p = 95;
      setProgress(p);
    }, 200);

    try {
      const data = await analyzeReport();
      clearInterval(progressInterval.current);
      setProgress(100);

      // Small delay so the 100% is visible
      await new Promise((r) => setTimeout(r, 400));

      setResults(data);
      setIsAnalyzing(false);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);
    } catch {
      clearInterval(progressInterval.current);
      setIsAnalyzing(false);
    }
  }, [file, validationStatus]);

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const canAnalyze = validationStatus === 'valid' && !isAnalyzing;

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-triage-green/3 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '4s' }}
          />
        </div>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
          {/* Upload + Validation */}
          <div>
            <UploadSection
              onFileValidated={handleFileValidated}
              isAnalyzing={isAnalyzing}
            />
            <ValidationMessage
              status={validationStatus}
              confidence={
                validationData
                  ? Math.round(validationData.confidence * 100)
                  : 0
              }
              keywords={validationData?.detectedKeywords}
            />
          </div>

          {/* Analyze Button */}
          <AnalyzeButton
            disabled={!canAnalyze}
            loading={isAnalyzing}
            onClick={handleAnalyze}
          />

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {isAnalyzing && <LoadingState progress={progress} />}
          </AnimatePresence>

          {/* Results */}
          <div ref={resultsRef}>
            <AnimatePresence>
              {results && <ResultCard results={results} />}
            </AnimatePresence>
          </div>

          {/* Privacy Notice */}
          <PrivacyNotice />
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-text-muted text-xs border-t border-white/5">
          <p>
            TriageAI © {new Date().getFullYear()} • For demonstration purposes
            only • Not a substitute for professional medical advice
          </p>
        </footer>
      </div>
    </div>
  );
}
