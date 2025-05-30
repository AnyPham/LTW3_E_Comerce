import React, { useState } from 'react';
import { Phone, MapPin, Twitter, Facebook, Instagram, Youtube, Music } from 'lucide-react';
import '../App.css';

const LaptopShopFooter = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            alert('Đăng ký nhận khuyến mãi thành công!');
            setEmail('');
        }
    };

    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="newsletter-section">
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <div>
                            <h3 className="newsletter-title">
                                Đăng Ký Nhận Khuyến Mãi
                            </h3>
                        </div>
                        <div className="newsletter-form-wrapper">
                            <form onSubmit={handleSubscribe} className="newsletter-form">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập Email của bạn"
                                    className="newsletter-input"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="newsletter-button"
                                >
                                    Đăng Ký
                                </button>
                            </form>

                            {/* Social Media Icons */}
                            <div className="social-media-icons">
                                <a href="#" className="social-icon">
                                    <Twitter size={20} className="text-gray-600" />
                                </a>
                                <a href="#" className="social-icon">
                                    <Facebook size={20} className="text-blue-600" />
                                </a>
                                <a href="#" className="social-icon">
                                    <Instagram size={20} className="text-pink-600" />
                                </a>
                                <a href="#" className="social-icon">
                                    <Youtube size={20} className="text-red-600" />
                                </a>
                                <a href="#" className="social-icon">
                                    <Music size={20} className="text-purple-600" />
                                </a>
                                <a href="#" className="social-icon">
                                    <div className="social-icon-placeholder"></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-grid">

                        {/* Company Info */}
                        <div>
                            <h3 className="footer-section-title">
                                CÔNG TY CỔ PHẦN LAPTOP SHOP
                            </h3>
                            <div className="company-info">
                                <div className="contact-item">
                                    <Phone size={16} className="contact-icon" />
                                    <div className="contact-info">
                                        <p className="contact-label">Hotline</p>
                                        <p className="contact-value">18008118</p>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <MapPin size={16} className="contact-icon" />
                                    <div className="contact-info">
                                        <p className="contact-label">Shop</p>
                                        <p className="contact-value">Hệ thống các cửa hàng</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Policies */}
                        <div>
                            <h3 className="footer-section-title">
             om                   CHÍNH SÁCH
                            </h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Chính sách đổi trả, bảo hành</a></li>
                                <li><a href="#" className="footer-link">Chính sách bảo mật</a></li>
                                <li><a href="#" className="footer-link">Chính sách giao hàng</a></li>
                                <li><a href="#" className="footer-link">Chính sách khách hàng thân thiết</a></li>
                            </ul>
                        </div>

                        {/* Customer Care */}
                        <div>
                            <h3 className="footer-section-title">
                                CHĂM SÓC KHÁCH HÀNG
                            </h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Tổng đài chăm sóc khách hàng</a></li>
                                <li><a href="#" className="footer-link">Hướng dẫn chọn size</a></li>
                            </ul>
                        </div>

                        {/* Resources & Recruitment */}
                        <div>
                            <h3 className="footer-section-title">
                                TÀI LIỆU - TUYỂN DỤNG
                            </h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Tuyển dụng</a></li>
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="footer-section-title">
                                VỀ LAPTOP SHOP
                            </h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Tin tức</a></li>
                                <li><a href="#" className="footer-link">Hệ thống cửa hàng</a></li>
                                <li><a href="#" className="footer-link">Về chúng tôi</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-bottom-content">
                        <div className="copyright-text">
                            <p>Copyrights © 2023 by Laptop Shop.</p>
                            <p>
                                Mã số doanh nghiệp: 1001256327. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế Hoạch và Đầu tư Tỉnh Thái Bình cấp lần đầu ngày 30/11/2022.
                            </p>
                        </div>

                        {/* Certification Badge */}
                        {/*<div className="certification-badges">*/}
                        {/*    <div className="badge-group">*/}
                        {/*        <div className="certification-badge badge-blue">*/}
                        {/*            <span className="badge-text">ĐÃ THÔNG BÁO</span>*/}
                        {/*        </div>*/}
                        {/*        <div className="certification-badge badge-green">*/}
                        {/*            <span className="badge-text">DMCA PROTECTED</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LaptopShopFooter;