import Head from "next/head";
import Image from "next/image";
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';

import getUserData from '@/lib/userData';

import switchIcon from '@/public/icon/switch.svg';
import closeIcon from '@/public/icon/close.svg';
import addCartIcon from '@/public/icon/add-cart.svg'
import styles from "@/styles/wishlist.module.css";

export default function wishlist () {
    const { userData } = getUserData();

    const fetcher = async (url) => await axios.get(url).then((res) => res.data);
    const { data: likedProducts, error } = useSWR('/api/user/liked-products', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!likedProducts) return <div>Loading ...</div>;

    const filteredProducts = likedProducts.filter((product) => {
        if (userData && userData.email) {
            return product.user_email === userData.email;
        }
        return false;
    });
    console.log('11111', filteredProducts)

    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>お気に入り商品</title>
            </Head>
            <div className={styles.mainContent}>
                <h1 className={styles.pageTitle}>お気に入り商品</h1>
                <div className={styles.makeList}>
                    <input
                        className={styles.makeListInput}
                        type='text'
                        placeholder="新規リスト名を入力"
                    />
                    <button className={styles.makeListBtn}>
                        リストを作成
                    </button>
                </div>
                <div>
                    <h2 className={styles.subTitle}>お気に入り商品</h2>
                    <select className={styles.listSelection}>
                        {[...new Set(filteredProducts.map((product) => product.list_name))].map((listName) => (
                            <option key={listName} value={listName}>{listName}</option>
                        ))}
                    </select>                    
                    <div className={styles.operationBar}>  
                        <label className={styles.checkAll}>
                            <input
                                className={styles.checkBox}
                                type='checkbox'
                            />
                            <p className={styles.checkAllText}>すべて選択</p>
                        </label>
                        <p className={styles.checkedItem}>チェックしたものを</p>
                        <div className={styles.operation}>
                            <Image
                                className={styles.operationIcon}
                                src={switchIcon}
                                alt=''
                                width={20}
                                height={20}
                            />
                            <p className={styles.operationText}>移動</p>
                        </div>
                        <div className={styles.operation}>
                            <Image
                                className={styles.operationIcon}
                                src={closeIcon}
                                alt=''
                                width={20}
                                height={20}
                            />
                            <p className={styles.operationText}>削除</p>
                        </div>
                    </div>
                    {filteredProducts && filteredProducts.map((product) => (
                        <div className={styles.products}>
                            <input 
                                className={styles.checkProducts}
                                type='checkbox'
                            />
                            <Image
                                className={styles.productImg}
                                src={product.sku_imgUrl}
                                alt=''
                                width={140}
                                height={140}
                            />
                            <div>
                                <p className={styles.productSubname}>{product.sku_subname}</p>
                                <p className={styles.productPrice}>
                                    <span className={styles.priceNum}>{product.sku_price}</span>
                                    円（税込）
                                </p>
                                <div className={styles.quantity}>
                                    <p className={styles.quantityText}></p>
                                    <input
                                        className={styles.quantityInput}
                                        type='text'
                                    />
                                </div>
                                <button className={styles.addCartBtn}>
                                    <Image
                                        className={styles.addCartIcon}
                                        src={addCartIcon}
                                        alt=''
                                        width={30}
                                        height={30}
                                    />
                                    <p className={styles.addCartText}>カートに入れる</p>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className={styles.operationBar}>  
                        <label className={styles.checkAll}>
                            <input
                                className={styles.checkBox}
                                type='checkbox'
                            />
                            <p className={styles.checkAllText}>すべて選択</p>
                        </label>
                        <p className={styles.checkedItem}>チェックしたものを</p>
                        <div className={styles.operation}>
                            <Image
                                className={styles.operationIcon}
                                src={switchIcon}
                                alt=''
                                width={20}
                                height={20}
                            />
                            <p className={styles.operationText}>移動</p>
                        </div>
                        <div className={styles.operation}>
                            <Image
                                className={styles.operationIcon}
                                src={closeIcon}
                                alt=''
                                width={20}
                                height={20}
                            />
                            <p className={styles.operationText}>削除</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}