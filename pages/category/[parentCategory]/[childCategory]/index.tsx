import { Key, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Head from "next/head";

import Navbar from "../../../../component/nav/navbar";
import ProductDisplay from "../../../../component/product/product";
import CategoryFilter from '../../../../component/product/categoryFilter';
import FunctionStyle from '../../../../component/product/functionStyle';
import { getCategoryData } from '../../../../lib/categoryData';

import styles from '../../../../styles/childCate.module.css';
  
export default function ChildCategory () {
    const router = useRouter();
    const { parentCategory, childCategory } = router.query;  
    const [data, setData] = useState<any>(null);
    const [selectedValues, setSelectedValues] = useState<{ [key: string]: string[] }>({});
    const [sortBy, setSortBy] = useState('recommendation');
    const [sortedProducts, setSortedProducts] = useState([]);

    const handleSelectedValuesChange = (newValues: { [key: string]: string[] }) => {
        setSelectedValues(newValues);
    };
    
    useEffect(() => {
        if (childCategory) {
            const category = Array.isArray(childCategory) 
            ? childCategory[childCategory.length - 1] : childCategory;
            
            const parent = Array.isArray(parentCategory)
            ? parentCategory[parentCategory.length - 1] : parentCategory;
            
            getCategoryData(parent, category).then((data) => setData(data));
        }
    }, [parentCategory, childCategory]);
                  
    if (!data) { return <div>Loading...</div> };
    console.log('data', data);

    const getCategoryName = (childCategory: string | string[]) => {
        let categoryName: string;
      
        data.category.some((category: { 
            categoryId: string; categoryName: string; children: any[]; 
        }) => {
            if (category.categoryId === childCategory) {
                categoryName = category.categoryName;
                return true;
            }
        
            if (category.children) {
                const child = category.children.find(
                (child) => child.categoryId === childCategory
                );
        
                if (child) {
                categoryName = child.categoryName;
                return true;
                }
            }
            return false;
        });
        return categoryName;
    };

    function mapData (data: { 
        products: any[]; skuImgs: any[]; skus: any[]; rating: any; reviewLength: any; }) {
        // Map over products array
        const products = data.products.map(product => {
            return {
                product_id: product.product_id,
                category_id: product.category_id,
                product_name: product.product_name
            };
        });
      
        // Map over skuImgs array
        const skuImgs = data.skuImgs.map(img => {
            return {
                product_id: img.product_id,
                imgUrl: img.imgUrl
            };
        });
      
        // Map over skus array
        const skus = data.skus.map(sku => {
            for (const key in sku) {
                if (key.startsWith("package")) {
                    delete sku[key];
                }
                if (key.startsWith("weight")) {
                    delete sku[key];
                }
                if (key.startsWith("deepth")) {
                    delete sku[key];
                }
                if (key.startsWith("height")) {
                    delete sku[key];
                }
                if (key.startsWith("material")) {
                    delete sku[key];
                }
                if (key.startsWith("subname")) {
                    delete sku[key];
                }
                if (key.startsWith("product_sub_id")) {
                    delete sku[key];
                }
                if (key.startsWith("leaf")) {
                    delete sku[key];
                }
            }
            return sku;
        });
      
        // Return mapped data
        return {
            products,
            skuImgs,
            skus,
            rating: data.rating,
            reviewLength: data.reviewLength,
        };
    }
    const mappedData = mapData(data);
    console.log('map', mappedData);

    function filterProducts (
        mappedData: { [key: string]: string | number }[] = [],
        selectedValues: { [key: string]: any[] }
    ) {
        return mappedData.filter((product) => {
            return Object.entries(selectedValues).every(([key, values]) => {
                return values.length === 0 || Object.keys(product).some(propKey => {
                    return propKey.startsWith(key);
                }) && values.some(propValue => {
                    return Object.keys(product).some(propKey => {
                        return propKey.startsWith(key) && product[propKey] === propValue;
                    });
                });
            });
        });
    }
      
    const flattenedData = mappedData.skus.map((sku: any) => {
        const product = mappedData.products.find((p: any) => p.product_id === sku.product_id);
        const skuImg = mappedData.skuImgs.find((img: any) => img.product_id === sku.product_id);
        return {
            product_id: sku.product_id,
            category_id: product.category_id,
            product_name: product.product_name,
            imgUrl: skuImg.imgUrl,
            ...sku,
            ...mappedData.rating[sku.product_id],
            ...mappedData.reviewLength[sku.product_id],
        };
    });
    const filteredProducts = filterProducts(flattenedData, selectedValues as { [key: string]: any[] });
    const filteredStyles = filteredProducts.map(product => {
        const { imgUrl, category_id, product_name, ...rest } = product;
        return rest;
    });
    console.log('style', filteredStyles);
      
      
    const priceRanges: {[productId: string]: {lowest: number, highest: number}} = {};
    for (const sku of mappedData.skus) {
        const productId = sku.product_id;
        if (!(productId in priceRanges)) {
            priceRanges[productId] = { lowest: Infinity, highest: -Infinity };
        }
        const price = parseInt(sku.price);
        if (price < priceRanges[productId].lowest) {
            priceRanges[productId].lowest = price;
        }
        if (price > priceRanges[productId].highest) {
            priceRanges[productId].highest = price;
        }
    } 

    const handleSortChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSortBy(event.target.value);
    };
    
    const handleProductPage = (productId: string | number) => {
        router.push(`/products/${productId}`);
    };
    
    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>{getCategoryName(childCategory)}</title>
            </Head>
            <Navbar />
            
            <div className={styles.mainContent}>
                <div className={styles.filterCriteria}>
                    <CategoryFilter 
                        data={data.category} 
                        childCategory={childCategory} 
                        parentCategory={parentCategory}
                    />
                    <FunctionStyle 
                        sku={filteredStyles}
                        initialSelectedValues={selectedValues}
                        onSelectedValuesChange={handleSelectedValuesChange}              
                    />
                </div>
                <div className={styles.productsContainer}>
                    <h1 className={styles.pageTitle}>{getCategoryName(childCategory)}</h1>
                    <div className={styles.selectionBar}>
                        <p className={styles.productAmount}>
                            全
                            <span className={styles.amountNum}>
                                {[...new Set(filteredProducts.map(product => product.product_id))].length}
                            </span>
                            件
                            <span className={styles.amountRange}>
                                1 ~ {[...new Set(filteredProducts.map(product => product.product_id))].length}件
                            </span>
                        </p>
                        <select value={sortBy} onChange={handleSortChange} defaultValue="recommendation">
                            <option value="recommendation">おすすめ順</option>
                            <option value="price-low-to-high">価格が安い順</option>
                            <option value="price-high-to-low">価格が高い順</option>
                            <option value="rating">レビュー評価順</option>
                            <option value="reviews">レビュー数順</option>
                        </select>
                    </div>
                    <div className={styles.productsDisplay}>
                        {filteredProducts.map((product, index, arr) => {
                            if (arr.findIndex(p => p.product_id === product.product_id) !== index) {
                                return null;
                            }
                            return (
                                <div
                                    key={product.product_id}
                                    className={styles.productWrapper}
                                    onClick={() => handleProductPage(product.product_id)}
                                >
                                    <ProductDisplay
                                        product={{
                                            name: product.product_name,
                                            imgUrl: product.imgUrl,
                                            rating: data.rating[product.product_id],
                                            review: data.reviewLength[product.product_id],
                                            lowestPrice: priceRanges[product.product_id].lowest,
                                            highestPrice: priceRanges[product.product_id].highest,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}