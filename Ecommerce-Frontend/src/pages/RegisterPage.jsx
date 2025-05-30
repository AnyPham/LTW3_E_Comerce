import React from 'react';
import '../App.css';

const RegisterPage = () => {
    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Register Page</h2>
                <form>
                    <input type="text" placeholder="Username" className="form-input" />
                    <input type="email" placeholder="Email" className="form-input" />
                    <input type="password" placeholder="Password" className="form-input" />
                    <button type="submit" className="form-button">Register</button>
                </form>
                <p className="register-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
