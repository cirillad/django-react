import {useDeleteCategoryMutation, useGetCategoriesQuery} from "../../services/apiCategory.ts";
import {useNavigate} from "react-router-dom";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay.tsx";


const HomePage : React.FC = () => {
    const navigate = useNavigate();

    const {data: list, isLoading, error, refetch } = useGetCategoriesQuery();

    const [deleteCategory] = useDeleteCategoryMutation();

    const handleCategoryClick = (id: number) => {
        navigate(`/category/${id}`);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Ви дійсно хочете видалити цю категорію?"
        );
        if (!confirmDelete) return;

        try {
            await deleteCategory(id).unwrap();
            refetch();
        } catch (e) {
            alert("Помилка при видаленні!");
            console.error(e);
        }
    };

    console.log("List items in server", list);

    if (error)
        return <div>Something went wrong.</div>;

    const handleAdd = () => {
        navigate("/add-category");
    };

    const handleEdit = (id: number) => {
        navigate(`/edit-category/${id}`);
    };

    return (
        <>
            <div className="relative min-h-screen p-6">
                {isLoading && <LoadingOverlay />}
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Категорії</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list?.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCategoryClick(item.id)}
                            className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between cursor-pointer hover:shadow-lg transition"
                        >
                            <div>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {item.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    <strong>Слаг:</strong> {item.slug}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            </div>
                            <div className="mt-4 flex justify-end space-x-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(item.id);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAdd}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-3xl font-bold flex items-center justify-center shadow-lg transition"
                    aria-label="Додати категорію"
                    title="Додати категорію"
                >
                    +
                </button>
            </div>
        </>
    )
}

export default HomePage;
