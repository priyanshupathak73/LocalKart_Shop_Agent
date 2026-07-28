"use client";

import React, { useState } from 'react';
import { FileText, Trash2, Check, Loader2, UploadCloud, AlertCircle } from 'lucide-react';

export const DocumentUploadCard = ({
  doc,
  title,
  subtitle,
  docKey,
  required,
  uploadedUrl,
  onUploadSuccess,
  file,
  ocr,
  handleFileUploadSim,
  handleRemoveFile,
  showToast
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);

  // Safe doc object resolution
  const docObj = doc || {
    key: docKey || 'file',
    label: title || 'Document Upload',
    description: subtitle || '',
    optional: !required
  };

  const [localFile, setLocalFile] = useState(null);

  const activeFile = file || localFile || (uploadedUrl ? { name: typeof uploadedUrl === 'string' ? uploadedUrl.split('/').pop() : 'Uploaded Document', progress: 100, verified: true } : null);
  const activeOcr = ocr || (activeFile?.verified ? 'success' : null);

  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  const validateAndUpload = (selectedFile) => {
    if (!selectedFile) return;
    setFileError(null);

    // 1. Check size limit (max 10MB)
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const err = `File size (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit.`;
      setFileError(err);
      if (showToast) showToast('File Size Exceeded', err, 'error');
      return;
    }

    // 2. Check allowed formats (JPG, PNG, PDF)
    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      const err = `Invalid format (${ext}). Allowed: JPG, PNG, PDF`;
      setFileError(err);
      if (showToast) showToast('Invalid File Format', err, 'error');
      return;
    }

    if (handleFileUploadSim) {
      handleFileUploadSim(docObj.key, selectedFile);
    } else {
      setLocalFile({ name: selectedFile.name, progress: 50, verified: false });
      setTimeout(() => {
        setLocalFile({ name: selectedFile.name, progress: 100, verified: true });
        if (onUploadSuccess) {
          onUploadSuccess({ fileName: selectedFile.name, fileUrl: URL.createObjectURL(selectedFile) });
        }
      }, 300);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const onRemove = () => {
    setFileError(null);
    setLocalFile(null);
    if (handleRemoveFile) {
      handleRemoveFile(docObj.key);
    } else if (onUploadSuccess) {
      onUploadSuccess({ fileName: null, fileUrl: null });
    }
  };

  return (
    <div className="border border-slate-200/80 dark:border-slate-800/80 p-4 bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between gap-3 shadow-sm hover:border-emerald-500/50 transition-all text-left">
      <div className="text-left space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-heading">
            {docObj.label}
          </h5>
          {docObj.optional ? (
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full font-extrabold uppercase shrink-0">
              Optional
            </span>
          ) : (
            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full font-bold shrink-0">
              Required
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{docObj.description}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-md font-mono">
            JPG, PNG, PDF (Max 10MB)
          </span>
        </div>
      </div>

      {fileError && (
        <div className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {activeFile ? (
        <div className="border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3 shrink-0 max-w-[75%]">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <FileText className="w-4 h-4" />
            </span>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-mono">{activeFile.name}</p>
              {activeFile.progress < 100 ? (
                <div className="w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-emerald-500 transition-all duration-200" style={{ width: `${activeFile.progress}%` }} />
                </div>
              ) : activeOcr === 'processing' ? (
                <span className="text-[9px] font-bold text-amber-500 animate-pulse flex items-center gap-1 mt-0.5 font-heading">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying Document...
                </span>
              ) : activeOcr === 'success' ? (
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-heading">
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" /> Authenticated
                </span>
              ) : (
                <span className="text-[9px] font-bold text-slate-400 mt-0.5 block font-heading">File Uploaded</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors shrink-0"
            title="Remove File"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all relative flex flex-col items-center justify-center min-h-[96px] ${
            dragOver
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/70 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndUpload(e.target.files[0]);
              }
            }}
          />
          <div className="p-2 bg-white dark:bg-slate-800 text-emerald-500 rounded-xl shadow-xs mb-1.5">
            <UploadCloud className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">Click or Drag to Upload</span>
          <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Formats: JPG, PNG or PDF (max 10MB)</span>
        </label>
      )}
    </div>
  );
};
