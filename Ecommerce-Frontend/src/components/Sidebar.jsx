import React, { useState } from "react";
import { FaSortAmountDownAlt, FaSortAmountUpAlt, FaPercent, FaEye } from "react-icons/fa";

const Sidebar = ({ onSortChange }) => {
    const [activeSort, setActiveSort] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSort = (type) => {
        setActiveSort(type);
        if (onSortChange) onSortChange(type);
        setIsOpen(false); // đóng sidebar khi chọn (đặc biệt mobile)
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                className={`sidebar-toggle-btn ${isOpen ? "open" : ""}`}
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {/* Overlay khi sidebar mở trên mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <h4>Sắp xếp theo</h4>
                <div className="sort-buttons">
                    <button
                        onClick={() => handleSort("highToLow")}
                        className={`sort-btn ${activeSort === "highToLow" ? "active" : ""}`}
                    >
                        <FaSortAmountDownAlt /> Giá Cao - Thấp
                    </button>
                    <button
                        onClick={() => handleSort("lowToHigh")}
                        className={`sort-btn ${activeSort === "lowToHigh" ? "active" : ""}`}
                    >
                        <FaSortAmountUpAlt /> Giá Thấp - Cao
                    </button>
                    <button
                        onClick={() => handleSort("discount")}
                        className={`sort-btn ${activeSort === "discount" ? "active" : ""}`}
                    >
                        <FaPercent /> Khuyến Mãi Hot
                    </button>
                    <button
                        onClick={() => handleSort("viewed")}
                        className={`sort-btn red-outline ${activeSort === "viewed" ? "active" : ""}`}
                    >
                        <FaEye /> Xem nhiều
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
