import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Auth.css';

const UserProfile = () => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra nếu người dùng chưa đăng nhập
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/login');
            return;
        }

        // Lấy thông tin người dùng từ localStorage
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');
        
        if (storedUsername) {
            setUsername(storedUsername);
        }
        
        if (storedRole) {
            setRole(storedRole);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Thông tin tài khoản</h2>
                <div className="user-info">
                    <div className="mb-4 text-center">
                        <i className="bi bi-person-circle" style={{ fontSize: '5rem', color: '#007bff' }}></i>
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold">Tên đăng nhập:</label>
                        <p className="form-control">{username}</p>
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold">Vai trò:</label>
                        <p className="form-control">{role}</p>
                    </div>
                    <button 
                        className="btn btn-danger btn-block mt-4" 
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;