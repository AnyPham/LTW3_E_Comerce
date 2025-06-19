import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import Home from "./Home"
import axios from "axios"
import "./styles/SearchResults.css"
// import { json } from "react-router-dom";
// import { BiSunFill, BiMoon } from "react-icons/bi";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    fetchData();

    // Kiểm tra trạng thái đăng nhập
    const isLoggedInStorage = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (isLoggedInStorage === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    // Xử lý click bên ngoài để đóng dropdown kết quả tìm kiếm
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        // Thêm debounce để tránh gọi API quá nhiều lần
        if (window.searchTimeout) {
          clearTimeout(window.searchTimeout);
        }

        window.searchTimeout = setTimeout(async () => {
          const response = await axios.get(
              `http://localhost:8080/api/products/search?keyword=${value}`
          );
          setSearchResults(response.data);
          setNoResults(response.data.length === 0);
        }, 300); // Đợi 300ms trước khi gửi request
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };


  // const handleChange = async (value) => {
  //   setInput(value);
  //   if (value.length >= 1) {
  //     setShowSearchResults(true);
  //     try {
  //       let response;
  //       if (!isNaN(value)) {
  //         // Input is a number, search by ID
  //         response = await axios.get(`http://localhost:8080/api/products/search?id=${value}`);
  //       } else {
  //         // Input is not a number, search by keyword
  //         response = await axios.get(`http://localhost:8080/api/products/search?keyword=${value}`);
  //       }

  //       const results = response.data;
  //       setSearchResults(results);
  //       setNoResults(results.length === 0);
  //       console.log(results);
  //     } catch (error) {
  //       console.error("Error searching:", error.response ? error.response.data : error.message);
  //     }
  //   } else {
  //     setShowSearchResults(false);
  //     setSearchResults([]);
  //     setNoResults(false);
  //   }
  // };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUsername('');
    window.location.reload();
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "PC",
    "Màn hình",
    "Build PC",
    "Linh kiện máy tính",
    "Máy in",
  ];
  return (
      <>
        <header>
          <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">
                Laptop Shop
              </a>
              <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/">
                      Home
                    </a>
                  </li>
                  {/* <li className="nav-item">
                  <a className="nav-link" href="/add_product">
                    Add Product
                  </a>
                </li> */}
                  <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="/"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      Categories
                    </a>

                    <ul className="dropdown-menu">
                      {categories.map((category) => (
                          <li key={category}>
                            <button
                                className="dropdown-item"
                                onClick={() => handleCategorySelect(category)}
                            >
                              {category}
                            </button>
                          </li>
                      ))}
                    </ul>
                  </li>

                  <li className="nav-item"></li>
                </ul>
                <button className="theme-btn" onClick={() => toggleTheme()}>
                  {theme === "dark-theme" ? (
                      <i className="bi bi-moon-fill"></i>
                  ) : (
                      <i className="bi bi-sun-fill"></i>
                  )}
                </button>
                <div className="d-flex align-items-center cart">
                  <a href="/cart" className="nav-link text-dark">
                    <i
                        className="bi bi-cart me-2"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                      Cart
                    </i>
                  </a>
                  {/* <form className="d-flex" role="search" onSubmit={handleSearch} id="searchForm"> */}
                  <div className="search-container position-relative" ref={searchRef}>
                    <div className="input-group">
                      <input
                          className="form-control"
                          type="search"
                          placeholder="Tìm kiếm sản phẩm..."
                          aria-label="Search"
                          value={input}
                          onChange={(e) => handleChange(e.target.value)}
                          style={{ height: '38px' }}
                          onFocus={() => {
                            setSearchFocused(true);
                            if (input.length >= 1) {
                              setShowSearchResults(true);
                            }
                          }}
                      />
                      <button
                          className="btn btn-outline-secondary"
                          type="button"
                          style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => {
                            if (input.length > 0) {
                              window.location.href = `/search?q=${input}`;
                            }
                          }}
                      >
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                    {showSearchResults && (
                        <ul className="list-group search-results-dropdown">
                          {searchResults.length > 0 ? (
                              searchResults.map((result) => (
                                  <li key={result.id} className="list-group-item search-result-item">
                                    <a href={`/product/${result.id}`} className="search-result-link">
                                      <div className="search-result-content">
                                        {result.imageName && (
                                            <img
                                                src={`/images/${result.imageName}`}
                                                alt={result.name}
                                                className="search-result-image"
                                                style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'contain' }}
                                            />
                                        )}
                                        <div className="search-result-info">
                                          <span className="search-result-name">{result.name}</span>
                                          <span className="search-result-price">{parseInt(result.price).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                              ))
                          ) : (
                              noResults && (
                                  <li className="list-group-item no-results-message">
                                    Không tìm thấy sản phẩm phù hợp
                                  </li>
                              )
                          )}
                        </ul>
                    )}
                  </div>
                  {isLoggedIn ? (
                      <div className="dropdown">
                        <button
                            className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                          <i className="bi bi-person-circle me-1"></i> {username}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="userDropdown">
                          <li><Link className="dropdown-item" to="/user"><i className="bi bi-person me-2"></i>Tài khoản</Link></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</button></li>
                        </ul>
                      </div>
                  ) : (
                      <>
                        <Link to="/login" className="btn btn-outline-primary btn-sm me-2 d-flex align-items-center">
                          <i className="bi bi-person me-1"></i> Đăng nhập
                        </Link>
                        <Link to="/register" className="btn btn-outline-success btn-sm d-flex align-items-center">
                          <i className="bi bi-person-plus me-1"></i> Đăng ký
                        </Link>
                      </>
                  )}
                  {/* <button
                  className="btn btn-outline-success"
                  onClick={handleSearch}
                >
                  Search Products
                </button> */}
                  {/* </form> */}
                  <div />
                </div>
              </div>
            </div>
          </nav>
        </header>
      </>
  );
};

export default Navbar;
