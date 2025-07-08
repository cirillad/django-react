import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfileData {
    username: string;
    email: string;
    phone: string;
    old_password: string;
    new_password: string;
    image: File | null;
}

const MEDIA_URL = 'http://localhost:4096/media/';  // зміни на свій бекенд

const ProfileUpdateForm = () => {
    const [formData, setFormData] = useState<ProfileData>({
        username: '',
        email: '',
        phone: '',
        old_password: '',
        new_password: '',
        image: null,
    });

    const [message, setMessage] = useState<string>('');
    const [errors, setErrors] = useState<any>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        console.log('Access token:', token);

        if (!token) {
            console.warn('No access token found! User might not be logged in.');
            return;
        }

        axios.interceptors.request.use(request => {
            console.log('Starting Request', request);
            return request;
        });

        axios.get('http://localhost:4096/api/profile/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                console.log('Profile data:', res.data);
                setFormData({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    old_password: '',
                    new_password: '',
                    image: null,
                });

                if (res.data.avatarUrl) {
                    const avatarUrl = res.data.avatarUrl.startsWith('http')
                        ? res.data.avatarUrl
                        : MEDIA_URL + res.data.avatarUrl.replace(/^\/?media\/?/, '');
                    console.log('Resolved avatar URL:', avatarUrl);
                    setImagePreview(avatarUrl);
                } else {
                    setImagePreview(null);
                }
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
                if (err.response) {
                    console.log('Response status:', err.response.status);
                    console.log('Response data:', err.response.data);
                    if (err.response.status === 401) {
                        console.warn('Unauthorized! Token might be invalid or expired.');
                        // Тут можна, наприклад, редірект на логін
                    }
                }
            });
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files && files[0]) {
            setFormData({ ...formData, image: files[0] });
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        if (formData.old_password) data.append('old_password', formData.old_password);
        if (formData.new_password) data.append('new_password', formData.new_password);
        if (formData.image) data.append('image', formData.image);

        axios.put('http://localhost:4096/api/profile/update/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(res => {
                setMessage(res.data.message);
                setErrors({});
                setFormData(prev => ({ ...prev, old_password: '', new_password: '' }));

                // Якщо у відповіді оновлений аватар повертається — оновлюємо preview
                if (res.data.avatarUrl) {
                    const avatarUrl = res.data.avatarUrl.startsWith('http')
                        ? res.data.avatarUrl
                        : MEDIA_URL + res.data.avatarUrl.replace(/^\/?media\/?/, '');
                    setImagePreview(avatarUrl);
                }
            })
            .catch(err => {
                if (err.response?.data) {
                    setErrors(err.response.data);
                }
                setMessage('');
            });
    };

    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg
                     transition-colors duration-300"
        >
            <div className="flex justify-center mb-6">
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Аватар"
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 text-3xl font-bold select-none">
                        ?
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Оновлення профілю
            </h2>

            {/* Поля форми... */}
            <div className="mb-5">
                <label htmlFor="username" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                    Логін
                </label>
                <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                    autoComplete="username"
                />
                {errors.username && <p className="mt-1 text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div className="mb-5">
                <label htmlFor="email" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                    autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-5">
                <label htmlFor="phone" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                    Телефон
                </label>
                <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                    autoComplete="tel"
                />
                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="mb-5">
                <label htmlFor="old_password" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                    Старий пароль
                </label>
                <input
                    id="old_password"
                    name="old_password"
                    type="password"
                    value={formData.old_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        errors.old_password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                    autoComplete="current-password"
                />
                {errors.old_password && <p className="mt-1 text-red-500 text-sm">{errors.old_password}</p>}
            </div>

            <div className="mb-5">
                <label htmlFor="new_password" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                    Новий пароль
                </label>
                <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        errors.new_password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                    autoComplete="new-password"
                />
                {errors.new_password && <p className="mt-1 text-red-500 text-sm">{errors.new_password}</p>}
            </div>

            <div className="mb-6">
                <label htmlFor="image" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                    Аватар
                </label>
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className={`w-full text-gray-700 dark:text-gray-300`}
                />
                {errors.image && <p className="mt-1 text-red-500 text-sm">{errors.image}</p>}
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg
                           transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
                Оновити профіль
            </button>

            {message && (
                <p className="mt-4 text-center text-green-600 font-semibold select-none">
                    {message}
                </p>
            )}
        </form>
    );
};

export default ProfileUpdateForm;
