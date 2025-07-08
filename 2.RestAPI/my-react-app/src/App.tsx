import './App.css'
import HomePage from "./pages/Home";

import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import * as React from "react";
import AdminLayout from "./layout/admin/AdminLayout.tsx";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminNotFoundPage from "./pages/admin/NotFound";
import AddCategoryPage from "./pages/AddCategoryPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditCategoryPage from "./pages/EditCategoryPage";
import PasswordResetRequest from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import Profile from "./pages/ProfilePage";

const App : React.FC = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="profile" element={<Profile />} />  {/* <-- додано маршрут */}
                    <Route path="add-category" element={<AddCategoryPage  />} />
                    <Route path="edit-category/:id" element={<EditCategoryPage />} />
                    <Route path="login" element={<LoginPage  />} />
                    <Route path="register" element={<RegisterPage  />} />
                    <Route path="password-reset" element={<PasswordResetRequest />} />
                    <Route
                        path="password-reset-confirm/:uid/:token"
                        element={<PasswordResetConfirm />}
                    />
                </Route>

                <Route path="admin" element={<AdminLayout />}>
                    <Route path="home" element={<AdminDashboardPage />}/>
                </Route>

                <Route path="*" element={<AdminNotFoundPage />} />
            </Routes>
        </>
    )
}

export default App
