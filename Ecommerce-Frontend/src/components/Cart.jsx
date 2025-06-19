// import React, { useContext, useState, useEffect } from "react";
// // import axios from '../axios';
// import AppContext from "../Context/Context";
// import axios from "axios";
// import CheckoutPopup from "./CheckoutPopup";
// import { Button } from "react-bootstrap";
// const Cart = () => {
//   const { cart, removeFromCart } = useContext(AppContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [cartImage, setCartImage] =useState([])
//   const [showModal, setShowModal] = useState(false);

//   // useEffect(() => {
//   //   const fetchImagesAndUpdateCart = async () => {
//   //     console.log("Cart", cart);
//   //     const updatedCartItems = await Promise.all(
//   //       cart.map(async (item) => {
//   //         console.log("ITEM",item)
//   //         try {
//   //           const response = await axios.get(
//   //             `http://localhost:8080/api/product/${item.id}/image`,
//   //             { responseType: "blob" }
//   //           );
//             // const imageFile = await converUrlToFile(response.data,response.data.imageName)
//   //           setCartImage(imageFile);
//   //           const imageUrl = URL.createObjectURL(response.data);
//   //           return { ...item, imageUrl, available: true };
//   //         } catch (error) {
//   //           console.error("Error fetching image:", error);
//   //           return { ...item, imageUrl: "placeholder-image-url", available: false };
//   //         }
//   //       })
//   //     );
//   //     const filteredCartItems = updatedCartItems.filter((item) => item.available);
//   //     setCartItems(updatedCartItems);

//   //   };

//   //   if (cart.length) {
//   //     fetchImagesAndUpdateCart();
//   //   }
//   // }, [cart]);

//   useEffect(() => {
//     const fetchImagesAndUpdateCart = async () => {
//       try {

//         const response = await axios.get("http://localhost:8080/api/products");
//         const backendProductIds = response.data.map((product) => product.id);

//         const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
//         const cartItemsWithImages = await Promise.all(
//           updatedCartItems.map(async (item) => {
//             try {
//               const response = await axios.get(
//                 `http://localhost:8080/api/product/${item.id}/image`,
//                 { responseType: "blob" }
//               );
//               const imageFile = await converUrlToFile(response.data, response.data.imageName);
//               setCartImage(imageFile)
//               const imageUrl = URL.createObjectURL(response.data);
//               return { ...item, imageUrl };
//             } catch (error) {
//               console.error("Error fetching image:", error);
//               return { ...item, imageUrl: "placeholder-image-url" };
//             }
//           })
//         );

//         setCartItems(cartItemsWithImages);
//       } catch (error) {
//         console.error("Error fetching product data:", error);

//       }
//     };

//     if (cart.length) {
//       fetchImagesAndUpdateCart();
//     }
//   }, [cart]);



//   useEffect(() => {
//     console.log("CartItems", cartItems);
//   }, [cartItems]);
//   const converUrlToFile = async(blobData, fileName) => {
//     const file = new File([blobData], fileName, { type: blobData.type });
//     return file;
//   }
//   useEffect(() => {
//     const total = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     setTotalPrice(total);
//   }, [cartItems]);


//   const handleIncreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCartItems(newCartItems);
//   };
//   const handleDecreaseQuantity = (itemId) => {
//     const newCartItems = cartItems.map((item) =>
//       item.id === itemId
//         ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//         : item
//     );
//     setCartItems(newCartItems);
//   };

//   const handleRemoveFromCart = (itemId) => {
//     removeFromCart(itemId);
//     const newCartItems = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(newCartItems);
//   };

//   const handleCheckout = async () => {
//     try {
//       for (const item of cartItems) {
//         const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
//         const updatedStockQuantity = item.stockQuantity - item.quantity;

//         const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
//         console.log("updated product data", updatedProductData)

//         const cartProduct = new FormData();
//         cartProduct.append("imageFile", cartImage);
//         cartProduct.append(
//           "product",
//           new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
//         );

//         await axios
//           .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((response) => {
//             console.log("Product updated successfully:", (cartProduct));

