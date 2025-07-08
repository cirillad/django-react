export interface ICategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
}

export interface ICategoryCreate {
    name: string;
    slug: string;
    description?: string;
    image?: File;
}