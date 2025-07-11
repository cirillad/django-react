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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Тут передаємо email, а не username
            const tokens = await login({ email, password }).unwrap();

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
                body: JSON.stringify({ access_token: credentialResponse.credential }),
            });

            if (!res.ok) throw new Error('Google login failed');

            const data = await res.json();

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
        <div
            style={{
                maxWidth: 400,
                margin: '50px auto',
                padding: 20,
                border: '1px solid #ddd',
                borderRadius: 8,
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                <h2 style={{ textAlign: 'center' }}>Вхід</h2>

                <input
                    type="email"  // змінили з text на email
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: 10,
                        fontSize: 16,
                        borderRadius: 4,
                        border: '1px solid #ccc',
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        padding: 10,
                        fontSize: 16,
                        borderRadius: 4,
                        border: '1px solid #ccc',
                    }}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: 12,
                        fontSize: 16,
                        backgroundColor: '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isLoading ? 'Завантаження...' : 'Увійти'}
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
