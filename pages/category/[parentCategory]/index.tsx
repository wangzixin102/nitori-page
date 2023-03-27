import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image"; 
import Head from "next/head";

import Navbar from "../../../component/nav/navbar";

import styles from "../../../styles/parentCate.module.css";

interface Category {
  categoryId: string;
  categoryName: string;
  parentId: string;
  children: Category[];
}

interface Props {
  topLevelCategories: Category[];
}

export default function ParentCategory() {
  const router = useRouter();
  const { parentCategory } = router.query;
  const [topLevelCategories, setTopLevelCategories] = useState([]);

  const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
  const { data: categories, error: categoriesErr } = useSWR("/api/category", fetcher);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const categoriesById = {};
      categories.forEach((category: { categoryId: string; }) => {
        categoriesById[category.categoryId] = category;
      });

      const topLevelCategories = [];

      categories.forEach((category: { parentId: string; categoryId: string; }) => {
        const parentId = category.parentId;

        if (parentId === 'null') {
          topLevelCategories.push(category);
        } else {
          const parentCategory = categoriesById[parentId];
          if (!parentCategory.children) {
            parentCategory.children = [];
          }
          if (!parentCategory.children.some(
            (child: { categoryId: string; }) => child.categoryId === category.categoryId
          )) {
            parentCategory.children.push(category);
          }
        }
      });
      setTopLevelCategories(topLevelCategories);
    }
  }, [categories]);    

  if (categoriesErr) return <div>An error occurred.</div>;
  if (!categories) return <div>Loading ...</div>;

  const filteredCategories = topLevelCategories && topLevelCategories.filter(
    (category: { categoryId: string | string[]; }) => category.categoryId === parentCategory
  )[0];

  const handleChildCatePage = (parentId: string, childId: string) => {
    router.push(`/category/${parentId}/${childId}`);
}      

  return (
    <div className={styles.mainContainer}>
      <Head>
        <title>{filteredCategories?.categoryName}通販</title>
      </Head>
      <Navbar />

      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>{filteredCategories?.categoryName}</h1>
        <h3 className={styles.subTitle}>カテゴリ一覧</h3>
        <div className={styles.productCategory}>
          {filteredCategories?.children?.map((childCategory: Category) => (
            <div 
              key={childCategory.categoryId} 
              className={styles.categoryName}
              onClick={() => handleChildCatePage(childCategory.parentId, childCategory.categoryId)}
            >
              {childCategory.categoryName}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
