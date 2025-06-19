import './App.css';
import HomePage from './pages/Home';
import AddCategoryPage from './pages/AddCategoryPage/AddCategoryPage.tsx';
import EditCategoryPage from './pages/EditCategoryPage/EditCategoryPage.tsx'; // Додано імпорт
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import * as React from 'react';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="add-category" element={<AddCategoryPage />} />
                <Route path="edit-category/:id" element={<EditCategoryPage />} /> {/* Додано маршрут */}
            </Route>
        </Routes>
    );
};

export default App;
