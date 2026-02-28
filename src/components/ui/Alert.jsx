// components/ui/Alert.jsx
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const colors = {
  success: 'bg-success/10 border-success/20 text-success',
  error: 'bg-danger/10 border-danger/20 text-danger',
  info: 'bg-accent/10 border-accent/20 text-accent',
  warning: 'bg-warning/10 border-warning/20 text-warning',
};

const Alert = ({ type = 'info', message, onClose, autoClose = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed bottom-4 right-4 max-w-md w-full
      animate-in slide-in-from-bottom-4 fade-in duration-300
      ${colors[type]} border rounded-lg shadow-lg
    `}>
      <div className="flex items-start gap-3 p-4">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="flex-1 text-sm">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;