import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };
  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }
  return (
    <div className="product-details-container" style={{ 
      maxWidth: "1200px", 
      margin: "80px auto 30px",
      padding: "0 20px"
    }}>
      <div className="row" style={{ 
        display: "flex", 
        flexWrap: "wrap",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "var(--card-bg)",
        boxShadow: "var(--card-shadow)"
      }}>
        {/* Product Image Column */}
        <div className="col-md-6" style={{ padding: "0" }}>
          <div className="product-image-container" style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "30px",
            backgroundColor: "var(--background-secondary)",
            position: "relative"
          }}>
            {product.discountPercent > 0 && (
              <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                backgroundColor: "var(--error-color)",
                color: "black",
                padding: "8px 16px",
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: "1rem",
                zIndex: "1",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}>
                -{product.discountPercent}%
              </div>
            )}
            
            {product.isHot && (
              <div style={{
                position: "absolute",
                top: product.discountPercent > 0 ? "70px" : "20px",
                left: "20px",
                backgroundColor: "var(--warning-color)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: "1rem",
                zIndex: "1",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}>
                HOT
              </div>
            )}
            
            <img
              className="product-image"
              src={`/images/${product.imageName}`}
              alt={product.name}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
                transition: "transform 0.5s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>
        </div>
        
        {/* Product Info Column */}
        <div className="col-md-6" style={{ padding: "40px" }}>
          <div className="product-info">
            {/* Category and Release Date */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <span style={{ 
                fontSize: "1rem", 
                color: "var(--accent-primary)",
                backgroundColor: "var(--accent-secondary)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "500"
              }}>
                {product.category}
              </span>
              <span style={{ 
                fontSize: "0.9rem", 
                color: "var(--text-secondary)"
              }}>
                Ngày đăng: {new Date(product.releaseDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
            
            {/* Product Name and Brand */}
            <h1 style={{ 
              fontSize: "2.2rem", 
              fontWeight: "700",
              marginBottom: "10px",
              color: "var(--text-primary)",
              textTransform: "capitalize",
              letterSpacing: "0.5px"
            }}>
              {product.name}
            </h1>
            
            <div style={{ 
              fontSize: "1.1rem", 
              color: "var(--text-secondary)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fas fa-building"></i> {product.brand}
            </div>
            
            {/* Price Section */}
            <div className="product-price" style={{ marginBottom: "25px" }}>
              {product.originalPrice ? (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "15px"
                }}>
                  <span style={{ 
                    fontSize: "2.5rem", 
                    fontWeight: "700",
                    color: "var(--error-color)"
                  }}>
                    {parseInt(product.price).toLocaleString('vi-VN')}<span style={{ fontSize: "1.8rem" }}>₫</span>
                  </span>
                  <span style={{ 
                    textDecoration: "line-through", 
                    color: "var(--text-tertiary)", 
                    fontSize: "1.5rem" 
                  }}>
                    {parseInt(product.originalPrice).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ) : (
                <span style={{ 
                  fontSize: "2.5rem", 
                  fontWeight: "700",
                  color: "var(--accent-primary)"
                }}>
                  {parseInt(product.price).toLocaleString('vi-VN')}<span style={{ fontSize: "1.8rem" }}>₫</span>
                </span>
              )}
            </div>
            
            {/* Promotion Badges */}
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "10px", 
              marginBottom: "25px" 
            }}>
              {product.freeShipping && (
                <span style={{ 
                  backgroundColor: "var(--success-color)", 
                  color: "white", 
                  padding: "8px 15px", 
                  borderRadius: "30px", 
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <i className="fas fa-truck"></i> Miễn phí vận chuyển
                </span>
              )}
              
              {product.promoCode && (
                <span style={{ 
                  backgroundColor: "var(--info-color)", 
                  color: "white", 
                  padding: "8px 15px", 
                  borderRadius: "30px", 
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <i className="fas fa-tag"></i> Mã giảm giá: {product.promoCode}
                </span>
              )}
              
              {product.promoEndDate && new Date(product.promoEndDate) > new Date() && (
                <span style={{ 
                  backgroundColor: "var(--warning-color)", 
                  color: "white", 
                  padding: "8px 15px", 
                  borderRadius: "30px", 
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <i className="fas fa-clock"></i> Kết thúc: {new Date(product.promoEndDate).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
            
            {/* Stock Information */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              marginBottom: "25px",
              padding: "10px 15px",
              backgroundColor: product.productAvailable ? "var(--success-color)" : "var(--error-color)",
              color: "white",
              borderRadius: "8px",
              width: "fit-content"
            }}>
              <i className={product.productAvailable ? "fas fa-check-circle" : "fas fa-times-circle"}></i>
              <span>
                {product.productAvailable 
                  ? `Còn hàng (${product.stockQuantity})` 
                  : "Hết hàng"}
              </span>
            </div>
            
            {/* Product Description */}
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ 
                fontSize: "1.2rem", 
                fontWeight: "600",
                marginBottom: "15px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <i className="fas fa-info-circle"></i> Mô tả sản phẩm
              </h3>
              <p style={{ 
                fontSize: "1rem", 
                lineHeight: "1.6",
                color: "var(--text-secondary)"
              }}>
                {product.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button
                className="add-to-cart-btn"
                onClick={handlAddToCart}
                disabled={!product.productAvailable}
                style={{
                  flex: "1",
                  background: product.productAvailable 
                    ? "var(--button-primary-bg)" 
                    : "linear-gradient(45deg, #9e9e9e 0%, #bdbdbd 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  padding: "15px 25px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: product.productAvailable ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: product.productAvailable 
                    ? "var(--button-primary-shadow)" 
                    : "0 4px 10px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e) => {
                  if (product.productAvailable) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(255, 64, 129, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  if (product.productAvailable) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(255, 64, 129, 0.3)";
                  }
                }}
              >
                <i className="fas fa-shopping-cart"></i>
                {product.productAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </button>
              
              <div className="admin-actions" style={{ display: "flex", gap: "10px" }}>
                {/* <button
                  onClick={handleEditClick}
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    padding: "15px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(25, 118, 210, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(25, 118, 210, 0.3)";
                  }}
                  title="Cập nhật sản phẩm"
                >
                  <i className="fas fa-edit"></i>
                </button>
                
                <button
                  onClick={deleteProduct}
                  style={{
                    backgroundColor: "var(--error-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "30px",
                    padding: "15px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 10px rgba(198, 40, 40, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(198, 40, 40, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(198, 40, 40, 0.3)";
                  }}
                  title="Xóa sản phẩm"
                >
                  <i className="fas fa-trash-alt"></i>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products Section could be added here */}
    </div>
  );
};

export default Product;