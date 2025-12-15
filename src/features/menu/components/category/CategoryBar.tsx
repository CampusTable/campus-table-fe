"use client";

import { useState } from "react";
import styles from "./CategoryBar.module.css";
import CategoryButton from "@/features/menu/components/category/button/CategoryButton";
import { CategoryItem } from "@/features/menu/types/categoryType";

interface CategoryBarProps {
  categories: CategoryItem[];
  onChange?: (categoryId: number) => void;
}

export default function CategoryBar({
  categories,
  onChange,
}: CategoryBarProps) {
  const [activeId, setActiveId] = useState<number>(categories[0].id);

  const handleSelect = (categoryId: number): void => {
    if (categoryId === activeId) {
      return;
    }
    setActiveId(categoryId);
    if (onChange) {
      onChange(categoryId);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        {categories.map((category: CategoryItem) => (
          <CategoryButton
            key={category.id}
            label={category.label}
            active={category.id === activeId}
            onClick={() => handleSelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
}