import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Đợi animation kết thúc trước khi xóa toast
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Xác định màu sắc và icon dựa trên loại thông báo
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4caf50',
          icon: 'fas fa-check-circle'
        };
      case 'error':
        return {
          backgroundColor: '#f44336',
          icon: 'fas fa-exclamation-circle'
        };
      case 'warning':
        return {
          backgroundColor: '#ff9800',
          icon: 'fas fa-exclamation-triangle'
        };
      case 'info':
        return {
          backgroundColor: '#2196f3',
          icon: 'fas fa-info-circle'
        };
      default:
        return {
          backgroundColor: '#4caf50',
          icon: 'fas fa-check-circle'
        };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <div 
      className={`toast-notification ${visible ? 'show' : 'hide'}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: toastStyles.backgroundColor,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 9999,
        minWidth: '250px',
        maxWidth: '350px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease'
      }}
    >
      <i 
        className={toastStyles.icon}
        style={{
          fontSize: '1.2rem'
        }}
      ></i>
      <div style={{ flex: 1 }}>{message}</div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => {
            onClose();
          }, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1rem',
          cursor: 'pointer',
          opacity: 0.7,
          transition: 'opacity 0.2s',
          padding: '0',
          marginLeft: '10px'
        }}
        onMouseOver={(e) => e.target.style.opacity = 1}
        onMouseOut={(e) => e.target.style.opacity = 0.7}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;