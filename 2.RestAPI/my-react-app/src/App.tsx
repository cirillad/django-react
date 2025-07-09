// src/App.tsx
import './App.css';
import React from "react";

import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import AdminLayout from "./layout/admin/AdminLayout.tsx";

import HomePage from "./pages/Home";
import Profile from "./pages/ProfilePage";
import AddCategoryPage from "./pages/AddCategoryPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PasswordResetRequest from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import CategoryProductsPage from "./pages/CategoryProductsPage/CategoryProductsPage.tsx";

import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminNotFoundPage from "./pages/admin/NotFound";
import AddProductPage from "./pages/AddProductPage/AddProductPage.tsx";

const App: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="add-category" element={<AddCategoryPage />} />
                    <Route path="add-product" element={<AddProductPage />} /> {/* <-- додано */}
                    <Route path="edit-category/:id" element={<EditCategoryPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="password-reset" element={<PasswordResetRequest />} />
                    <Route
                        path="password-reset-confirm/:uid/:token"
                        element={<PasswordResetConfirm />}
                    />
                    <Route path="category/:id" element={<CategoryProductsPage />} />
                </Route>

                <Route path="admin" element={<AdminLayout />}>
                    <Route path="home" element={<AdminDashboardPage />} />
                </Route>

                <Route path="*" element={<AdminNotFoundPage />} />
            </Routes>
        </>
    );
};

export default App;
