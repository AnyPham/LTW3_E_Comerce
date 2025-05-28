import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";
import Sidebar from "../components/Sidebar";

const Home = ({ selectedCategory }) => {
    const { data, isError, addToCart, refreshData } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

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

    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products;

    if (isError) {
        return (
            <h2 className="text-center" style={{ padding: "18rem" }}>
                <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }} />
            </h2>
        );
    }

    return (
        <>
            <div style={{ display: "flex", marginTop: "64px" }}>
                <Sidebar />

                <div
                    className="grid"
                    style={{
                        flexGrow: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        padding: "20px",
                    }}
                >
                    {filteredProducts.length === 0 ? (
                        <h2 className="text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            No Products Available
                        </h2>
                    ) : (
                        filteredProducts.map((product) => {
                            const { id, brand, name, price, productAvailable } = product;
                            return (
                                <div
                                    className="card mb-3"
                                    style={{
                                        width: "265px",
                                        height: "375px",
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
                                        style={{ textDecoration: "none", color: "inherit" }}
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
                                                <h5 className="card-title" style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>
                                                    {name.toUpperCase()}
                                                </h5>
                                                <i className="card-brand" style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                                                    {"~ " + brand}
                                                </i>
                                            </div>
                                            <hr className="hr-line" style={{ margin: "10px 0" }} />
                                            <div className="home-cart-price">
                                                <h5 className="card-text" style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: '5px', display: 'flex', justifyContent: 'right' }}>
                                                    {price}
                                                    <span>₫</span>
                                                </h5>
                                            </div>
                                            <button
                                                className="btn-hover color-9"
                                                style={{ margin: '10px 25px 0px ' }}
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
            </div>

            <footer
                style={{
                    backgroundColor: "#f8f8f8",
                    textAlign: "center",
                    padding: "20px 0",
                    marginTop: "40px",
                    borderTop: "1px solid #ddd",
                }}
            >
                <p style={{ margin: 0 }}>© 2025 My Store. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Home;
