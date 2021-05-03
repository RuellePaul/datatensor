import {Object} from 'src/types/object';

export interface Dataset {
    id: string;
    created_at: string;
    description: string;
    name: string;
    objects: Object[];
    user_id: string;
}
