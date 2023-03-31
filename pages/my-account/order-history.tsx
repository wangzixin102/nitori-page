import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';
import Head from "next/head";
import Image from 'next/image';

import Navbar from "../../component/nav/navbar";
import getUserData from '../../lib/userData';

import styles from "../../styles/orderHistory.module.css";

interface Order {
    user_email: string;
    product_id: string;
    product_subname: string;
    selection: string; 
    order_date: Date;
    imgUrl: string;
    order_id: string;
    status: string;
    guarantee: string;
    set_up: boolean;
    pick_up: boolean;
    amount: number;
    price: number;
}

type UserData = {
    [x: string]: any;
    email: string;
};

export default function orderHistory () {
    const router = useRouter();
    const { userData } = getUserData() as unknown as { userData: UserData };
    const [dateFilter, setDateFilter] = useState('sixMonths');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data: userOrders, error } = useSWR('/api/user/user-order', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!userOrders) return <div>Loading ...</div>;
    
    const filterOrdersByDate = (order: { order_date?: string | number | Date }): boolean => {
        if (!order.order_date) {
            return false;
        }
        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6);
        const orderDate = new Date(order.order_date);
        if (dateFilter === 'sixMonths') {
            return orderDate >= sixMonthsAgo && orderDate <= today;
        } else if (dateFilter === 'thisYear') {
            return orderDate.getFullYear() === new Date().getFullYear();
        } else if (dateFilter === 'pastYearOne') {
            return orderDate.getFullYear() === new Date().getFullYear() - 1;
        } else if (dateFilter === 'pastYearTwo') {
            return orderDate.getFullYear() === new Date().getFullYear() - 2;
        } else if (dateFilter === 'pastYearThree') {
            return orderDate.getFullYear() === new Date().getFullYear() - 3;
        } else if (dateFilter === 'pastYearFour') {
            return orderDate.getFullYear() === new Date().getFullYear() - 4;
        } else {
            return true;
        }
    };
      
      const filterOrdersByStatus = (order: { status?: string }): boolean => {
        if (!order.status) {
            return false;
        }
        if (statusFilter === 'ALL') {
            return true;
        } else if (statusFilter === 'ORDERED') {
            return order.status === '受注済';
        } else if (statusFilter === 'READY') {
            return order.status === '出荷/お渡し準備中';
        } else if (statusFilter === 'SHIPPED') {
            return order.status === '出荷/配送中';
        } else if (statusFilter === 'DELIVERED') {
            return order.status === 'お渡し済';
        } else if (statusFilter === 'CANCELED') {
            return order.status === 'キャンセル済';
        } else {
            return true;
        }
      };
      
    const filterOrders = (order: { 
        user_email?: string; order_date?: Date; status?: string 
    }): boolean => {
        if (userData && userData.email) {
            if (order.user_email !== userData.email) {
                return false;
            }
        }
        return filterOrdersByDate(order) && filterOrdersByStatus(order);
    };
          
    const filteredOrders = userOrders.filter(filterOrders);

    const handleClick = (productId: string) => {
        router.push(`/products/${productId}`)
    }
      
    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>注文履歴</title>
            </Head>
            <Navbar />
            
            <div className={styles.mainContent}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>注文履歴</h1>
                        <p className={styles.recallNotion}>
                            リコール該当商品は「注文詳細」画面よりご確認下さい。
                        </p>
                    </div>
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
                <div className={styles.selectionContainer}>
                    <div className={styles.selectionWrapper}>
                        <p className={styles.selectionTitle}>注文時期を選択</p>
                        <select 
                            className={styles.selection}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            defaultValue='sixMonths' 
                        >
                            <option value='sixMonths'>過去半年分の注文</option>
                            <option value='thisYear'>{new Date().getFullYear()}年の注文</option>
                            <option value='pastYearOne'>{new Date().getFullYear() - 1}年の注文</option>
                            <option value='pastYearTwo'>{new Date().getFullYear() - 2}年の注文</option>
                            <option value='pastYearThree'>{new Date().getFullYear() - 3}年の注文</option>
                            <option value='pastYearFour'>{new Date().getFullYear() - 4}年の注文</option>
                        </select>
                    </div>
                    <div className={styles.selectionWrapper}>
                        <p className={styles.selectionTitle}>注文状況を選択</p>
                        <select
                            className={styles.selection}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value='ALL'>すべて</option>
                            <option value='ORDERED'>受注済</option>
                            <option value='READY'>出荷・お渡し準備中</option>
                            <option value='SHIPPED'>出荷・配送中</option>
                            <option value='DELIVERED'>お渡し済</option>
                            <option value='CANCELED'>キャンセル済</option>
                        </select>
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
                                    <p className={styles.productSelection}>{order.selection}</p>
                                    <p className={styles.amount}>
                                        数量：
                                        <span className={styles.amountNum}>{order.amount}</span>
                                    </p>
                                    <p className={styles.price}>
                                        お支払金額：
                                        <span className={styles.priceNum}>{order.price}</span>
                                    </p>
                                </div>

                                <div className={styles.orderSubDetail}>
                                    <p className={styles.orderDate}>
                                        注文日：{new Date(order.order_date)
                                            .toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, '/')
                                            .replace(/^(\d{4})\/(\d{2})\/(\d{2})$/, '$1年$2月$3日')
                                        }
                                    </p>
                                    <p className={styles.setup}>
                                        組立サービス：
                                        {order.set_up ? 'なし' : 'あり'}
                                    </p>
                                    <p className={styles.pickup}>
                                        引取サービス：
                                        {order.pick_up ? 'なし' : 'あり'}
                                    </p>
                                    <p className={styles.guarantee}>
                                        保証年数：
                                        {order.guarantee}
                                    </p>
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