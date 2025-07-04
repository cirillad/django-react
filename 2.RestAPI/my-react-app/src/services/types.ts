// category

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

// auth

export interface User {
    id: number;
    username: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    google_picture_url?: string; // якщо десь ти використовуєш imageUrl
}

export interface RegisterRequest {
    username: string;
    password: string;
    phone?: string;
    image?: File | null;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}
