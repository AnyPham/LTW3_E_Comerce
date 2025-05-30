import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
          cart.map((item) =>
              item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
          )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
      <AppProvider>
        <BrowserRouter>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar onSelectCategory={handleCategorySelect} />
            <div style={{ flex: 1, paddingTop: "70px" }}>
              <Routes>
                <Route
                    path="/"
                    element={<Home addToCart={addToCart} selectedCategory={selectedCategory} />}
                />
                <Route path="/add_product" element={<AddProduct />} />
                <Route path="/product" element={<Product />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/update/:id" element={<UpdateProduct />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route
                    path="*"
                    element={
                      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
                        404 - Page Not Found
                      </h1>
                    }
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
  );
}

export default App;
