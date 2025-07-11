import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:4096';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto mt-10 text-center">
                <p>Ви не авторизовані.</p>
            </div>
        );
    }

    const avatarUrl = user.image
        ? `${BASE_URL}${user.image}` // локальне фото з Django
        : user.google_picture_url || '/default-avatar.png'; // Google або запасне

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md text-center">
            <img
                src={avatarUrl}
                alt="User avatar"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold mb-2">{user.username || 'Без імені'}</h2>
            <p className="text-gray-700">{user.email}</p>

            {user.phone && (
                <p className="text-gray-600 mt-2">Телефон: {user.phone}</p>
            )}

            <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Вийти
            </button>
        </div>
    );
};

export default ProfilePage;
