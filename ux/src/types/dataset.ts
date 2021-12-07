import {Category} from './category';


export interface Dataset {
    id: string;
    user_id: string;
    created_at: string;
    name: string;
    description: string;
    image_count: number;
    augmented_count: number;
    is_public: boolean;
    exported_at?: string;

    categories?: Category[]
}
