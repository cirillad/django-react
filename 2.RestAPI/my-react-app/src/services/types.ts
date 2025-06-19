export interface ICategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export interface ICategoryCreate {
    name: string;
    slug: string;
    description?: string;
}

export interface ICategoryUpdate extends ICategoryCreate {
    id: number;
}
