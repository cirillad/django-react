import React, { useState } from 'react';
import { useLoginMutation } from '../../services/apiAuth';
import { useAppDispatch } from '../../store';
import { setCredentials } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tokens = await login({ username, password }).unwrap();

            const response = await fetch('http://127.0.0.1:4096/api/user/', {
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user data');

            const user = await response.json();

            console.log('User і токен перед setCredentials:', user, tokens.access);
            dispatch(setCredentials({ user, token: tokens.access }));

            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            alert('Невірний логін або пароль');
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            alert('Не вдалося отримати credential від Google');
            return;
        }

        console.log("Google credential:", credentialResponse.credential);

        try {
            const res = await fetch('http://127.0.0.1:4096/api/google-idtoken-login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token: credentialResponse.credential }), // передаємо ID Token
            });

            if (!res.ok) throw new Error('Google login failed');

            const data = await res.json();

            // Якщо у відповіді від бекенда є токен (наприклад, JWT), підставляй його сюди,
            // інакше просто передай user (потрібно адаптувати бекенд для JWT)
            // Тут припустимо, що бекенд повертає JWT у data.access
            const userRes = await fetch('http://127.0.0.1:4096/api/user/', {
                headers: { Authorization: `Bearer ${data.access}` },
            });

            if (!userRes.ok) throw new Error('Failed to fetch user data');

            const user = await userRes.json();
            dispatch(setCredentials({ user, token: data.access }));

            navigate('/');
        } catch (err) {
            console.error('Google login error:', err);
            alert('Помилка входу через Google');
        }
    };


    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
            <form onSubmit={handleSubmit}>
                <h2>Вхід</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
                />
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: 10 }}>
                    Увійти
                </button>
            </form>

            <div style={{ marginTop: 30, textAlign: 'center' }}>
                <p>Або увійдіть через Google</p>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => alert('Помилка авторизації через Google')}
                />
            </div>
        </div>
    );
};

export default LoginPage;
