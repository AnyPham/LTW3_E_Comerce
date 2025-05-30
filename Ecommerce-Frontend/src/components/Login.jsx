import React, { useState } from 'react';
import axios from '../axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            alert(res.data);
            // Lưu token nếu backend trả về
            // localStorage.setItem('token', res.data.token);
        } catch (err) {
            alert('Login failed!');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
