export interface Category {
    _id: string;
    dataset_id: string;
    name: string;
    supercategory: 'person' | 'vehicle' | 'electronic' | 'indoor' | 'outdoor' | 'sports' | 'furniture' | 'accessory' | 'kitchen' | 'animal' | 'appliance' | 'food' | null;
}
