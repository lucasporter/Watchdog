import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-2xl",
  showCloseButton = true 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}>
      <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full mx-4 max-h-[90vh] overflow-hidden ${maxWidth}`} style={{
        backgroundColor: '#1f2937',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        margin: '0 1rem',
        maxHeight: '90vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800 rounded-t-lg" style={{
          padding: '1.5rem',
          borderBottom: '1px solid #374151',
          backgroundColor: '#1f2937',
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem'
        }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100" style={{color: '#f9fafb'}}>{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]" style={{
          padding: '1.5rem',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 140px)',
          backgroundColor: '#1f2937'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
} 