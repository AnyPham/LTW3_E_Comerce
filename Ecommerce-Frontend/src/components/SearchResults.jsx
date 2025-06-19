import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from '../axios';
import './styles/SearchResults.css';
import { FaSearch, FaFilter, FaShoppingCart, FaEye, FaHeart, FaTag, FaFire, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { BiReset, BiFilterAlt, BiSortAlt2 } from 'react-icons/bi';
import { BsGrid3X3Gap, BsListUl } from 'react-icons/bs';
import Navbar from './Navbar';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/search?keyword=${query}`);
        setProducts(response.data);
        
        // Lấy danh sách các danh mục và thương hiệu duy nhất từ kết quả
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        const uniqueBrands = [...new Set(response.data.map(product => product.brand))];
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query]);
  
  // Lọc và sắp xếp sản phẩm
  const filteredProducts = products
    .filter(product => {
      let matchesCategory = true;
      let matchesBrand = true;
      let matchesPrice = true;
      
      if (filters.category && product.category !== filters.category) {
        matchesCategory = false;
      }
      
      if (filters.brand && product.brand !== filters.brand) {
        matchesBrand = false;
      }
      
      if (filters.minPrice && product.price < parseInt(filters.minPrice)) {
        matchesPrice = false;
      }
      
      if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) {
        matchesPrice = false;
      }
      
      return matchesCategory && matchesBrand && matchesPrice;
    })
    .sort((a, b) => {
      const sortField = filters.sortBy;
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      
      if (sortField === 'price') {
        return (a.price - b.price) * sortOrder;
      } else if (sortField === 'name') {
        return a.name.localeCompare(b.name) * sortOrder;
      } else if (sortField === 'releaseDate') {
        return (new Date(a.releaseDate) - new Date(b.releaseDate)) * sortOrder;
      }
      
      return 0;
    });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };
  
  // Format giá tiền
  const formatPrice = (price) => {
    return parseInt(price).toLocaleString('vi-VN') + '₫';
  };

  // Tạo rating stars
  const renderRatingStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-warning" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-warning" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-muted opacity-25" />);
    }
    
    return stars;
  };
  
  return (
    <>
      <div className="search-results-page container-fluid mt-5 pt-5">
        <div className="container">
          <div className="search-header mb-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Tìm kiếm</li>
              </ol>
            </nav>
            
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="search-title">
                <FaSearch className="me-2" />
                Kết quả tìm kiếm cho: <span className="text-primary">"{query}"</span>
              </h2>
              <div className="results-summary">
                <span className="badge bg-primary rounded-pill">
                  {filteredProducts.length} sản phẩm
                </span>
              </div>
            </div>
          </div>
          
          <div className="row">
            {/* Sidebar lọc */}
            <div className={`${showFilters ? 'col-lg-3' : 'd-none'} mb-4`}>
              <div className="filter-sidebar p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="filter-title"><FaFilter className="me-2" /> Bộ lọc</h4>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={resetFilters}
                    title="Đặt lại bộ lọc"
                  >
                    <BiReset />
                  </button>
                </div>
                <hr />
                
                <div className="filter-section mb-4">
                  <h5 className="filter-section-title">Danh mục</h5>
                  <select 
                    className="form-select custom-select" 
                    name="category" 
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-section mb-4">
                  <h5 className="filter-section-title">Thương hiệu</h5>
                  <select 
                    className="form-select custom-select" 
                    name="brand" 
                    value={filters.brand}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-section mb-4">
                  <h5 className="filter-section-title">Khoảng giá</h5>
                  <div className="price-range">
                    <input 
                      type="number" 
                      className="form-control mb-2" 
                      name="minPrice" 
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Giá thấp nhất"
                    />
                    <div className="text-center mb-2">đến</div>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="maxPrice" 
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Giá cao nhất"
                    />
                  </div>
                </div>
                
                <div className="filter-section mb-4">
                  <h5 className="filter-section-title d-flex align-items-center">
                    <BiSortAlt2 className="me-2" /> Sắp xếp theo
                  </h5>
                  <select 
                    className="form-select custom-select mb-2" 
                    name="sortBy" 
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                  >
                    <option value="name">Tên sản phẩm</option>
                    <option value="price">Giá</option>
                    <option value="releaseDate">Ngày phát hành</option>
                  </select>
                  
                  <select 
                    className="form-select custom-select" 
                    name="sortOrder" 
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                  >
                    <option value="asc">Tăng dần</option>
                    <option value="desc">Giảm dần</option>
                  </select>
                </div>
                
                <button 
                  className="btn btn-primary w-100 reset-btn"
                  onClick={resetFilters}
                >
                  <BiReset className="me-2" /> Đặt lại bộ lọc
                </button>
              </div>
            </div>
            
            {/* Kết quả tìm kiếm */}
            <div className={`${showFilters ? 'col-lg-9' : 'col-12'}`}>
              {loading ? (
                <div className="spinner-container">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p>Đang tìm kiếm sản phẩm...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="search-toolbar p-3 mb-4 bg-white rounded shadow-sm">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2 d-md-none"
                            onClick={() => setShowFilters(!showFilters)}
                          >
                            <BiFilterAlt /> {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                          </button>
                          <span className="text-muted">Hiển thị {filteredProducts.length} / {products.length} sản phẩm</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                          <div className="view-options me-3">
                            <button 
                              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'} me-1`}
                              onClick={() => setViewMode('grid')}
                              title="Xem dạng lưới"
                            >
                              <BsGrid3X3Gap />
                            </button>
                            <button 
                              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                              onClick={() => setViewMode('list')}
                              title="Xem dạng danh sách"
                            >
                              <BsListUl />
                            </button>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="me-2 d-none d-sm-inline">Sắp xếp:</span>
                            <select 
                              className="form-select form-select-sm" 
                              style={{width: "auto"}}
                              name="sortBy" 
                              value={filters.sortBy}
                              onChange={handleFilterChange}
                            >
                              <option value="name">Tên A-Z</option>
                              <option value="price">Giá</option>
                              <option value="releaseDate">Mới nhất</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="row">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                          <div className="card h-100 product-card">
                            <div className="position-relative overflow-hidden">
                              {product.discountPercent > 0 && (
                                <div className="badge bg-danger position-absolute top-0 start-0 m-2 discount-badge">
                                  <FaTag className="me-1" /> -{product.discountPercent}%
                                </div>
                              )}
                              {product.isHot && (
                                <div className="badge bg-warning text-dark position-absolute top-0 end-0 m-2 hot-badge">
                                  <FaFire className="me-1" /> HOT
                                </div>
                              )}
                              <Link to={`/product/${product.id}`}>
                                <img 
                                  src={`/images/${product.imageName}`} 
                                  className="card-img-top" 
                                  alt={product.name}
                                  style={{ height: '200px', objectFit: 'contain', padding: '1rem' }}
                                />
                              </Link>
                              <div className="product-actions">
                                <button className="btn action-btn" title="Xem nhanh">
                                  <FaEye />
                                </button>
                                <button className="btn action-btn" title="Thêm vào giỏ hàng">
                                  <FaShoppingCart />
                                </button>
                                <button className="btn action-btn" title="Thêm vào yêu thích">
                                  <FaHeart />
                                </button>
                              </div>
                            </div>
                            <div className="card-body d-flex flex-column">
                              <div className="d-flex justify-content-between mb-2">
                                <span className="badge bg-secondary category-badge">{product.category}</span>
                                <span className="badge bg-info brand-badge">{product.brand}</span>
                              </div>
                              <h5 className="product-title">
                                <Link to={`/product/${product.id}`} className="product-title-link">
                                  {product.name}
                                </Link>
                              </h5>
                              <div className="product-rating mb-2">
                                {renderRatingStars()}
                                <span className="ms-1 text-muted">(4.5)</span>
                              </div>
                              <p className="product-description">{product.description}</p>
                              <div className="mt-auto">
                                <div className="d-flex align-items-center mb-2">
                                  {product.originalPrice && product.originalPrice > product.price ? (
                                    <span className="text-decoration-line-through me-2 original-price">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                  ) : null}
                                  <span className="fw-bold current-price">{formatPrice(product.price)}</span>
                                </div>
                                <div className="d-flex">
                                  <Link to={`/product/${product.id}`} className="btn btn-primary flex-grow-1 me-2 view-details-btn">
                                    <FaEye className="me-1" /> Chi tiết
                                  </Link>
                                  <button className="btn btn-outline-primary add-to-cart-btn">
                                    <FaShoppingCart />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="row">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="col-12 mb-4">
                          <div className="card product-card-list">
                            <div className="row g-0">
                              <div className="col-md-3 position-relative overflow-hidden">
                                {product.discountPercent > 0 && (
                                  <div className="badge bg-danger position-absolute top-0 start-0 m-2 discount-badge">
                                    <FaTag className="me-1" /> -{product.discountPercent}%
                                  </div>
                                )}
                                {product.isHot && (
                                  <div className="badge bg-warning text-dark position-absolute top-0 end-0 m-2 hot-badge">
                                    <FaFire className="me-1" /> HOT
                                  </div>
                                )}
                                <Link to={`/product/${product.id}`}>
                                  <img 
                                    src={`/images/${product.imageName}`} 
                                    className="img-fluid rounded-start h-100" 
                                    alt={product.name}
                                    style={{ objectFit: 'contain', padding: '1rem', maxHeight: '250px', width: '100%' }}
                                  />
                                </Link>
                              </div>
                              <div className="col-md-9">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between mb-2">
                                    <div>
                                      <span className="badge bg-secondary category-badge me-2">{product.category}</span>
                                      <span className="badge bg-info brand-badge">{product.brand}</span>
                                    </div>
                                    <div className="product-rating">
                                      {renderRatingStars()}
                                      <span className="ms-1 text-muted">(4.5)</span>
                                    </div>
                                  </div>
                                  <h5 className="product-title product-title-list">
                                    <Link to={`/product/${product.id}`} className="product-title-link">
                                      {product.name}
                                    </Link>
                                  </h5>
                                  <p className="product-description">{product.description}</p>
                                  <div className="row align-items-center mt-3">
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center">
                                        {product.originalPrice && product.originalPrice > product.price ? (
                                          <span className="text-decoration-line-through me-2 original-price">
                                            {formatPrice(product.originalPrice)}
                                          </span>
                                        ) : null}
                                        <span className="fw-bold current-price">{formatPrice(product.price)}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-6 mt-3 mt-md-0">
                                      <div className="d-flex">
                                        <Link to={`/product/${product.id}`} className="btn btn-primary flex-grow-1 me-2 view-details-btn">
                                          <FaEye className="me-1" /> Chi tiết
                                        </Link>
                                        <button className="btn btn-outline-primary add-to-cart-btn">
                                          <FaShoppingCart />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results-container">
                  <div className="text-center">
                    <i className="bi bi-search display-1 text-muted mb-3"></i>
                    <h4>Không tìm thấy sản phẩm nào phù hợp</h4>
                    <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}"</p>
                    <p>Vui lòng thử lại với từ khóa khác hoặc xem các sản phẩm khác của chúng tôi</p>
                    <Link to="/" className="btn btn-primary mt-3">
                      Quay lại trang chủ
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;