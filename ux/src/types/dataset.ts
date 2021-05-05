import {Category} from 'src/types/category';

export interface Dataset {
    id: string;
    created_at: string;
    description: string;
    name: string;
    categories: Category[];
    user_id: string;
}
