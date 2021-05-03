export interface Dataset {
    id: string;
    created_at: string;
    description: string;
    name: string;
    object_ids?: string[];  // FIXME: must be initialized []
    user_id: string;
}
