import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import Sidebar from "../components/Sidebar";
import Footer from '../components/Footer';
import { useToast } from './ToastManager';

// Hàm xác định màu nền cho các bộ lọc
const getFilterBgColor = (filterKey) => {
    switch(filterKey) {
        case 'category':
            return '#e8f5e9';
        case 'price':
            return '#fff8e1';
        case 'brand':
            return '#f3e5f5';
        case 'promo':
            return '#ffebee';
        default:
            return '#e0e0e0';
    }
};

// Hàm xác định màu chữ cho các bộ lọc
const getFilterTextColor = (filterKey) => {
    switch(filterKey) {
        case 'category':
            return '#2e7d32';
        case 'price':
            return '#ff8f00';
        case 'brand':
            return '#6a1b9a';
        case 'promo':
            return '#c62828';
        default:
            return '#424242';
    }
};

// Hàm xác định biểu tượng cho các bộ lọc
const getFilterIcon = (filterKey) => {
    switch(filterKey) {
        case 'category':
            return 'fas fa-tag';
        case 'price':
            return 'fas fa-dollar-sign';
        case 'brand':
            return 'fas fa-building';
        case 'promo':
            return 'fas fa-percent';
        default:
            return 'fas fa-filter';
    }
};

const Home = ({ selectedCategory }) => {
    const { data, isError, addToCart, refreshData } = useContext(AppContext);
    const toast = useToast();
    const [products, setProducts] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortType, setSortType] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    useEffect(() => {
        if (!isDataFetched) {
            refreshData();
            setIsDataFetched(true);
        }
    }, [refreshData, isDataFetched]);

    useEffect(() => {
        if (data && data.length > 0) {
            const fetchImagesAndUpdateProducts = async () => {
                const updatedProducts = await Promise.all(
                    data.map(async (product) => {
                        try {
                            const response = await axios.get(
                                `http://localhost:8080/api/product/${product.id}/image`,
                                { responseType: "blob" }
                            );
                            const imageUrl = URL.createObjectURL(response.data);
                            return { ...product, imageUrl };
                        } catch (error) {
                            console.error("Error fetching image for product ID:", product.id, error);
                            return { ...product, imageUrl: "placeholder-image-url" };
                        }
                    })
                );
                setProducts(updatedProducts);
            };

            fetchImagesAndUpdateProducts();
        }
    }, [data]);

    // Apply filters and sorting whenever products, selectedCategory, sortType, or activeFilters change
    useEffect(() => {
        let result = selectedCategory
            ? products.filter((product) => product.category === selectedCategory)
            : products;

        // Apply price filter
        if (activeFilters.price) {
            const priceRange = activeFilters.price;
            result = result.filter((product) => {
                const price = parseFloat(product.price);
                switch (priceRange) {
                    case '0-500':
                        return price < 500000;
                    case '500-1000':
                        return price >= 500000 && price <= 1000000;
                    case '1000-5000':
                        return price > 1000000 && price <= 5000000;
                    case '5000+':
                        return price > 5000000;
                    default:
                        return true;
                }
            });
        }

        // Apply promotion filter
        if (activeFilters.promo) {
            switch (activeFilters.promo) {
                case 'discount-10':
                    // Sản phẩm giảm giá 10%
                    result = result.filter((product) => 
                        product.discountPercent >= 10 && product.discountPercent < 20);
                    break;
                case 'discount-20':
                    // Sản phẩm giảm giá 20%
                    result = result.filter((product) => 
                        product.discountPercent >= 20 && product.discountPercent < 30);
                    break;
                case 'discount-30':
                    // Sản phẩm giảm giá 30%
                    result = result.filter((product) => 
                        product.discountPercent >= 30 && product.discountPercent < 50);
                    break;
                case 'discount-50':
                    // Sản phẩm giảm giá 50% trở lên
                    result = result.filter((product) => 
                        product.discountPercent >= 50);
                    break;
                case 'free-ship':
                    // Sản phẩm miễn phí vận chuyển
                    result = result.filter((product) => product.freeShipping);
                    break;
                case 'hot':
                    // Sản phẩm hot
                    result = result.filter((product) => 
                        product.isHot || (product.viewCount && product.viewCount > 100));
                    break;
                case 'special-code':
                    // Sản phẩm có mã giảm giá đặc biệt
                    result = result.filter((product) => product.promoCode);
                    break;
                case 'ending-soon':
                    // Khuyến mãi sắp kết thúc (còn 3 ngày)
                    const threeDaysFromNow = new Date();
                    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                    
                    result = result.filter((product) => 
                        product.promoEndDate && new Date(product.promoEndDate) <= threeDaysFromNow && 
                        new Date(product.promoEndDate) >= new Date());
                    break;
                default:
                    break;
            }
        }

        // Apply brand filter (if brand filter is selected)
        if (activeFilters.brand && activeFilters.brand !== 'hang-san-xuat') {
            result = result.filter((product) =>
                product.brand.toLowerCase().includes(activeFilters.brand.toLowerCase())
            );
        }

        // Apply sorting
        if (sortType) {
            switch (sortType) {
                case 'highToLow':
                    result = [...result].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                    break;
                case 'lowToHigh':
                    result = [...result].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    break;
                case 'discount':
                    // Sort by discount percentage or products with discounts first
                    result = [...result].sort((a, b) => {
                        const aDiscount = a.discount || 0;
                        const bDiscount = b.discount || 0;
                        return bDiscount - aDiscount;
                    });
                    break;
                case 'viewed':
                    // Sort by view count (assuming viewCount field exists)
                    result = [...result].sort((a, b) => {
                        const aViews = a.viewCount || 0;
                        const bViews = b.viewCount || 0;
                        return bViews - aViews;
                    });
                    break;
                default:
                    break;
            }
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, selectedCategory, sortType, activeFilters]);

    const handleSortChange = (newSortType) => {
        setSortType(newSortType);
    };

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Thêm hàm xử lý previous và next page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxVisiblePages = 9;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show first page, current page with neighbors, and last page
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        // Styles cho button
        const buttonStyle = {
            padding: '10px 14px',
            margin: '0 3px',
            border: 'none',
            backgroundColor: '#f5f5f5',
            color: '#424242',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            minWidth: '42px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        };

        const activeButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#1976d2',
            color: '#fff',
            fontWeight: '600',
            boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
        };

        const disabledButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#eeeeee',
            color: '#9e9e9e',
            cursor: 'not-allowed',
            boxShadow: 'none'
        };

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '30px 0',
                gap: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    {/* Previous Button */}
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
                        onMouseEnter={(e) => {
                            if (currentPage !== 1) {
                                e.target.style.backgroundColor = '#e3f2fd';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== 1) {
                                e.target.style.backgroundColor = '#f5f5f5';
                            }
                        }}
                        title="Trang trước"
                    >
                        <i className="fas fa-chevron-left" style={{marginRight: '5px'}}></i> Trước
                    </button>

                    {/* Page Numbers */}
                    {pageNumbers.map((number, index) => (
                        number === '...' ? (
                            <span key={index} style={{
                                padding: '10px 5px',
                                color: '#757575',
                                fontSize: '14px'
                            }}>...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => handlePageChange(number)}
                                style={currentPage === number ? activeButtonStyle : buttonStyle}
                                onMouseEnter={(e) => {
                                    if (currentPage !== number) {
                                        e.target.style.backgroundColor = '#e3f2fd';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== number) {
                                        e.target.style.backgroundColor = '#f5f5f5';
                                    }
                                }}
                            >
                                {number}
                            </button>
                        )
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
                        onMouseEnter={(e) => {
                            if (currentPage !== totalPages) {
                                e.target.style.backgroundColor = '#e3f2fd';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== totalPages) {
                                e.target.style.backgroundColor = '#f5f5f5';
                            }
                        }}
                        title="Trang sau"
                    >
                        Tiếp <i className="fas fa-chevron-right" style={{marginLeft: '5px'}}></i>
                    </button>
                </div>

                {/* Page Info */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{
                        color: '#757575',
                        fontSize: '14px',
                        backgroundColor: '#f5f5f5',
                        padding: '6px 12px',
                        borderRadius: '20px'
                    }}>
                        Trang {currentPage} / {totalPages}
                    </span>
                    <span style={{
                        color: '#757575',
                        fontSize: '14px'
                    }}>
                        Hiển thị {(currentPage - 1) * productsPerPage + 1} - {Math.min(currentPage * productsPerPage, filteredProducts.length)} trên {filteredProducts.length} sản phẩm
                    </span>
                </div>
            </div>
        );
    };

    if (isError) {
        return (
            <h2 className="text-center" style={{ padding: "18rem" }}>
                <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }} />
            </h2>
        );
    }

    return (
        <>
            {/* Main container with flex column layout */}
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", marginTop: "64px" }}>
                {/* Content area with sidebar and products */}
                <div style={{ display: "flex", flex: "1" }}>
                    <Sidebar
                        onSortChange={handleSortChange}
                        onFilterChange={handleFilterChange}
                    />

                    <div style={{ flexGrow: 1 }}>
                        {/* Header section with category title and product count */}
                        <div style={{
                            padding: '25px 25px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <h1 style={{
                                fontSize: '1.8rem',
                                fontWeight: '600',
                                color: '#212121',
                                margin: '0'
                            }}>
                                {activeFilters.category ? activeFilters.category.charAt(0).toUpperCase() + activeFilters.category.slice(1) : 'Tất cả sản phẩm'}
                            </h1>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#757575',
                                margin: '0'
                            }}>
                                Hiển thị {filteredProducts.length} sản phẩm {activeFilters.category ? `trong danh mục ${activeFilters.category}` : ''}
                            </p>
                        </div>

                        {/* Filter and Sort Display Bar */}
                        {(Object.keys(activeFilters).length > 0 || sortType) && (
                            <div style={{
                                padding: '12px 20px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                margin: '20px 25px 15px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    alignItems: 'center',
                                    fontSize: '13px'
                                }}>
                                    <span style={{
                                        fontWeight: '600',
                                        color: '#424242',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <i className="fas fa-filter" style={{fontSize: '12px'}}></i>
                                        Bộ lọc:
                                    </span>
                                    {sortType && (
                                        <span style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#e3f2fd',
                                            color: '#1976d2',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <i className="fas fa-sort-amount-down"></i>
                                            {
                                                sortType === 'highToLow' ? 'Giá Cao - Thấp' :
                                                sortType === 'lowToHigh' ? 'Giá Thấp - Cao' :
                                                sortType === 'discount' ? 'Khuyến Mãi Hot' :
                                                sortType === 'viewed' ? 'Xem nhiều' : sortType
                                            }
                                            <button 
                                                onClick={() => handleSortChange(null)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '0',
                                                    marginLeft: '5px',
                                                    color: '#1976d2',
                                                    fontSize: '10px'
                                                }}
                                                title="Xóa bộ lọc"
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </button>
                                        </span>
                                    )}
                                    {Object.entries(activeFilters).map(([key, value]) => (
                                        <span key={key} style={{
                                            padding: '6px 12px',
                                            backgroundColor: getFilterBgColor(key),
                                            color: getFilterTextColor(key),
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                        }}>
                                            <i className={getFilterIcon(key)} style={{fontSize: '10px'}}></i>
                                            {key === 'price' ? (
                                                value === '0-500' ? 'Dưới 500k' :
                                                    value === '500-1000' ? '500k - 1tr' :
                                                        value === '1000-5000' ? '1tr - 5tr' :
                                                            value === '5000+' ? 'Trên 5tr' : value
                                            ) : key === 'promo' ? (
                                                value === 'discount-10' ? 'Giảm 10%' :
                                                value === 'discount-20' ? 'Giảm 20%' :
                                                value === 'discount-30' ? 'Giảm 30%' :
                                                value === 'discount-50' ? 'Giảm 50%+' :
                                                value === 'free-ship' ? 'Free ship' :
                                                value === 'hot' ? 'Hot' : 
                                                value === 'special-code' ? 'Mã giảm giá' :
                                                value === 'ending-soon' ? 'Sắp kết thúc' : value
                                            ) : value}
                                            <button 
                                                onClick={() => {
                                                    const newFilters = {...activeFilters};
                                                    delete newFilters[key];
                                                    handleFilterChange(newFilters);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '0',
                                                    marginLeft: '5px',
                                                    color: getFilterTextColor(key),
                                                    fontSize: '10px'
                                                }}
                                                title="Xóa bộ lọc"
                                            >
                                                <i className="fas fa-times-circle"></i>
                                            </button>
                                        </span>
                                    ))}
                                    <span style={{
                                        fontSize: '12px',
                                        color: '#6c757d',
                                        marginLeft: '10px',
                                        fontStyle: 'italic'
                                    }}>
                                        ({filteredProducts.length} sản phẩm - Trang {currentPage}/{totalPages})
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        <div
                            className="grid-container"
                            style={{
                                padding: "20px",
                            }}
                        >
                            <div
                                className="grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: "25px",
                                    paddingTop: "20px",
                                }}
                            >
                                {currentProducts.length === 0 ? (
                                    <div className="no-products-found"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gridColumn: '1 / -1',
                                            height: '300px',
                                            textAlign: 'center',
                                            padding: '20px'
                                        }}>
                                        <i className="fas fa-search" style={{
                                            fontSize: '3rem',
                                            color: '#bdbdbd',
                                            marginBottom: '20px'
                                        }}></i>
                                        <h2 style={{
                                            fontSize: '1.5rem',
                                            color: '#616161',
                                            marginBottom: '10px'
                                        }}>
                                            {products.length === 0 ? "Không có sản phẩm nào" : "Không tìm thấy sản phẩm phù hợp"}
                                        </h2>
                                        <p style={{
                                            fontSize: '1rem',
                                            color: '#9e9e9e',
                                            maxWidth: '500px',
                                            lineHeight: '1.5'
                                        }}>
                                            {products.length === 0 
                                                ? "Hiện tại không có sản phẩm nào trong hệ thống. Vui lòng quay lại sau." 
                                                : "Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác để tìm sản phẩm phù hợp."}
                                        </p>
                                        {Object.keys(activeFilters).length > 0 && (
                                            <button 
                                                style={{
                                                    marginTop: '20px',
                                                    padding: '10px 20px',
                                                    backgroundColor: '#f5f5f5',
                                                    border: 'none',
                                                    borderRadius: '20px',
                                                    color: '#616161',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => handleFilterChange({})}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = '#eeeeee';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = '#f5f5f5';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <i className="fas fa-times-circle"></i>
                                                Xóa tất cả bộ lọc
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    currentProducts.map((product) => {
                                        const {id, brand, name, price, productAvailable} = product;
                                        return (
                                            <div
                                                className="card mb-3"
                                                style={{
                                                    width: "100%",
                                                    height: "450px", // Tăng chiều cao để đảm bảo nút hiển thị đầy đủ
                                                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                                    borderRadius: "12px",
                                                    overflow: "visible", // Thay đổi từ "hidden" thành "visible" để nút không bị cắt
                                                    backgroundColor: productAvailable ? "#fff" : "#f0f0f0",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'stretch',
                                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                    border: "1px solid #f0f0f0",
                                                    position: "relative",
                                                    marginBottom: "15px" // Thêm margin-bottom để tránh các thẻ chồng lên nhau
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-5px)";
                                                    e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.15)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
                                                }}
                                                key={id}
                                            >
                                                <Link
                                                    to={`/product/${id}`}
                                                    style={{
                                                        textDecoration: "none", 
                                                        color: "inherit",
                                                        display: "block",
                                                        height: "calc(100% - 60px)" // Để lại không gian cho nút Add to Cart
                                                    }}
                                                >
                                                    <div style={{
                                                        position: "relative",
                                                        overflow: "hidden",
                                                        height: "180px", // Giảm chiều cao một chút để đồng nhất
                                                        backgroundColor: "#f9f9f9",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderBottom: "1px solid #f0f0f0"
                                                    }}>
                                                        <img
                                                            src={`/images/${product.imageName}`}
                                                            alt={name}
                                                            style={{
                                                                width: "auto", // Thay đổi từ 100% thành auto
                                                                height: "auto", // Thay đổi từ 100% thành auto
                                                                maxWidth: "90%", // Thêm maxWidth để đảm bảo hình ảnh không quá to
                                                                maxHeight: "90%", // Thêm maxHeight để đảm bảo hình ảnh không quá to
                                                                objectFit: "contain", // Thay đổi từ cover thành contain để hình ảnh hiển thị đầy đủ
                                                                padding: "10px", // Thêm padding để tạo khoảng cách với viền
                                                                margin: "0",
                                                                transition: "transform 0.5s ease",
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.target.style.transform = "scale(1.05)";
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.transform = "scale(1)";
                                                            }}
                                                        />
                                                        {product.discountPercent > 0 && (
                                                            <div style={{
                                                                position: "absolute",
                                                                top: "10px",
                                                                left: "10px",
                                                                backgroundColor: "#e53935",
                                                                color: "white",
                                                                padding: "5px 10px",
                                                                borderRadius: "4px",
                                                                fontWeight: "bold",
                                                                fontSize: "14px",
                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                                zIndex: 1
                                                            }}>
                                                                -{product.discountPercent}%
                                                            </div>
                                                        )}
                                                        {product.isHot && (
                                                            <div style={{
                                                                position: "absolute",
                                                                top: product.discountPercent > 0 ? "50px" : "10px",
                                                                left: "10px",
                                                                backgroundColor: "#ff9800",
                                                                color: "white",
                                                                padding: "5px 10px",
                                                                borderRadius: "4px",
                                                                fontWeight: "bold",
                                                                fontSize: "14px",
                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                                zIndex: 1
                                                            }}>
                                                                HOT
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className="card-body"
                                                        style={{
                                                            flexGrow: 1,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "space-between",
                                                            padding: "12px",
                                                            height: "calc(100% - 180px)" // Đảm bảo chiều cao cố định dựa trên chiều cao hình ảnh
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "flex-start",
                                                                marginBottom: "8px"
                                                            }}>
                                                                <span style={{
                                                                    fontSize: "0.8rem",
                                                                    color: "#666",
                                                                    backgroundColor: "#f0f0f0",
                                                                    padding: "3px 8px",
                                                                    borderRadius: "4px",
                                                                    display: "inline-block"
                                                                }}>
                                                                    {product.category}
                                                                </span>
                                                                <span style={{
                                                                    fontSize: "0.8rem",
                                                                    color: "#666",
                                                                    fontWeight: "500"
                                                                }}>
                                                                    {brand}
                                                                </span>
                                                            </div>
                                                            <h5 className="card-title"
                                                                style={{
                                                                    margin: "8px 0",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "600",
                                                                    lineHeight: "1.3",
                                                                    height: "2.6rem",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    display: "-webkit-box",
                                                                    WebkitLineClamp: "2",
                                                                    WebkitBoxOrient: "vertical"
                                                                }}>
                                                                {name}
                                                            </h5>
                                                        </div>
                                                        <div style={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "4px",
                                                            margin: "5px 0"
                                                        }}>
                                                            {product.freeShipping && (
                                                                <span style={{
                                                                    fontSize: "0.75rem",
                                                                    color: "#2e7d32",
                                                                    backgroundColor: "#e8f5e9",
                                                                    padding: "2px 8px",
                                                                    borderRadius: "4px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "4px"
                                                                }}>
                                                                    <i className="fas fa-truck" style={{fontSize: "0.7rem"}}></i>
                                                                    Free Ship
                                                                </span>
                                                            )}
                                                            {product.promoCode && (
                                                                <span style={{
                                                                    fontSize: "0.75rem",
                                                                    color: "#6a1b9a",
                                                                    backgroundColor: "#f3e5f5",
                                                                    padding: "2px 8px",
                                                                    borderRadius: "4px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "4px"
                                                                }}>
                                                                    <i className="fas fa-tag" style={{fontSize: "0.7rem"}}></i>
                                                                    Mã giảm
                                                                </span>
                                                            )}
                                                        </div>
                                                        <hr className="hr-line" style={{
                                                            margin: "5px 0",
                                                            border: "none",
                                                            height: "1px",
                                                            backgroundColor: "#f0f0f0"
                                                        }}/>
                                                        <div className="home-cart-price">
                                                            <div style={{ 
                                                                display: "flex", 
                                                                alignItems: "flex-end", 
                                                                justifyContent: "space-between",
                                                                marginBottom: "10px"
                                                            }}>
                                                                <div style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "flex-start",
                                                                    gap: "3px"
                                                                }}>
                                                                    {product.originalPrice ? (
                                                                        <>
                                                                            <div style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: "8px"
                                                                            }}>
                                                                                <span style={{ 
                                                                                    fontWeight: "700",
                                                                                    fontSize: "1.2rem",
                                                                                    color: "#e53935"
                                                                                }}>
                                                                                    {parseInt(price).toLocaleString('vi-VN')}
                                                                                    <span style={{fontSize: "0.9rem"}}>₫</span>
                                                                                </span>
                                                                            </div>
                                                                            <span style={{ 
                                                                                textDecoration: "line-through", 
                                                                                color: "#757575", 
                                                                                fontSize: "0.85rem" 
                                                                            }}>
                                                                                {parseInt(product.originalPrice).toLocaleString('vi-VN')}₫
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span style={{
                                                                            fontWeight: "700",
                                                                            fontSize: "1.2rem",
                                                                            color: "#212121"
                                                                        }}>
                                                                            {parseInt(price).toLocaleString('vi-VN')}
                                                                            <span style={{fontSize: "0.9rem"}}>₫</span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "5px"
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: "0.75rem",
                                                                        color: "#757575"
                                                                    }}>
                                                                        <i className="fas fa-eye" style={{marginRight: "3px"}}></i>
                                                                        {product.viewCount || 0}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                                
                                                {/* Buttons outside of Link to prevent navigation when clicking */}
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "0 12px 12px",
                                                    marginTop: "auto"
                                                }}>
                                                                <button
                                                                    className="add-to-cart-btn"
                                                                    style={{
                                                                        flex: "1",
                                                                        background: productAvailable 
                                                                            ? "linear-gradient(45deg, #ff4081 0%, #ff7043 100%)" 
                                                                            : "linear-gradient(45deg, #9e9e9e 0%, #bdbdbd 100%)",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "30px",
                                                                        padding: "10px 15px",
                                                                        fontSize: "0.9rem",
                                                                        fontWeight: "600",
                                                                        cursor: productAvailable ? "pointer" : "not-allowed",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        gap: "8px",
                                                                        transition: "all 0.3s ease",
                                                                        boxShadow: productAvailable 
                                                                            ? "0 4px 10px rgba(255, 64, 129, 0.3)" 
                                                                            : "0 4px 10px rgba(0, 0, 0, 0.1)",
                                                                        position: "relative",
                                                                        overflow: "hidden"
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (productAvailable) {
                                                                            // Hiệu ứng gợn sóng khi click
                                                                            const button = e.currentTarget;
                                                                            const circle = document.createElement('span');
                                                                            const diameter = Math.max(button.clientWidth, button.clientHeight);
                                                                            
                                                                            circle.style.width = circle.style.height = `${diameter}px`;
                                                                            circle.style.left = `${e.clientX - button.getBoundingClientRect().left - diameter/2}px`;
                                                                            circle.style.top = `${e.clientY - button.getBoundingClientRect().top - diameter/2}px`;
                                                                            circle.style.position = 'absolute';
                                                                            circle.style.borderRadius = '50%';
                                                                            circle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                                                            circle.style.transform = 'scale(0)';
                                                                            circle.style.animation = 'ripple 0.6s linear';
                                                                            
                                                                            button.appendChild(circle);
                                                                            
                                                                            setTimeout(() => {
                                                                                circle.remove();
                                                                                addToCart(product);
                                                                                // Hiển thị thông báo thành công
                                                                                toast.showSuccess(`Đã thêm "${product.name}" vào giỏ hàng`);
                                                                            }, 300);
                                                                        }
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        if (productAvailable) {
                                                                            e.currentTarget.style.transform = "translateY(-2px)";
                                                                            e.currentTarget.style.boxShadow = "0 6px 15px rgba(255, 64, 129, 0.4)";
                                                                        }
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        if (productAvailable) {
                                                                            e.currentTarget.style.transform = "translateY(0)";
                                                                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(255, 64, 129, 0.3)";
                                                                        }
                                                                    }}
                                                                    disabled={!productAvailable}
                                                                >
                                                                    <i className="fas fa-shopping-cart" style={{fontSize: "0.9rem"}}></i>
                                                                    {productAvailable ? "Thêm vào giỏ" : "Hết hàng"}
                                                                </button>
                                                                
                                                                <Link 
                                                                    to={`/product/${id}`}
                                                                    className="view-details-btn"
                                                                    style={{
                                                                        backgroundColor: "transparent",
                                                                        color: "#757575",
                                                                        border: "2px solid #e0e0e0",
                                                                        borderRadius: "30px",
                                                                        padding: "10px 12px",
                                                                        fontSize: "0.9rem",
                                                                        cursor: "pointer",
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        transition: "all 0.3s ease",
                                                                        boxShadow: "none",
                                                                        textDecoration: "none"
                                                                    }}
                                                                    onMouseOver={(e) => {
                                                                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                                                                        e.currentTarget.style.borderColor = "#bdbdbd";
                                                                        e.currentTarget.style.color = "#424242";
                                                                        e.currentTarget.style.transform = "translateY(-2px)";
                                                                    }}
                                                                    onMouseOut={(e) => {
                                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                                        e.currentTarget.style.borderColor = "#e0e0e0";
                                                                        e.currentTarget.style.color = "#757575";
                                                                        e.currentTarget.style.transform = "translateY(0)";
                                                                    }}
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </Link>
                                                            </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            {renderPagination()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;