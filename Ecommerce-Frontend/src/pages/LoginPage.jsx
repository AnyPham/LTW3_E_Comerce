import React from 'react';
import '../App.css';
const LoginPage = () => {
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Welcome Back!</h2>
                <form>
                    <input type="text" placeholder="Username" className="form-input" />
                    <input type="password" placeholder="Password" className="form-input" />
                    <button type="submit" className="form-button">Login</button>
                </form>
                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
