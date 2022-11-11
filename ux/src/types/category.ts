export type SuperCategory =
    | 'person'
    | 'vehicle'
    | 'electronic'
    | 'indoor'
    | 'outdoor'
    | 'sports'
    | 'furniture'
    | 'accessory'
    | 'kitchen'
    | 'animal'
    | 'appliance'
    | 'food'
    | 'miscellaneous';

export interface Category {
    id: string;
    dataset_id: string;
    name: string;
    supercategory: SuperCategory | null;
    labels_count?: number;
}
