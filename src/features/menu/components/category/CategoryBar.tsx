"use client";

import { useState } from "react";
import styles from "./CategoryBar.module.css";
import CategoryButton from "@/features/menu/components/category/button/CategoryButton";

interface CategoryItem {
  id: string;
  label: string;
}

interface CategoryBarProps {
  categories: CategoryItem[];
  onChange?: (categoryId: string) => void;
}

export default function CategoryBar({
  categories,
  onChange,
}: CategoryBarProps) {
  const [activeId, setActiveId] = useState<string>(categories[0].id);

  const handleSelect = (categoryId: string): void => {
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