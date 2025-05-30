import React, { useState } from 'react';
import axios from '../axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const res = await axios.post('/api/auth/register', { username, password });
            alert(res.data);
        } catch (err) {
            alert('Register failed!');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
