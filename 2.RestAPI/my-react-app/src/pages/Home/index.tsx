import React from 'react';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../../services/apiCategory.ts";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://127.0.0.1:4096"; // Замінити на твій актуальний бекенд URL

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

    if (isLoading) return <div>Завантаження...</div>;
    if (error) return <div>Щось пішло не так.</div>;

    return (
        <div className="relative min-h-screen p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {list?.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
                    >
                        <div>
                            {item.image && (
                                <img
                                    src={item.image.startsWith("http") ? item.image : `${BACKEND_URL}${item.image}`}
                                    alt={item.name}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                />
                            )}
                            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-1"><strong>Слаг:</strong> {item.slug}</p>
                            <p className="text-sm text-gray-700">{item.description}</p>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
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
                        </div>
                    </div>
                ))}
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
