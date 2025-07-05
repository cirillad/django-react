import './App.css';
import HomePage from './pages/Home';
import AddCategoryPage from './pages/AddCategoryPage/AddCategoryPage.tsx';
import EditCategoryPage from './pages/EditCategoryPage/EditCategoryPage.tsx';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import * as React from 'react';
import { RegisterPage } from "./pages/RegisterPage/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { setCredentials, logout } from './store/authSlice';
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        const BACKEND_URL = 'http://127.0.0.1:4096';

        if (token) {
            fetch(`${BACKEND_URL}/api/user/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    console.log('Response status:', res.status);
                    return res.text();
                })
                .then(text => {
                    console.log('Response text:', text);
                    try {
                        const userData = JSON.parse(text);
                        console.log("🤚userData parsed:", userData);
                        dispatch(setCredentials({ user: userData, token }));
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                });
        } else {
            dispatch(logout());
        }
    }, [token, dispatch]);


    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="add-category" element={<AddCategoryPage />} />
                <Route path="edit-category/:id" element={<EditCategoryPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    );
};

export default App;
