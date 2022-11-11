import {Label} from 'src/types/label';


export interface Image {
    id: string;
    dataset_id: string;
    path: string;
    name: string;
    size: number;
    width: number;
    height: number;
    pipeline_id?: string;
    original_image_id?: string;
    labels?: Label[];
}
