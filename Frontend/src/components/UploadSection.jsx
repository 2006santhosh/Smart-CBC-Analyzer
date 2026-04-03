import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export default function UploadSection({ onFileValidated, isAnalyzing }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (selectedFile) => {
      setError('');
      setPreview(null);

      if (!selectedFile) return;

      if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a PDF, JPG, or PNG file.');
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size is 10MB.');
        return;
      }

      setFile(selectedFile);

      // Generate preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
      }

      onFileValidated(selectedFile);
    },
    [onFileValidated]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragActive(false);
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError('');
    onFileValidated(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary-500/15 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Upload Report</h3>
          <p className="text-sm text-text-muted">
            PDF or Image (JPG, PNG) • Max 10MB
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`upload-zone rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'drag-active' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              id="upload-dropzone"
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
                id="file-input"
              />

              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4"
              >
                <Upload className="w-7 h-7 text-primary-400" />
              </motion.div>

              <p className="text-white font-medium mb-2">
                {isDragActive
                  ? 'Drop your report here...'
                  : 'Drag & drop your CBC report here'}
              </p>
              <p className="text-text-muted text-sm mb-4">or</p>
              <button
                type="button"
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-primary-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Browse Files
              </button>

              <div className="flex items-center justify-center gap-6 mt-6 text-text-muted text-xs">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </span>
                <span className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" /> JPG
                </span>
                <span className="flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" /> PNG
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-light p-5"
          >
            <div className="flex items-start gap-4">
              {/* File icon / preview */}
              <div className="flex-shrink-0">
                {preview ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={preview}
                      alt="Report preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-red-400" />
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate text-sm">
                  {file.name}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  {formatSize(file.size)} •{' '}
                  {file.type === 'application/pdf' ? 'PDF Document' : 'Image'}
                </p>

                {/* Upload success indicator */}
                <div className="flex items-center gap-1.5 mt-3">
                  <CheckCircle2 className="w-4 h-4 text-triage-green" />
                  <span className="text-triage-green text-xs font-medium">
                    File uploaded successfully
                  </span>
                </div>
              </div>

              {/* Remove button */}
              {!isAnalyzing && (
                <button
                  onClick={removeFile}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Remove file"
                  id="remove-file-btn"
                >
                  <X className="w-4 h-4 text-text-muted hover:text-white" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-triage-red/10 border border-triage-red/20"
          >
            <AlertTriangle className="w-4 h-4 text-triage-red flex-shrink-0" />
            <p className="text-triage-red text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
