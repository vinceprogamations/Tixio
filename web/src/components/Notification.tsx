"use client";

import { useEffect, useState } from "react";

export interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  type, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Aguarda animação
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getAlertClass = () => {
    switch (type) {
      case "success": return "alert-success";
      case "error": return "alert-danger";
      case "warning": return "alert-warning";
      case "info": return "alert-info";
      default: return "alert-info";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success": return "✓";
      case "error": return "✕";
      case "warning": return "⚠";
      case "info": return "ℹ";
      default: return "ℹ";
    }
  };

  return (
    <div 
      className={`alert ${getAlertClass()} alert-dismissible fade ${isVisible ? 'show' : ''}`}
      role="alert"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div className="d-flex align-items-center">
        <span className="me-2" style={{ fontSize: '1.2em' }}>
          {getIcon()}
        </span>
        <span className="flex-grow-1">{message}</span>
        <button
          type="button"
          className="btn-close"
          onClick={handleClose}
          aria-label="Fechar"
        />
      </div>
    </div>
  );
}

// Hook para gerenciar notificações
export function useNotification() {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([]);

  const addNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      onClose: () => removeNotification(id)
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => {
    addNotification({ type: "success", message, duration });
  };

  const showError = (message: string, duration?: number) => {
    addNotification({ type: "error", message, duration });
  };

  const showWarning = (message: string, duration?: number) => {
    addNotification({ type: "warning", message, duration });
  };

  const showInfo = (message: string, duration?: number) => {
    addNotification({ type: "info", message, duration });
  };

  const NotificationContainer = () => (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    NotificationContainer
  };
}

