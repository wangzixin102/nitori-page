import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';
import Image from 'next/image';
import Head from "next/head";

import Navbar from "../../../component/nav/navbar";
import getUserData from '../../../lib/userData';

import styles from '../../../styles/myReview.module.css';

interface Order {
    product_id: string;
    order_id: string;
    imgUrl: string;
    product_subname: string;
    selection: string;
}

export default function myReview () {
    const router = useRouter();
    const { userData } = getUserData();

    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data: userOrders, error } = useSWR('/api/user/user-order', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!userOrders) return <div>Loading ...</div>;

    const filteredOrders = userOrders.filter((order: { user_email: string; status: string; }) => {
        if (userData && userData.email) {
            return order.user_email === userData.email && order.status === 'お渡し済';
        }
        return false;
    });

    const handleClick = (productId: string) => {
        router.push(`/products/${productId}`)
    }

    const handleWriteReview = (orderId: string) => {
        router.push(`/my-account/myReview/${orderId}`)
    }

    return (
        <div className={styles.mainContain}>
            <Head>
                <title>myReview</title>
            </Head>

            <Navbar />
            <div className={styles.content}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>マイ商品レビュー一覧</h1>
                    <div className={styles.notionContainer}>
                        <button className={styles.notionBtn}>
                            店舗購入履歴を取得する
                        </button>
                        <ul className={styles.notionList}>
                            <li className={styles.notionItem}>
                                上記ボタンで最新の「店舗」購入履歴を取得できます
                            </li>
                            <li className={styles.notionItem}>
                                約15分程度で履歴が反映されます。※メンテナンス時を除く
                            </li>
                        </ul>
                    </div>
                </div>

                {filteredOrders.length > 0 ? (
                    <div className={styles.boughtHistory}>
                        {filteredOrders && filteredOrders.map((order: Order) => (
                            <div className={styles.historyContainer} key={order.order_id}>
                                <div className={styles.imageWrapper}>
                                    <Image 
                                        className={styles.orderImage}
                                        alt=""
                                        src={order.imgUrl}
                                        height={140}
                                        width={140}
                                        onClick={() => handleClick(order.product_id)}
                                    ></Image>
                                </div>

                                <div className={styles.orderDetails}>
                                    <p 
                                        className={styles.subname}
                                        onClick={() => handleClick(order.product_id)}
                                    >
                                        {order.product_subname}
                                    </p>
                                    <p className={styles.selection}>{order.selection}</p>
                                    <button 
                                        className={styles.reviewBtn}
                                        onClick={() => handleWriteReview(order.order_id)}
                                    >
                                        商品レビューを書く
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noRecords}>注文履歴がありません。</p>
                )}
            </div>
        </div>
    )
}