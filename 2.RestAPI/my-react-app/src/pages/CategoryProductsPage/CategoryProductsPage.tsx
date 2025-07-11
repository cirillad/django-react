import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery, useDeleteProductMutation } from "../../services/apiProduct.ts";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay.tsx";

const CategoryProductsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string; name?: string }>();
    const categoryId = id ? Number(id) : null;



    const { data: products, isLoading, error, refetch } = useGetProductsByCategoryQuery(
        categoryId!, // Якщо categoryId точно не undefined, можна використовувати "!"
        {
            skip: categoryId === undefined, // Пропускаємо запит, якщо id немає
        }
    );

    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (productId: number) => {
        const confirmDelete = window.confirm("Ви дійсно хочете видалити цей продукт?");
        if (!confirmDelete) return;

        try {
            await deleteProduct(productId).unwrap();
            refetch();
        } catch (e) {
            alert("Помилка при видаленні продукту!");
            console.error(e);
        }
    };

    const handleEdit = (productId: number) => {
        navigate(`/edit-product/${productId}`);
    };

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    // Ось новий обробник для кнопки додавання продукту
    const handleAddProduct = () => {
        if (!categoryId || isNaN(categoryId)) {
            alert("Невірна категорія. Не можна додати продукт.");
            return;
        }
        // Тут можна додати будь-яку логіку перед переходом
        navigate(`/add-product?category=${categoryId}`);
    };

    if (error) return <div>Щось пішло не так.</div>;

    return (
        <div className="relative min-h-screen p-6">
            {isLoading && <LoadingOverlay />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
                    >
                        <div>
                            {product.images_data && product.images_data.length > 0 && (
                                <img
                                    src={product.images_data[0].image_url}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                            )}
                            <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                            <p className="text-lg font-bold text-indigo-600 mt-4">{product.price} ₴</p>
                        </div>
                        <div
                            className="mt-4 flex justify-end space-x-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => handleEdit(product.id)}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                                Редагувати
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Видалити
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            <button
                onClick={handleAddProduct}
                className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-3xl font-bold flex items-center justify-center shadow-lg transition"
                aria-label="Додати продукт"
                title="Додати продукт"
            >
                +
            </button>
        </div>
    );
};

export default CategoryProductsPage;
