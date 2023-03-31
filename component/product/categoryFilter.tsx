import React, { Key } from "react";
import { useRouter } from "next/router";
import styles from "./categoryFilter.module.css";

type CategoryComponentProps = {
  data: any;
  childCategory: any;
  parentCategory: any;
}

type ChildCategory = {
  categoryId: string;
  categoryName: string;
  name: string;
};

type Category = {
  categoryId: string;
  name: string;
  children?: ChildCategory[];
};

function CategoryComponent({ data, childCategory, parentCategory }:  CategoryComponentProps) {
  const router = useRouter();
  const findCategory = (categories: Category[], categoryId: string): Category | null => {
    for (const category of categories) {
      if (category.categoryId === categoryId) {
        return category;
      }
      const nestedCategory = category.children && findCategory(category.children, categoryId);
      if (nestedCategory) {
        return nestedCategory;
      }
    }
    return null;
  };

  const category = findCategory(data, childCategory);

  const handleLeafCategory = (leafCategoryId: string) => {
    router.push(`/category/${parentCategory}/${childCategory}/${leafCategoryId}`)
  }
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      {category && category.children && category.children.length > 0 ? (
        <div className={styles.mainContainer}>
          <h1 className={styles.mainTitle}>カテゴリを選択</h1>
          <div className={styles.mainContent}>
            <h2 className={styles.title}>カテゴリ</h2>
            <div className={styles.childCategory}>
              {category.children.map((child: { 
                categoryId: Key; categoryName: string; 
              }) => (
                <button 
                  className={styles.childBtn}
                  key={child.categoryId}
                  onClick={() => handleLeafCategory(child.categoryId.toString())}
                >
                  {child.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
  }

export default CategoryComponent;
