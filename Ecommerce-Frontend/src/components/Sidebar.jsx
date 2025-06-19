import React, { useState, useEffect, memo } from "react";
import {
    FaSortAmountDownAlt,
    FaSortAmountUpAlt,
    FaPercent,
    FaEye,
    FaFilter,
    FaStore,
    FaTag,
    FaMemory,
    FaCreditCard,
    FaSearch,
    FaLaptop,
    FaMobileAlt,
    FaChevronDown
} from "react-icons/fa";

// FilterSection component
const FilterSection = ({ title, icon, children, isExpanded, onToggle }) => {
    return (
        <div className="filter-section">
            <div className="filter-title" onClick={onToggle}>
                {icon}
                <span>{title}</span>
                <FaChevronDown 
                    className={`expand-icon ${isExpanded ? 'rotate-180' : ''}`} 
                    size={12} 
                />
            </div>
            {isExpanded && (
                <div className="filter-options">
                    {children}
                </div>
            )}
        </div>
    );
};

// FilterOption component
const FilterOption = ({ label, isActive, onClick }) => {
    return (
        <div 
            className={`filter-option ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {label}
        </div>
    );
};

const Sidebar = ({ onSortChange, onFilterChange }) => {
    const [activeSort, setActiveSort] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);
    const [expandedSections, setExpandedSections] = useState({
        sort: true,
        price: true,
        brand: false,
        promo: false,
        special: false,
        ai: false
    });

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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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

    const clearAllFilters = () => {
        setActiveFilters({});
        if (onFilterChange) onFilterChange({});
    };

    return (
        <>
            <style>
                {`
                .sidebar-container {
                    position: sticky;
                    top: 0;
                    left: 0;
                    width: 280px;
                    height: 100vh;
                    overflow-y: auto;
                    border-right: 1px solid #e0e0e0;
                    z-index: 1000;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    background: linear-gradient(to bottom, #ffffff, #f9f9f9);
                    scrollbar-width: thin;
                    scrollbar-color: #c1c1c1 #f1f1f1;
                }
                
                .sidebar-container::-webkit-scrollbar {
                    width: 6px;
                }
                
                .sidebar-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                
                .sidebar-container::-webkit-scrollbar-thumb {
                    background-color: #c1c1c1;
                    border-radius: 6px;
                    border: 2px solid #f1f1f1;
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
                    z-index: 1001;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #007bff;
                    border: none;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;
                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                    outline: none;
                }
                
                .sidebar-toggle-btn:hover {
                    background: #0069d9;
                }
                
                .sidebar-toggle-btn .bar {
                    width: 20px;
                    height: 2px;
                    background: white;
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
                    backdrop-filter: blur(2px);
                    transition: all 0.3s ease;
                }
                
                @media (max-width: 780px) {
                    .sidebar-toggle-btn {
                        display: flex;
                    }
                    .sidebar-container {
                        position: fixed;
                        transform: translateX(-100%);
                        height: 100%;
                        width: 260px;
                    }
                    .sidebar-container.open {
                        transform: translateX(0);
                    }
                }
                
                @media (min-width: 781px) {
                    .sidebar-toggle-btn {
                        display: none;
                    }
                }
                
                @media (min-width: 781px) and (max-width: 1024px) {
                    .sidebar-container {
                        width: 240px;
                    }
                }
                
                .sidebar-content {
                    padding: 20px;
                }
                
                .sidebar-header {
                    font-size: 20px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 25px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #007bff;
                    text-align: center;
                    letter-spacing: 0.5px;
                }
                
                .filter-section {
                    margin-bottom: 20px;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .filter-section:hover {
                    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                }
                
                .filter-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #333;
                    padding: 12px 15px;
                    background: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                    transition: all 0.2s ease;
                }
                
                .filter-title:hover {
                    background: #f0f0f0;
                }
                
                .filter-title > span:first-of-type {
                    margin-left: 8px;
                    flex: 1;
                }
                
                .expand-icon {
                    color: #007bff;
                    transition: transform 0.3s ease;
                }
                
                .expand-icon.rotate-180 {
                    transform: rotate(180deg);
                }
                
                .search-box {
                    position: relative;
                    margin-bottom: 15px;
                }
                
                .search-box input {
                    width: 100%;
                    padding: 10px 15px 10px 35px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .search-box input:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                    outline: none;
                }
                
                .search-icon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }
                
                .sort-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;
                }
                
                .sort-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 15px;
                    font-size: 14px;
                    color: #555;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: left;
                    width: 100%;
                    font-weight: 500;
                }
                
                .sort-btn:hover {
                    background-color: #e9ecef;
                    color: #333;
                    transform: translateY(-1px);
                }
                
                .sort-btn.active {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border-color: #007bff;
                    box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
                }
                
                .sort-btn.red-active.active {
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    border-color: #dc3545;
                    box-shadow: 0 2px 5px rgba(220, 53, 69, 0.3);
                }
                
                .filter-options {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 12px;
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .filter-option {
                    padding: 10px 12px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    color: #555;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .filter-option:hover {
                    background-color: #e9ecef;
                    color: #333;
                    text-decoration: none;
                    transform: translateY(-1px);
                }
                
                .filter-option.active {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border-color: #007bff;
                    box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
                }
                
                .filter-option.active::after {
                    content: "✓";
                    font-weight: bold;
                }
                
                .dropdown-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 20px;
                    padding: 5px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                
                .dropdown-btn {
                    padding: 8px 12px;
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #555;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .dropdown-btn:hover {
                    background-color: #f0f0f0;
                    transform: translateY(-1px);
                }
                
                .dropdown-btn.active {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border-color: #007bff;
                    box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
                }
                
                .clear-filters {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }
                
                .clear-btn {
                    padding: 8px 16px;
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                    transition: all 0.2s ease;
                }
                
                .clear-btn:hover {
                    background: #e9ecef;
                    color: #333;
                }
                
                .filter-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                        Bộ Lọc Sản Phẩm
                    </div>

                    {/* Search Box */}
                    <div className="search-box">
                        <FaSearch className="search-icon" size={14} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm bộ lọc..." 
                            aria-label="Tìm kiếm bộ lọc"
                        />
                    </div>

                    {/* Quick Filter Chips */}
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
                            ⭐ Ổ cứng
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('shipping', 'dung-luong-ram') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('shipping', 'dung-luong-ram')}
                        >
                            <FaMemory size={12} /> RAM
                        </button>
                        <button
                            className={`dropdown-btn ${isFilterActive('card', 'card-do-hoa') ? 'active' : ''}`}
                            onClick={() => handleFilterClick('card', 'card-do-hoa')}
                        >
                            <FaCreditCard size={12} /> Card đồ họa
                        </button>
                    </div>

                    {/* Sort Section */}
                    <FilterSection 
                        title="Sắp xếp theo" 
                        icon={<FaSortAmountDownAlt size={14} />}
                        isExpanded={expandedSections.sort}
                        onToggle={() => toggleSection('sort')}
                    >
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
                    </FilterSection>

                    {/* Price Filter */}
                    <FilterSection 
                        title="Lọc theo giá" 
                        icon={<FaTag size={14} />}
                        isExpanded={expandedSections.price}
                        onToggle={() => toggleSection('price')}
                    >
                        <FilterOption 
                            label="Dưới 500.000₫"
                            isActive={isFilterActive('price', '0-500')}
                            onClick={() => handleFilterClick('price', '0-500')}
                        />
                        <FilterOption 
                            label="500.000₫ - 1.000.000₫"
                            isActive={isFilterActive('price', '500-1000')}
                            onClick={() => handleFilterClick('price', '500-1000')}
                        />
                        <FilterOption 
                            label="1.000.000₫ - 5.000.000₫"
                            isActive={isFilterActive('price', '1000-5000')}
                            onClick={() => handleFilterClick('price', '1000-5000')}
                        />
                        <FilterOption 
                            label="Trên 5.000.000₫"
                            isActive={isFilterActive('price', '5000+')}
                            onClick={() => handleFilterClick('price', '5000+')}
                        />
                    </FilterSection>

                    {/* Brand Filter */}
                    <FilterSection 
                        title="Hãng sản xuất" 
                        icon={<FaLaptop size={14} />}
                        isExpanded={expandedSections.brand}
                        onToggle={() => toggleSection('brand')}
                    >
                        <FilterOption 
                            label="Apple"
                            isActive={isFilterActive('brand', 'apple')}
                            onClick={() => handleFilterClick('brand', 'apple')}
                        />
                        <FilterOption 
                            label="Samsung"
                            isActive={isFilterActive('brand', 'samsung')}
                            onClick={() => handleFilterClick('brand', 'samsung')}
                        />
                        <FilterOption 
                            label="Xiaomi"
                            isActive={isFilterActive('brand', 'xiaomi')}
                            onClick={() => handleFilterClick('brand', 'xiaomi')}
                        />
                        <FilterOption 
                            label="Dell"
                            isActive={isFilterActive('brand', 'dell')}
                            onClick={() => handleFilterClick('brand', 'dell')}
                        />
                        <FilterOption 
                            label="HP"
                            isActive={isFilterActive('brand', 'hp')}
                            onClick={() => handleFilterClick('brand', 'hp')}
                        />
                        <FilterOption 
                            label="Asus"
                            isActive={isFilterActive('brand', 'asus')}
                            onClick={() => handleFilterClick('brand', 'asus')}
                        />
                    </FilterSection>

                    {/* Promotion Filter */}
                    <FilterSection 
                        title="Khuyến mãi" 
                        icon={<FaPercent size={14} />}
                        isExpanded={expandedSections.promo}
                        onToggle={() => toggleSection('promo')}
                    >
                        <FilterOption 
                            label="Giảm giá 10%"
                            isActive={isFilterActive('promo', 'discount-10')}
                            onClick={() => handleFilterClick('promo', 'discount-10')}
                        />
                        <FilterOption 
                            label="Giảm giá 20%"
                            isActive={isFilterActive('promo', 'discount-20')}
                            onClick={() => handleFilterClick('promo', 'discount-20')}
                        />
                        <FilterOption 
                            label="Giảm giá 30%"
                            isActive={isFilterActive('promo', 'discount-30')}
                            onClick={() => handleFilterClick('promo', 'discount-30')}
                        />
                        <FilterOption 
                            label="Giảm giá 50% trở lên"
                            isActive={isFilterActive('promo', 'discount-50')}
                            onClick={() => handleFilterClick('promo', 'discount-50')}
                        />
                        <FilterOption 
                            label="Miễn phí vận chuyển"
                            isActive={isFilterActive('promo', 'free-ship')}
                            onClick={() => handleFilterClick('promo', 'free-ship')}
                        />
                        <FilterOption 
                            label="Sản phẩm hot"
                            isActive={isFilterActive('promo', 'hot')}
                            onClick={() => handleFilterClick('promo', 'hot')}
                        />
                        <FilterOption 
                            label="Mã giảm giá đặc biệt"
                            isActive={isFilterActive('promo', 'special-code')}
                            onClick={() => handleFilterClick('promo', 'special-code')}
                        />
                        <FilterOption 
                            label="Khuyến mãi sắp kết thúc"
                            isActive={isFilterActive('promo', 'ending-soon')}
                            onClick={() => handleFilterClick('promo', 'ending-soon')}
                        />
                    </FilterSection>

                    {/* Special Features */}
                    <FilterSection 
                        title="Tính năng đặc biệt" 
                        icon={<FaMobileAlt size={14} />}
                        isExpanded={expandedSections.special}
                        onToggle={() => toggleSection('special')}
                    >
                        <FilterOption 
                            label="Màn hình gập"
                            isActive={isFilterActive('special', 'man-hinh-gap')}
                            onClick={() => handleFilterClick('special', 'man-hinh-gap')}
                        />
                        <FilterOption 
                            label="Chống nước"
                            isActive={isFilterActive('special', 'chong-nuoc')}
                            onClick={() => handleFilterClick('special', 'chong-nuoc')}
                        />
                        <FilterOption 
                            label="Sạc nhanh"
                            isActive={isFilterActive('special', 'sac-nhanh')}
                            onClick={() => handleFilterClick('special', 'sac-nhanh')}
                        />
                        <FilterOption 
                            label="Camera cao cấp"
                            isActive={isFilterActive('special', 'camera-cao-cap')}
                            onClick={() => handleFilterClick('special', 'camera-cao-cap')}
                        />
                    </FilterSection>

                    {/* AI Technology */}
                    <FilterSection 
                        title="Công nghệ AI" 
                        icon={<FaMemory size={14} />}
                        isExpanded={expandedSections.ai}
                        onToggle={() => toggleSection('ai')}
                    >
                        <FilterOption 
                            label="AI Camera"
                            isActive={isFilterActive('ai', 'ai-camera')}
                            onClick={() => handleFilterClick('ai', 'ai-camera')}
                        />
                        <FilterOption 
                            label="AI Assistant"
                            isActive={isFilterActive('ai', 'ai-assistant')}
                            onClick={() => handleFilterClick('ai', 'ai-assistant')}
                        />
                        <FilterOption 
                            label="AI Processing"
                            isActive={isFilterActive('ai', 'ai-processing')}
                            onClick={() => handleFilterClick('ai', 'ai-processing')}
                        />
                    </FilterSection>

                    {/* Clear All Filters Button */}
                    {Object.keys(activeFilters).length > 0 && (
                        <div className="clear-filters">
                            <button 
                                className="clear-btn"
                                onClick={clearAllFilters}
                            >
                                Xóa tất cả bộ lọc ({Object.keys(activeFilters).length})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default memo(Sidebar);