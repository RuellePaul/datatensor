import {Label} from 'src/types/label'

export interface Image {
    _id: string;
    dataset_id: string;
    path: string;
    name: string;
    size: number;
    width: number;
    height: number;
    labels: Label[];
}
