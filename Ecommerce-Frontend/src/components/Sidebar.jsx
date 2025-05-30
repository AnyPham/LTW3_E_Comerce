import React, { useState, useEffect } from "react";
import {
    FaSortAmountDownAlt,
    FaSortAmountUpAlt,
    FaPercent,
    FaEye,
    FaFilter,
    FaStore,
    FaTag,
    // FaCpu,
    FaMemory,
    FaCreditCard
} from "react-icons/fa";

const Sidebar = ({ onSortChange, onFilterChange }) => {
    const [activeSort, setActiveSort] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 780);
            if (window.innerWidth > 780) setIsOpen(true);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSort = (type) => {
        setActiveSort(type);
        if (onSortChange) onSortChange(type);
        if (isMobile) setIsOpen(false);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleFilterClick = (category, value) => {
        const newFilters = { ...activeFilters };
        if (newFilters[category] === value) {
            delete newFilters[category];
        } else {
            newFilters[category] = value;
        }
        setActiveFilters(newFilters);
        if (onFilterChange) onFilterChange(newFilters);
    };

    const isFilterActive = (category, value) => {
        return activeFilters[category] === value;
    };

    return (
        <>
            <style>
                {`
                .sidebar-container {
                    // position: fixed;
                    top: 0;
                    left: 0;
                    width: 280px;
                    // height: 100vh;
                    // background: #ffffff;
                    border-right: 1px solid #e0e0e0;
                    z-index: 1000;
                    transition: transform 0.3s ease;
                    // overflow-y: auto;
                    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
                }
                
                .sidebar-container.mobile-hidden {
                    transform: translateX(-100%);
                }
                
                .sidebar-container.open {
                    transform: translateX(0);
                }
                
                .sidebar-toggle-btn {
                    position: fixed;
                    top: 15px;
                    left: 15px;
                    z-index: 1100;
                    // background: #007bff;
                    border: none;
                    padding: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: none;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 24px;
                    width: 30px;
                }
                
                .sidebar-toggle-btn .bar {
                    height: 3px;
                    // background: white;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }
                
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
                
                @media (max-width: 780px) {
                    .sidebar-toggle-btn {
                        display: flex;
                    }
                    .sidebar-container {
                        transform: translateX(-100%);
                    }
                    .sidebar-container.open {
                        transform: translateX(0);
                    }
                }
                
                .sidebar-content {
                    padding: 20px;
                }
                
                .sidebar-header {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #f0f0f0;
                }
                
                .filter-section {
                    margin-bottom: 25px;
                }
                
                .filter-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .sort-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .sort-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 15px;
                    font-size: 14px;
                    color: #666;
                    // background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                    width: 100%;
                }
                
                .sort-btn:hover {
                    background-color: #e9ecef;
                    color: #333;
                }
                
                .sort-btn.active {
                    background-color: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                
                .sort-btn.red-active.active {
                    background-color: #dc3545;
                    border-color: #dc3545;
                }
                
                .filter-options {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                
                .filter-option {
                    padding: 10px 12px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    color: #666;
                    text-decoration: none;
                    display: block;
                }
                
                .filter-option:hover {
                    background-color: #e9ecef;
                    color: #333;
                    text-decoration: none;
                }
                
                .filter-option.active {
                    background-color: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                
                .dropdown-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 15px;
                }
                
                .dropdown-btn {
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.2s ease;
                }
                
                .dropdown-btn:hover {
                    background-color: #e9ecef;
                }
                
                .dropdown-btn.active {
                    background-color: #007bff;
                    color: white;
                    border-color: #007bff;
                }
                `}
            </style>

            {isMobile && (
                <button
                    className="sidebar-toggle-btn"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            )}

            {isMobile && isOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            <div className={`sidebar-container ${isMobile && !isOpen ? 'mobile-hidden' : 'open'}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        Chọn theo tiêu chí
                    </div>

                    {/* Top Filter Dropdowns */}
                    <div className="dropdown-filters">
                        <button
                            className={`dropdown-btn ${isFilterActive('category', 'bo-loc') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('category', 'bo-loc')}
                        >
                            <FaFilter size={12} /> Bộ lọc
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('store', 'san-hang') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('store', 'san-hang')}
                        >
                            <FaStore size={12} /> Sản hàng
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('price-range', 'gia') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('price-range', 'gia')}
                        >
                            <FaTag size={12} /> Giá
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('rating', '0-cung') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('rating', '0-cung')}
                        >
                            ⭐ 0 cùng
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('shipping', 'dung-luong-ram') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('shipping', 'dung-luong-ram')}
                        >
                            <FaMemory size={12} /> Dung lượng RAM
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('screen', 'kich-thuoc-man-hinh') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('screen', 'kich-thuoc-man-hinh')}
                        >
                            📱 Kích thước màn hình
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('resolution', 'do-phan-giai') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('resolution', 'do-phan-giai')}
                        >
                            🖥️ Độ phân giải
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('card', 'card-do-hoa') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('card', 'card-do-hoa')}
                        >
                            <FaCreditCard size={12} /> Card đồ họa
                        </button>
                    </div>

                    {/* Sort Section */}
                    <div className="filter-section">
                        <div className="filter-title">
                            Sắp xếp theo
                        </div>
                        <div className="sort-buttons">
                            <button
                                onClick={() => handleSort("highToLow")}
                                className={`sort-btn ${activeSort === "highToLow" ? "active" : ""}`}
                            >
                                <FaSortAmountDownAlt size={14} /> Giá Cao - Thấp
                            </button>
                            <button
                                onClick={() => handleSort("lowToHigh")}
                                className={`sort-btn ${activeSort === "lowToHigh" ? "active" : ""}`}
                            >
                                <FaSortAmountUpAlt size={14} /> Giá Thấp - Cao
                            </button>
                            <button
                                onClick={() => handleSort("discount")}
                                className={`sort-btn ${activeSort === "discount" ? "active" : ""}`}
                            >
                                <FaPercent size={14} /> Khuyến Mãi Hot
                            </button>
                            <button
                                onClick={() => handleSort("viewed")}
                                className={`sort-btn red-active ${activeSort === "viewed" ? "active" : ""}`}
                            >
                                <FaEye size={14} /> Xem nhiều
                            </button>
                        </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="filter-section">
                        <div className="filter-title">
                            Tính năng đặc biệt
                        </div>
                        <div className="filter-options">
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('special', 'tinh-nang-dac-biet') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('special', 'tinh-nang-dac-biet');
                                }}
                            >
                                Tính năng đặc biệt
                            </a>
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="filter-title">
                            Công nghệ AI
                        </div>
                        <div className="filter-options">
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('ai', 'cong-nghe-ai') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('ai', 'cong-nghe-ai');
                                }}
                            >
                                Công nghệ AI
                            </a>
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="filter-title">
                            Hãng sản xuất
                        </div>
                        <div className="filter-options">
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('brand', 'hang-san-xuat') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('brand', 'hang-san-xuat');
                                }}
                            >
                                Hãng sản xuất
                            </a>
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="filter-section">
                        <div className="filter-title">
                            Lọc theo giá
                        </div>
                        <div className="filter-options">
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('price', '0-500') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('price', '0-500');
                                }}
                            >
                                Dưới 500.000₫
                            </a>
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('price', '500-1000') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('price', '500-1000');
                                }}
                            >
                                500.000₫ - 1.000.000₫
                            </a>
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('price', '1000-5000') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('price', '1000-5000');
                                }}
                            >
                                1.000.000₫ - 5.000.000₫
                            </a>
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('price', '5000+') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('price', '5000+');
                                }}
                            >
                                Trên 5.000.000₫
                            </a>
                        </div>
                    </div>

                    {/* Promotion Filter */}
                    <div className="filter-section">
                        <div className="filter-title">
                            Khuyến mãi
                        </div>
                        <div className="filter-options">
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('promo', 'discount') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('promo', 'discount');
                                }}
                            >
                                Đang giảm giá
                            </a>
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('promo', 'free-ship') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('promo', 'free-ship');
                                }}
                            >
                                Miễn phí vận chuyển
                            </a>
                            <a
                                href="#"
                                className={`filter-option ${isFilterActive('promo', 'hot') ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterClick('promo', 'hot');
                                }}
                            >
                                Sản phẩm hot
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo content area */}
            {/*<div style={{*/}
            {/*    marginLeft: isMobile ? '0' : '280px',*/}
            {/*    padding: '20px',*/}
            {/*    backgroundColor: '#f8f9fa',*/}
            {/*    minHeight: '100vh'*/}
            {/*}}>*/}
            {/*    <h2>Nội dung chính</h2>*/}
            {/*    <p>Đây là khu vực hiển thị sản phẩm. Sidebar sẽ hiển thị ở bên trái.</p>*/}
            {/*    {Object.keys(activeFilters).length > 0 && (*/}
            {/*        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>*/}
            {/*            <h4>Bộ lọc đã chọn:</h4>*/}
            {/*            <pre>{JSON.stringify(activeFilters, null, 2)}</pre>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*    {activeSort && (*/}
            {/*        <div style={{ marginTop: '10px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>*/}
            {/*            <h4>Sắp xếp hiện tại:</h4>*/}
            {/*            <p>{activeSort}</p>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}
        </>
    );
};

export default Sidebar;