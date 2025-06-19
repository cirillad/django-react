import React from 'react';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../../services/apiCategory.ts";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const { data: list, isLoading, error, refetch } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Ви дійсно хочете видалити цю категорію?");
        if (!confirmDelete) return;

        try {
            await deleteCategory(id).unwrap();
            refetch();
        } catch (e) {
            alert("Помилка при видаленні!");
            console.error(e);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/edit-category/${id}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Something went wrong.</div>;

    return (
        <div className="relative min-h-screen">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Слаг</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Опис</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {list?.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 text-sm">{item.id}</td>
                            <td className="px-6 py-4 text-sm">{item.name}</td>
                            <td className="px-6 py-4 text-sm">{item.slug}</td>
                            <td className="px-6 py-4 text-sm">{item.description}</td>
                            <td className="px-6 py-4 text-right text-sm space-x-2">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                                    aria-label={`Редагувати категорію ${item.name}`}
                                    title="Редагувати категорію"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                                    aria-label={`Видалити категорію ${item.name}`}
                                    title="Видалити категорію"
                                >
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={() => navigate("/add-category")}
                className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-3xl font-bold flex items-center justify-center shadow-lg transition"
                aria-label="Додати категорію"
                title="Додати категорію"
            >
                +
            </button>
        </div>
    );
};

export default HomePage;
