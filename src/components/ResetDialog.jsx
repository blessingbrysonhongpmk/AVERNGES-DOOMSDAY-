import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

export default function ResetDialog({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const dialog = (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
    >
      <div
        className="w-full max-w-md bg-[#111216] border border-[#1E2024] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] relative"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5 text-[#F5F5F5]">
            <AlertTriangle className="w-5 h-5 text-[#E62429]" />
            <h3 id="reset-dialog-title" className="text-base font-cinematic font-bold tracking-wider text-[#F5F5F5] uppercase">
              Reset Progress
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="text-[#777A80] hover:text-[#F5F5F5] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#777A80] mb-6 font-light leading-relaxed">
          Are you sure you want to reset your watchlist progress? This will uncheck all 15 chapters and clear your saved progress.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono tracking-wider text-[#777A80] hover:text-[#F5F5F5] border border-[#1E2024] hover:border-[#2D3036] transition-colors"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-mono tracking-wider text-white bg-[#E62429] hover:bg-[#F0383D] transition-colors font-medium"
          >
            CONFIRM RESET
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(dialog, document.body);
  }
  return dialog;
}
