import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axios';
import './styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra nếu người dùng đã đăng nhập
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('role', res.data.role);
            
            // Chuyển hướng về trang chủ
            navigate('/');
            
            // Reload trang để cập nhật trạng thái đăng nhập trên Navbar
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Đăng nhập</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Nhập tên đăng nhập" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Nhập mật khẩu" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block" 
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <div className="auth-links mt-3">
                    <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
