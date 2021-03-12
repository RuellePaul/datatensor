export interface Dataset {
    id: string;
    attributes: string[];
    category: string;
    createdAt: number;
    currency: string;
    image: string | null;
    isAvailable: boolean;
    isShippable: boolean;
    name: string;
    price: number;
    quantity: number;
    updatedAt: number;
    variants: number;
}
