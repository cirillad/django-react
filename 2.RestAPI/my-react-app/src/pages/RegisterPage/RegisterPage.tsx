import React, { useState } from 'react';
import { useRegisterMutation } from "../../services/apiAuth.ts";

export const RegisterPage = () => {
    const [register, { isLoading, error }] = useRegisterMutation();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            if (image) {
                formData.append('image', image);
            }

            await register(formData).unwrap();
            alert('Реєстрація успішна');
            // TODO: редірект на логін, якщо треба
        } catch (err) {
            console.error(err);
            alert('Помилка реєстрації');
        }
    };

    return (
        <form onSubmit={onSubmit} style={{
            maxWidth: 400,
            margin: '50px auto',
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 15,
            fontFamily: 'Arial, sans-serif',
        }}>
            <h2 style={{ textAlign: 'center' }}>Реєстрація</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                }}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                }}
            />

            <input
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                    padding: 10,
                    fontSize: 16,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                }}
            />

            <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
                style={{
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    padding: 6,
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
                {isLoading ? 'Завантаження...' : 'Зареєструватися'}
            </button>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>Помилка реєстрації</p>}
        </form>
    );
};
