import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios';

const UserDashboard = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        
        if (!token || !storedUsername) {
            navigate('/login');
            return;
        }
        
        setUsername(storedUsername);
        setLoading(false);
    }, [navigate]);

    if (loading) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Tài khoản của tôi</h5>
                        </div>
                        <div className="list-group list-group-flush">
                            <Link to="/user" className="list-group-item list-group-item-action active">
                                <i className="bi bi-person me-2"></i> Thông tin tài khoản
                            </Link>
                            <Link to="/user/orders" className="list-group-item list-group-item-action">
                                <i className="bi bi-bag me-2"></i> Đơn hàng của tôi
                            </Link>
                            <Link to="/user/wishlist" className="list-group-item list-group-item-action">
                                <i className="bi bi-heart me-2"></i> Sản phẩm yêu thích
                            </Link>
                            <Link to="/user/address" className="list-group-item list-group-item-action">
                                <i className="bi bi-geo-alt me-2"></i> Địa chỉ
                            </Link>
                            <Link to="/logout" className="list-group-item list-group-item-action text-danger">
                                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Thông tin tài khoản</h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-12 text-center mb-4">
                                    <div className="avatar-placeholder">
                                        <i className="bi bi-person-circle" style={{ fontSize: '5rem' }}></i>
                                    </div>
                                    <h4 className="mt-3">{username}</h4>
                                    <p className="text-muted">Thành viên từ {new Date().toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <i className="bi bi-bag me-2"></i> Đơn hàng
                                            </h5>
                                            <p className="card-text">Xem và quản lý đơn hàng của bạn</p>
                                            <Link to="/user/orders" className="btn btn-outline-primary">Xem đơn hàng</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <i className="bi bi-heart me-2"></i> Yêu thích
                                            </h5>
                                            <p className="card-text">Sản phẩm bạn đã đánh dấu yêu thích</p>
                                            <Link to="/user/wishlist" className="btn btn-outline-primary">Xem danh sách</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
