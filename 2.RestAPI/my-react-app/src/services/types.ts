export interface ICategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    image?: string | null;  // Додано поле image, воно може бути рядком або null
}

export interface ICategoryCreate {
    name: string;
    slug: string;
    description?: string;
    image?: File | null;  // Для створення також можна додати image як файл (якщо відправляєш FormData)
}

export interface ICategoryUpdate extends ICategoryCreate {
    id: number;
}