//           })
//           .catch((error) => {
//             console.error("Error updating product:", error);
//           });
//       }
//       setCartItems([]);
//       setShowModal(false);
//     } catch (error) {
//       console.log("error during checkout", error);
//     }
//   };

//   return (
//     <div className="cart-container">
//       <div className="shopping-cart">
//         <div className="title">Shopping Bag</div>
//         {cartItems.length === 0 ? (
//           <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
//             <h4>Your cart is empty</h4>
//           </div>
//         ) : (
//           <>
//             {cartItems.map((item) => (
//               <li key={item.id} className="cart-item">
//                 <div
//                   className="item"
//                   style={{ display: "flex", alignContent: "center" }}
//                   key={item.id}
//                 >
//                   <div className="buttons">
//                     <div className="buttons-liked">
//                       <i className="bi bi-heart"></i>
//                     </div>
//                   </div>
//                   <div>
//                     <img
//                       // src={cartImage ? URL.createObjectURL(cartImage) : "Image unavailable"}
//                       src={item.imageUrl}
//                       alt={item.name}
//                       className="cart-item-image"
//                     />
//                   </div>
//                   <div className="description">
//                     <span>{item.brand}</span>
//                     <span>{item.name}</span>
//                   </div>

//                   <div className="quantity">
//                     <button
//                       className="plus-btn"
//                       type="button"
//                       name="button"
//                       onClick={() => handleIncreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-plus-square-fill"></i>
//                     </button>
//                     <input
//                       type="button"
//                       name="name"
//                       value={item.quantity}
//                       readOnly
//                     />
//                     <button
//                       className="minus-btn"
//                       type="button"
//                       name="button"
//                       // style={{ backgroundColor: "white" }}
//                       onClick={() => handleDecreaseQuantity(item.id)}
//                     >
//                       <i className="bi bi-dash-square-fill"></i>
//                     </button>
//                   </div>

//                   <div className="total-price " style={{ textAlign: "center" }}>
//                     ${item.price * item.quantity}
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               </li>
//             ))}
//             <div className="total">Total: ${totalPrice}</div>
//             <button
//               className="btn btn-primary"
//               style={{ width: "100%" }}
//               onClick={handleCheckout}
//             >
//               Checkout
//             </button>
//           </>
//         )}
//       </div>
//       <CheckoutPopup
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         handleCheckout={handleCheckout}
//       />
//     </div>

//   );
// };

// export default Cart;





