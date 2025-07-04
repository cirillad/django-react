import React, { useState } from 'react';
import { useRegisterMutation } from "../../services/apiAuth.ts";

export const RegisterPage = () => {
    const [register, { isLoading, error }] = useRegisterMutation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
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
        <form onSubmit={onSubmit}>
            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <input
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
            />
            <button type="submit" disabled={isLoading}>Зареєструватися</button>
            {error && <p style={{ color: 'red' }}>Помилка</p>}
        </form>
    );
};
