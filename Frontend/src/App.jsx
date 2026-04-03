import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ValidationMessage from './components/ValidationMessage';
import AnalyzeButton from './components/AnalyzeButton';
import LoadingState from './components/LoadingState';
import ResultCard from './components/ResultCard';
import PrivacyNotice from './components/PrivacyNotice';
import { extractText } from './utils/extractText';
import { validateCBC } from './utils/validateCBC';
import { parseCBC } from './utils/parseCBC';
import { analyzeCBC } from './utils/analyzeCBC';
import { generateExplanation } from './utils/generateExplanation';
import { getRecommendations } from './utils/getRecommendations';
import Login from './Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [validationStatus, setValidationStatus] = useState('idle');

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    setUser(savedUser || "");
  }, []);
  const [validationData, setValidationData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
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
      const ocrResult = await extractText(selectedFile, (msg) => {
         // Could use this for progress updates if we expand UI state
         console.log(msg);
      });

      if (!ocrResult.success) {
         setValidationStatus('invalid');
         setValidationData({ error: ocrResult.error });
         return;
      }

      const vData = validateCBC(ocrResult.text);
      setValidationData(vData);
      setValidationStatus(vData.isValid ? 'valid' : 'invalid');
      
    } catch (e) {
      setValidationStatus('invalid');
      setValidationData({ error: 'An unexpected error occurred during validation' });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!file || validationStatus !== 'valid') return;

    setIsAnalyzing(true);
    setResults(null);
    setProgress(0);
    setLoadingStep('Extracting text...');

    try {
      // 1. Text Extraction
      const ocrResult = await extractText(file, (msg) => {
         // Optionally update step message based on OCR progress
         if (msg.includes('%')) {
             setProgress(parseInt(msg.match(/\d+/)[0]));
         }
      });

      if (!ocrResult.success) {
         throw new Error(ocrResult.error);
      }
      
      setProgress(40);
      setLoadingStep('Parsing report...');
      // simulated small delay to show state
      await new Promise(r => setTimeout(r, 600));

      // 2. Parsed Data
      const parsedData = parseCBC(ocrResult.text);
      
      setProgress(60);
      setLoadingStep('Analyzing values...');
      await new Promise(r => setTimeout(r, 600));

      // 3. Analysis (Ranges, Status, Severity)
      const analysis = analyzeCBC(parsedData);
      
      if (analysis.error) {
         throw new Error(analysis.error);
      }

      setProgress(80);
      setLoadingStep('Generating insights...');
      await new Promise(r => setTimeout(r, 600));

      // 4. Rule-based Explanations
      const explanation = generateExplanation(parsedData, analysis);
      
      // 5. Recommendations
      const recommendations = getRecommendations(analysis);

      setProgress(100);
      await new Promise(r => setTimeout(r, 400)); // Let the 100% animate

      // Format to match UI expectations
      setResults({
        parameters: analysis.parameters,
        overallRisk: analysis.risk,
        abnormalCount: analysis.abnormalCount,
        criticalCount: analysis.criticalCount,
        aiExplanation: explanation,
        recommendations: recommendations,
        emergencyAlert: analysis.risk === 'HIGH'
      });
      setIsAnalyzing(false);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);

    } catch (err) {
      console.error(err);
      alert(`Analysis failed: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = validationStatus === 'valid' && !isAnalyzing;

  // Wait for React to mount and read localStorage
  if (user === null) {
    return <div style={{ color: "white", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#0f172a" }}>Loading...</div>;
  }

  // Force login page if user does not exist
  if (!user) {
    return <Login setUser={setUser} />;
  }

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
        <Header user={user} setUser={setUser} />

        <main className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
          {/* Upload + Validation */}
          <div>
            <UploadSection
              onFileValidated={handleFileValidated}
              isAnalyzing={isAnalyzing}
            />
            <ValidationMessage
              status={validationStatus}
              confidence={validationData?.confidence || 0}
              keywords={validationData?.detectedKeywords || []}
              error={validationData?.error}
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
            {isAnalyzing && <LoadingState progress={progress} stepMsg={loadingStep} />}
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
