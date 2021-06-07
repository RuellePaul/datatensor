export interface Image {
    _id: string;
    dataset_id: string;
    path: string;
    name: string;
    size: number;
    width: number;
    height: number;
    pipeline_id?: string;
}
