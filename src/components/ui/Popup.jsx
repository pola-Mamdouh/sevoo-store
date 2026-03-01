// src/components/ui/Popup.jsx
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

const Popup = ({ 
  type = 'success', // 'success' or 'error' or 'warning'
  title, 
  message, 
  onClose, 
  autoClose = 3000 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-success" />,
    error: <AlertCircle className="w-6 h-6 text-danger" />,
    warning: <AlertCircle className="w-6 h-6 text-warning" />
  };

  const colors = {
    success: 'bg-success/10 border-success/20',
    error: 'bg-danger/10 border-danger/20',
    warning: 'bg-warning/10 border-warning/20'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {title}
            </h3>
            <p className="text-text-muted">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;