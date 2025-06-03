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

const Cart = () => {
  const { cart, removeFromCart , clearCart } = useContext(AppContext);
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
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
      <div className="cart-container" style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '2rem 1rem'
      }}>
        <div className="shopping-cart" style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div className="title" style={{
            background: 'linear-gradient(135deg, rgb(116 138 231) 0%, #154a97 100%)',
            color: 'white',
            padding: '1.5rem 2rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0
          }}>Shopping Bag
          </div>

          {cartItems.length === 0 ? (
              <div className="empty" style={{
                textAlign: "center",
                padding: "4rem 2rem",
                color: '#6c757d'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  opacity: 0.3
                }}>🛒
                </div>
                <h4 style={{color: '#6c757d', fontWeight: '300'}}>Your cart is empty</h4>
                <p style={{color: '#adb5bd', marginTop: '0.5rem'}}>Add some items to get started!</p>
              </div>
          ) : (
              <>
                <div style={{padding: '1rem'}}>
                  {cartItems.map((item, index) => (
                      <li key={item.id} className="cart-item" style={{
                        listStyle: 'none',
                        marginBottom: '1rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '1rem',
                        transition: 'all 0.3s ease',
                        border: '1px solid #e9ecef'
                      }}>
                        <div
                            className="item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: '1rem'
                            }}
                            key={item.id}
                        >
                          <div style={{flexShrink: 0}}>
                            <img
                                src={`/images/${item.imageName}`}
                                alt={item.name}
                                className="cart-item-image"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #e9ecef'
                                }}
                            />
                          </div>

                          <div className="description" style={{
                            flex: 1,
                            minWidth: 0
                          }}>
                            <div style={{
                              fontSize: '0.9rem',
                              color: '#667eea',
                              fontWeight: '600',
                              marginBottom: '0.25rem'
                            }}>{item.brand}</div>
                            <div style={{
                              fontSize: '1.1rem',
                              fontWeight: '500',
                              color: '#333',
                              wordBreak: 'break-word'
                            }}>{item.name}</div>
                          </div>

                          <div className="quantity" style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderRadius: '6px',
                            overflow: 'hidden'
                          }}>
                            <button
                                className="minus-btn"
                                type="button"
                                onClick={() => handleDecreaseQuantity(item.id)}
                                style={{
                                  border: 'none',
                                  backgroundColor: '#f8f9fa',
                                  padding: '0.5rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background-color 0.2s',
                                  color: '#6c757d'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            >
                              <i className="bi bi-dash-square-fill"></i>
                            </button>
                            <input
                                type="button"
                                name="name"
                                value={item.quantity}
                                readOnly
                                style={{
                                  border: 'none',
                                  textAlign: 'center',
                                  width: '50px',
                                  padding: '0.5rem',
                                  backgroundColor: 'white',
                                  fontWeight: 'bold',
                                  color: '#333'
                                }}
                            />
                            <button
                                className="plus-btn"
                                type="button"
                                onClick={() => handleIncreaseQuantity(item.id)}
                                style={{
                                  border: 'none',
                                  backgroundColor: '#f8f9fa',
                                  padding: '0.5rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background-color 0.2s',
                                  color: '#6c757d'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            >
                              <i className="bi bi-plus-square-fill"></i>
                            </button>
                          </div>

                          <div className="total-price" style={{
                            textAlign: "center",
                            minWidth: '80px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            color: '#333'
                          }}>
                            ${(item.price * item.quantity)}
                          </div>

                          <button
                              className="remove-btn"
                              onClick={() => handleRemoveFromCart(item.id)}
                              style={{
                                border: 'none',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                marginLeft: '0.5rem'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#c82333';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#dc3545';
                                e.target.style.transform = 'scale(1)';
                              }}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </li>
                  ))}
                </div>

                <div className="total" style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem 2rem',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  textAlign: 'right',
                  borderTop: '2px solid #e9ecef',
                  color: '#333'
                }}>
                  Total: ${totalPrice}
                </div>

                <div style={{padding: '1.5rem 2rem'}}>
                  <Button
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                        padding: '1rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, rgb(116 138 231) 0%, #154a97 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                      onClick={() => setShowModal(true)}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                      }}
                  >
                    Checkout
                  </Button>
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