import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';
import { useToast } from './ToastManager';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const toast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      console.log("Cart", cart);
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await converUrlToFile(response.data, response.data.imageName);
              setCartImage(imageFile)
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        console.log("cart",cart)
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };


  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;

        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        console.log("updated product data", updatedProductData)

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios
          .put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Product updated successfully:", (cartProduct));
          })
          .catch((error) => {
            console.error("Error updating product:", error);
          });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
      
      // Hiển thị thông báo thanh toán thành công
      toast.showSuccess("Đã thanh toán thành công! Cảm ơn bạn đã mua hàng.", 5000);
      
      // Chuyển hướng về trang chủ sau 2 giây
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.log("error during checkout", error);
      toast.showError("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.");
    }
  };

  return (
      <div className="cart-container" style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '2rem 1rem',
        marginTop: '64px'
      }}>
        <div className="shopping-cart" style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div className="title" style={{
            background: 'linear-gradient(45deg, #ff4081 0%, #ff7043 100%)',
            color: 'white',
            padding: '1.5rem 2rem',
            fontSize: '1.6rem',
            fontWeight: '600',
            textAlign: 'center',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-shopping-cart" style={{fontSize: '1.4rem'}}></i>
            Giỏ hàng của bạn
          </div>

          {cartItems.length === 0 ? (
              <div className="empty" style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: '#757575',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  color: '#ff4081',
                  opacity: 0.7
                }}>
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <h3 style={{
                  color: '#424242', 
                  fontWeight: '500',
                  marginBottom: '1rem'
                }}>Giỏ hàng của bạn đang trống</h3>
                <p style={{
                  color: '#757575', 
                  marginBottom: '2rem',
                  maxWidth: '400px',
                  lineHeight: '1.6'
                }}>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
                <a href="/" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ff4081',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  boxShadow: '0 4px 10px rgba(255, 64, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f50057';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 15px rgba(255, 64, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#ff4081';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 10px rgba(255, 64, 129, 0.3)';
                }}>
                  <i className="fas fa-shopping-bag"></i>
                  Tiếp tục mua sắm
                </a>
              </div>
          ) : (
              <>
                <div style={{padding: '1.5rem'}}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 0.5rem 1rem',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '1.5rem',
                    color: '#757575',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    <div style={{flex: '2'}}>Sản phẩm</div>
                    <div style={{flex: '1', textAlign: 'center'}}>Đơn giá</div>
                    <div style={{flex: '1', textAlign: 'center'}}>Số lượng</div>
                    <div style={{flex: '1', textAlign: 'center'}}>Thành tiền</div>
                    <div style={{width: '50px'}}></div>
                  </div>
                  
                  {cartItems.map((item, index) => (
                      <div key={item.id} className="cart-item" style={{
                        listStyle: 'none',
                        marginBottom: '1.5rem',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '1.2rem',
                        transition: 'all 0.3s ease',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        position: 'relative'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        e.currentTarget.style.borderColor = '#f0f0f0';
                      }}>
                        <div
                            className="item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: '1.5rem'
                            }}
                        >
                          {/* Sản phẩm */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flex: '2'
                          }}>
                            <div style={{
                              flexShrink: 0,
                              position: 'relative'
                            }}>
                              <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                backgroundColor: '#f9f9f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #f0f0f0'
                              }}>
                                <img
                                    src={`/images/${item.imageName}`}
                                    alt={item.name}
                                    className="cart-item-image"
                                    style={{
                                      maxWidth: '90%',
                                      maxHeight: '90%',
                                      objectFit: 'contain'
                                    }}
                                />
                              </div>
                              {item.discountPercent > 0 && (
                                <div style={{
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  backgroundColor: '#ff4081',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}>
                                  -{item.discountPercent}%
                                </div>
                              )}
                            </div>
                            
                            <div style={{
                              flex: 1,
                              minWidth: 0
                            }}>
                              <div style={{
                                fontSize: '0.85rem',
                                color: '#757575',
                                marginBottom: '0.25rem'
                              }}>{item.brand}</div>
                              <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#212121',
                                marginBottom: '0.5rem',
                                lineHeight: '1.4',
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>{item.name}</div>
                              
                              {/* Badges */}
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '5px'
                              }}>
                                {item.freeShipping && (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    backgroundColor: '#e8f5e9',
                                    color: '#2e7d32',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}>
                                    <i className="fas fa-truck" style={{fontSize: '0.65rem'}}></i>
                                    Free Ship
                                  </span>
                                )}
                                
                                {item.promoCode && (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    backgroundColor: '#f3e5f5',
                                    color: '#6a1b9a',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}>
                                    <i className="fas fa-tag" style={{fontSize: '0.65rem'}}></i>
                                    {item.promoCode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Đơn giá */}
                          <div style={{
                            flex: '1',
                            textAlign: 'center'
                          }}>
                            {item.originalPrice ? (
                              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px'}}>
                                <span style={{
                                  fontWeight: '600',
                                  fontSize: '1rem',
                                  color: '#e53935'
                                }}>
                                  {parseInt(item.price).toLocaleString('vi-VN')}₫
                                </span>
                                <span style={{
                                  textDecoration: 'line-through',
                                  color: '#9e9e9e',
                                  fontSize: '0.85rem'
                                }}>
                                  {parseInt(item.originalPrice).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            ) : (
                              <span style={{
                                fontWeight: '600',
                                fontSize: '1rem',
                                color: '#212121'
                              }}>
                                {parseInt(item.price).toLocaleString('vi-VN')}₫
                              </span>
                            )}
                          </div>

                          {/* Số lượng */}
                          <div style={{
                            flex: '1',
                            display: 'flex',
                            justifyContent: 'center'
                          }}>
                            <div className="quantity" style={{
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: 'white',
                              border: '1px solid #e0e0e0',
                              borderRadius: '30px',
                              overflow: 'hidden',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                              <button
                                  className="minus-btn"
                                  type="button"
                                  onClick={() => handleDecreaseQuantity(item.id)}
                                  style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    padding: '0.5rem 0.7rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    color: '#757575'
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#f5f5f5';
                                    e.target.style.color = '#212121';
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#757575';
                                  }}
                              >
                                <i className="fas fa-minus" style={{fontSize: '0.8rem'}}></i>
                              </button>
                              <input
                                  type="button"
                                  name="name"
                                  value={item.quantity}
                                  readOnly
                                  style={{
                                    border: 'none',
                                    textAlign: 'center',
                                    width: '40px',
                                    padding: '0.5rem 0',
                                    backgroundColor: 'white',
                                    fontWeight: '600',
                                    color: '#212121',
                                    fontSize: '0.95rem'
                                  }}
                              />
                              <button
                                  className="plus-btn"
                                  type="button"
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                  style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    padding: '0.5rem 0.7rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    color: '#757575'
                                  }}
                                  onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#f5f5f5';
                                    e.target.style.color = '#212121';
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#757575';
                                  }}
                              >
                                <i className="fas fa-plus" style={{fontSize: '0.8rem'}}></i>
                              </button>
                            </div>
                          </div>

                          {/* Thành tiền */}
                          <div style={{
                            flex: '1',
                            textAlign: "center",
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            color: '#ff4081'
                          }}>
                            {parseInt(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </div>

                          {/* Nút xóa */}
                          <button
                              className="remove-btn"
                              onClick={() => handleRemoveFromCart(item.id)}
                              style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: '#9e9e9e',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                fontSize: '1.1rem'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#ffebee';
                                e.target.style.color = '#f44336';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#9e9e9e';
                              }}
                              title="Xóa sản phẩm"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                  ))}
                </div>

                <div style={{
                  padding: '1.5rem 2rem',
                  borderTop: '1px solid #f0f0f0',
                  backgroundColor: '#fafafa'
                }}>
                  {/* Thông tin tổng quan */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#757575',
                      fontSize: '0.95rem'
                    }}>
                      <span>Tổng số sản phẩm: <strong>{cartItems.length}</strong></span>
                      <span style={{color: '#e0e0e0'}}>|</span>
                      <span>Tổng số lượng: <strong>{cartItems.reduce((total, item) => total + item.quantity, 0)}</strong></span>
                    </div>
                    
                    <button 
                      onClick={() => clearCart()}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#9e9e9e',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#ffebee';
                        e.target.style.color = '#f44336';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#9e9e9e';
                      }}
                    >
                      <i className="fas fa-trash-alt" style={{fontSize: '0.85rem'}}></i>
                      Xóa tất cả
                    </button>
                  </div>
                  
                  {/* Tổng tiền */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      textAlign: 'right',
                      color: '#212121'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        marginBottom: '5px'
                      }}>Tổng tiền:</div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#ff4081'
                      }}>
                        {parseInt(totalPrice).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>
                  
                  {/* Nút thanh toán và tiếp tục mua sắm */}
                  <div style={{
                    display: 'flex',
                    gap: '15px'
                  }}>
                    <a href="/" style={{
                      flex: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px',
                      backgroundColor: 'white',
                      color: '#757575',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.borderColor = '#bdbdbd';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#e0e0e0';
                    }}>
                      <i className="fas fa-arrow-left" style={{fontSize: '0.9rem'}}></i>
                      Tiếp tục mua sắm
                    </a>
                    
                    <Button
                      className="checkout-btn"
                      style={{
                        flex: '2',
                        padding: '14px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        background: 'linear-gradient(45deg, #ff4081 0%, #ff7043 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(255, 64, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                      onClick={() => setShowModal(true)}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(255, 64, 129, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 64, 129, 0.3)';
                      }}
                    >
                      <i className="fas fa-credit-card"></i>
                      Thanh toán ngay
                    </Button>
                  </div>
                </div>
              </>
          )}
        </div>
        <CheckoutPopup
            show={showModal}
            handleClose={() => setShowModal(false)}
            cartItems={cartItems}
            totalPrice={totalPrice}
            handleCheckout={handleCheckout}
        />
      </div>

  );
};

export default Cart;
