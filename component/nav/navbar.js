import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image"; 

import getUserData from "@/lib/userData";

import logo from '@/public/image/logo.jpeg';
import SearchIcon from '@/public/icon/search.svg';
import watchedHistory from '@/public/icon/watched.svg';
import support from '@/public/icon/support.svg';
import findStore from '@/public/icon/location.svg';
import favouriteProducts from '@/public/icon/favourite-product.svg';
import cart from '@/public/icon/shopping-cart.svg';
import styles from './navbar.module.css';

const Navbar = () => {
    const router = useRouter();
    const { userData } = getUserData();
    const [topLevelCategories, setTopLevelCategories] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [addedProductsAmount, setAddedProductsAmount] = useState(0);    
    const [selectedCategory, setSelectedCategory] = useState('すべて');
    const [categoryDropdown, setCategoryDropdown] = useState(false);
 
    const fetcher = async (url) => await axios.get(url).then((res) => res.data);
    const { data: categories, error: categoriesErr } = useSWR("/api/category", fetcher);
    const { data: likedProducts } = useSWR('/api/user/wishlist/liked-products');

    useEffect(() => {
        if (categories) {
            const categoriesById = {};
            categories.forEach((category) => {
                categoriesById[category.categoryId] = category;
            });

            const topLevelCategories = [];

            categories.forEach((category) => {
                const parentId = category.parentId;

                if (!parentId) {
                    topLevelCategories.push(category);
                } else {
                    const parentCategory = categoriesById[parentId];
                    if (!parentCategory.children) {
                        parentCategory.children = [];
                    }
                    parentCategory.children.push(category);
                }
            });

            setTopLevelCategories(topLevelCategories);
        }
    }, [categories]);

    useEffect(() => {
        if (userData && userData.email && likedProducts) {
            const filteredList = likedProducts.filter((product) => {
                return product.user_email === userData.email;
            });
            setFilteredList(filteredList);
        }
    }, [userData, likedProducts]);

    useEffect(() => {
        if (userData && userData.email) {
            const fetcher = async (url) => await axios.get(url).then((res) => res.data);
            const getAddedProducts = async () => {
                const addedProducts = await fetcher('/api/user/cart/cart');
                const filteredProducts = addedProducts.filter((item) => item.status === "カート");
                const totalAmount = filteredProducts.reduce((acc, item) => acc + item.amount, 0);
                setAddedProductsAmount(totalAmount);
            }
            getAddedProducts();
        } else {
            setAddedProductsAmount(0);
        }
    }, [userData]);
    

    if (categoriesErr) return <div>An error occurred.</div>;
    if (!categories) return <div>Loading ...</div>;

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push("/")
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleWishListPage = () => {
        router.push('/my-account/wishlist')
    }

    const handleCartPage = () => {
        router.push('/cart')
    }

    const handleCategoryDropdown = (e) => {
        e.preventDefault();
        setCategoryDropdown(!categoryDropdown)
    };

    const handleOnClickLogin = (e) => {
        e.preventDefault();
        router.push("/login")
    };

    const handleOnClickRegister = (e) => {
        e.preventDefault();
        router.push("/register")
    };

    const handleMyPage =(e) => {
        e.preventDefault();
        router.push("/my-account")
    }

    return(
        <div className={styles.container}>
            <div className={styles.upperContainer}>
                <Image
                    className={styles.logoImg}
                    alt=""
                    src={logo}
                    width={90}
                    height={55} 
                    onClick={handleOnClickHome}
                />
                <div className={styles.title}>
                    <p className={styles.webtitle}>ニトリ公式通販</p>
                    <p className={styles.webname}>ニトリネット</p>
                </div>
                <div className={styles.searchBoxContainer}>
                    <div className={styles.allCategoryContainer}>
                        <select 
                            id="category" 
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                            className={styles.selectedCategory}
                        >
                            <option value="all">すべて</option>
                            {topLevelCategories.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>                    
                    </div>
                    <input 
                        type="text" 
                        placeholder="すべてのカテゴリから検索" 
                        className={styles.serachBox}
                    />
                    <button className={styles.searchBtn}>
                        <Image
                            className={styles.searchBtnImg}
                            src={SearchIcon}
                            alt=""
                            width={30}
                            height={30}
                        />
                    </button>
                </div>
                <div className={styles.functions}>
                    <div className={styles.functionsWrapper}>
                        <Image
                            className={styles.functionIcon}
                            src={watchedHistory}
                            alt=''
                            width={30}
                            height={30}
                        />
                        <p className={styles.functionTitle}>閲覧履歴</p>
                    </div>
                    <div className={styles.functionsWrapper}>
                        <Image
                            className={styles.functionIcon}
                            src={support}
                            alt=''
                            width={30}
                            height={30}
                        />
                        <p className={styles.functionTitle}>サポート</p>
                    </div>
                    <div className={styles.functionsWrapper}>
                        <Image
                            className={styles.functionIcon}
                            src={findStore}
                            alt=''
                            width={30}
                            height={30}
                        />
                        <p className={styles.functionTitle}>店舗検索</p>
                    </div>
                    <div className={styles.functionsWrapper} onClick={handleWishListPage}>
                        <Image
                            className={styles.functionIcon}
                            src={favouriteProducts}
                            alt=''
                            width={30}
                            height={30}
                        />
                        {!userData || userData.length === 0 ? (
                            <span className={styles.likeCount}>0</span>
                        ) : (
                            <span className={styles.likeCount}>{filteredList.length}</span>
                        )}
                        <p className={styles.functionTitle}>お気に入り</p>
                    </div>
                    <div className={styles.functionsWrapper} onClick={handleCartPage}>
                        <Image
                            className={styles.functionIcon}
                            src={cart}
                            alt=''
                            width={30}
                            height={30}
                        />
                        {!userData || userData.length === 0 ? (
                            <span className={styles.addCount}>0</span>
                        ) : (
                            <span className={styles.addCount}>{addedProductsAmount}</span>
                        )}
                        <p className={styles.functionTitle}>カート</p>
                    </div>
                </div>
            </div>

            <div className={styles.lowerContainer}>
                <div className={styles.categoryContainer}>
                    <button className={styles.categoryBtn} onClick={handleCategoryDropdown}>
                        <p>カテゴリ</p>
                    </button>
                    <div className={styles.dropdownContainer}>
                        {categoryDropdown && (
                            <div className={styles.catrgoryDropDpwn}>
                                <ul className={styles.parentList}>
                                    {topLevelCategories.map((category) => (
                                        <li className={styles.parentItem} key={category.categoryName}>
                                            <div className={styles.parentItemName}>{category.categoryName}</div>
                                            <div className={styles.childDropDown}>
                                                <p className={styles.categoryHead}>{category.categoryName}</p>
                                                <ul className={styles.childList}>
                                                    {category.children  && category.children.map((child) => (
                                                        <li className={styles.childItem} key={child.categoryId}>
                                                            {child.categoryName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )} 
                    </div>
                </div> 

                {!userData || userData.length === 0 ? (
                    <div className={styles.buttons}>
                        <button className={styles.loginBtn} onClick={handleOnClickLogin}>
                            ログイン
                        </button>
                        <button className={styles.registerBtn} onClick={handleOnClickRegister}>
                            新規会員登録
                        </button>
                    </div>
                ) : (
                    <div className={styles.myPage}>
                        <p className={styles.username}>
                            <span className={styles.name}>{userData.username}</span>さん
                        </p>
                        <div className={styles.point}>
                            <p className={styles.pointText}>利用可能ポイント</p>
                            <p className={styles.pointNum}>
                                <span className={styles.Num}>0</span>pt
                            </p>
                        </div>
                        <button className={styles.myPageBtn} onClick={handleMyPage}>
                            マイページ
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Navbar;