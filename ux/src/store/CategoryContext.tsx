import React, {createContext, FC, ReactNode, useState} from 'react';
import {Category} from 'src/types/category';

export interface CategoryContextValue {
    currentCategory: Category;
    saveCurrentCategory: (
        update: Category | ((category: Category) => Category)
    ) => void;
}

interface CategoryProviderProps {
    children?: ReactNode;
}

export const CategoryContext = createContext<CategoryContextValue>({
    currentCategory: null,
    saveCurrentCategory: () => {}
});

export const CategoryProvider: FC<CategoryProviderProps> = ({children}) => {
    const [currentCategory, setCurrentCategory] = useState<Category>(null);

    const handleSaveCategory = (
        update: Category | ((category: Category) => Category)
    ): void => {
        setCurrentCategory(update);
    };

    return (
        <CategoryContext.Provider
            value={{
                currentCategory: currentCategory,
                saveCurrentCategory: handleSaveCategory
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const CategoryConsumer = CategoryContext.Consumer;

export default CategoryContext;
