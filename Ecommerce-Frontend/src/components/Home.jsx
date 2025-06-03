import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import Sidebar from "../components/Sidebar";
import Footer from '../components/Footer'

const Home = ({ selectedCategory }) => {
    const { data, isError, addToCart, refreshData } = useContext(AppContext);
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
                case 'discount':
                    // Assuming products with discounts have a discount field or originalPrice
                    result = result.filter((product) => product.discount || product.originalPrice);
                    break;
                case 'free-ship':
                    // Assuming products with free shipping have a freeShipping field
                    result = result.filter((product) => product.freeShipping);
                    break;
                case 'hot':
                    // Assuming hot products have an isHot field or high view count
                    result = result.filter((product) => product.isHot || (product.viewCount && product.viewCount > 100));
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
            padding: '8px 12px',
            margin: '0 2px',
            border: '1px solid #dee2e6',
            backgroundColor: '#fff',
            color: '#007bff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            minWidth: '40px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const activeButtonStyle = {
            ...buttonStyle,
            border: '2px solid #007bff',
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 'bold'
        };

        const disabledButtonStyle = {
            ...buttonStyle,
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
            cursor: 'not-allowed',
            opacity: 0.6
        };

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px 0',
                gap: '5px'
            }}>
                {/* Previous Button */}
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
                    onMouseEnter={(e) => {
                        if (currentPage !== 1) {
                            e.target.style.backgroundColor = '#e7f3ff';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage !== 1) {
                            e.target.style.backgroundColor = '#fff';
                        }
                    }}
                    title="Trang trước"
                >
                    ← Trước
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((number, index) => (
                    number === '...' ? (
                        <span key={index} style={{
                            padding: '8px 12px',
                            color: '#6c757d'
                        }}>...</span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => handlePageChange(number)}
                            style={currentPage === number ? activeButtonStyle : buttonStyle}
                            onMouseEnter={(e) => {
                                if (currentPage !== number) {
                                    e.target.style.backgroundColor = '#e7f3ff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentPage !== number) {
                                    e.target.style.backgroundColor = '#fff';
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
                            e.target.style.backgroundColor = '#e7f3ff';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage !== totalPages) {
                            e.target.style.backgroundColor = '#fff';
                        }
                    }}
                    title="Trang sau"
                >
                    Tiếp →
                </button>

                {/* Page Info */}
                <span style={{
                    marginLeft: '15px',
                    color: '#6c757d',
                    fontSize: '14px'
                }}>
                    Trang {currentPage}/{totalPages}
                </span>
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
                        {/* Filter and Sort Display Bar - Outside of grid */}
                        {(Object.keys(activeFilters).length > 0 || sortType) && (
                            <div style={{
                                padding: '10px 20px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                margin: '25px 20px 15px 20px',
                                border: '1px solid #e9ecef',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    alignItems: 'center',
                                    fontSize: '13px'
                                }}>
                                    <span style={{
                                        fontWeight: '500',
                                        color: '#495057',
                                        marginRight: '5px'
                                    }}>
                                        Đang áp dụng:
                                    </span>
                                    {sortType && (
                                        <span style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '500'
                                        }}>
                                            Sắp xếp: {
                                            sortType === 'highToLow' ? 'Giá Cao - Thấp' :
                                                sortType === 'lowToHigh' ? 'Giá Thấp - Cao' :
                                                    sortType === 'discount' ? 'Khuyến Mãi Hot' :
                                                        sortType === 'viewed' ? 'Xem nhiều' : sortType
                                        }
                                        </span>
                                    )}
                                    {Object.entries(activeFilters).map(([key, value]) => (
                                        <span key={key} style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '500'
                                        }}>
                                            {key === 'price' ? (
                                                value === '0-500' ? 'Dưới 500k' :
                                                    value === '500-1000' ? '500k - 1tr' :
                                                        value === '1000-5000' ? '1tr - 5tr' :
                                                            value === '5000+' ? 'Trên 5tr' : value
                                            ) : key === 'promo' ? (
                                                value === 'discount' ? 'Giảm giá' :
                                                    value === 'free-ship' ? 'Free ship' :
                                                        value === 'hot' ? 'Hot' : value
                                            ) : value}
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
                                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "20px",
                                    paddingTop: "20px",
                                }}
                            >
                                {currentProducts.length === 0 ? (
                                    <h2 className="text-center"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gridColumn: '1 / -1',
                                            height: '200px'
                                        }}>
                                        {products.length === 0 ? "No Products Available" : "Không tìm thấy sản phẩm phù hợp"}
                                    </h2>
                                ) : (
                                    currentProducts.map((product) => {
                                        const {id, brand, name, price, productAvailable} = product;
                                        return (
                                            <div
                                                className="card mb-3"
                                                style={{
                                                    width: "265px",
                                                    height: "390px",
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                    borderRadius: "10px",
                                                    overflow: "hidden",
                                                    backgroundColor: productAvailable ? "#fff" : "#ccc",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'stretch'
                                                }}
                                                key={id}
                                            >
                                                <Link
                                                    to={`/product/${id}`}
                                                    style={{textDecoration: "none", color: "inherit"}}
                                                >
                                                    <img
                                                        src={`/images/${product.imageName}`}
                                                        alt={name}
                                                        style={{
                                                            width: "100%",
                                                            height: "150px",
                                                            objectFit: "cover",
                                                            padding: "0px",
                                                            margin: "0",
                                                            borderRadius: "10px 10px 10px 10px",
                                                        }}
                                                    />
                                                    <div
                                                        className="card-body"
                                                        style={{
                                                            flexGrow: 1,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "space-between",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        <div>
                                                            <h5 className="card-title"
                                                                style={{margin: "0 0 10px 0", fontSize: "1.2rem"}}>
                                                                {name.toUpperCase()}
                                                            </h5>
                                                            <i className="card-brand"
                                                               style={{fontStyle: "italic", fontSize: "0.8rem"}}>
                                                                {"~ " + brand}
                                                            </i>
                                                        </div>
                                                        <hr className="hr-line" style={{margin: "10px 0"}}/>
                                                        <div className="home-cart-price">
                                                            <h5 className="card-text" style={{
                                                                fontWeight: "600",
                                                                fontSize: "1.1rem",
                                                                marginBottom: '5px',
                                                                display: 'flex',
                                                                justifyContent: 'right'
                                                            }}>
                                                                {parseInt(price).toLocaleString('vi-VN')}
                                                                <span>₫</span>
                                                            </h5>
                                                        </div>
                                                        <button
                                                            className="btn-hover color-9"
                                                            style={{margin: '10px 25px 0px '}}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                addToCart(product);
                                                            }}
                                                            disabled={!productAvailable}
                                                        >
                                                            {productAvailable ? "thêm vào giỏ hàng" : "hết hàng"}
                                                        </button>
                                                    </div>
                                                </Link>
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