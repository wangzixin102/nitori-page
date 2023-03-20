import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';
import Head from "next/head";
import Image from "next/image";
import Cookies from 'universal-cookie';

import Navbar from "@/component/nav/navbar";
import getUserData from "@/lib/userData";

import orderHistory from '@/public/icon/order-history.svg';
import favouriteProduct from '@/public/icon/favourite-product.svg';
import favouriteStore from '@/public/icon/favourite-store.svg';
import personalInfo from '@/public/icon/personal-info.svg';
import addressAlter from '@/public/icon/address-alt.svg';
import creditCardAlter from '@/public/icon/creditcard-alt.svg';
import styles from "@/styles/myAccount.module.css";

export default function Account() {
    const router = useRouter();
    const {userData} = getUserData();

    const fetcher = async (url) => await axios.get(url).then((res) => res.data);
    const { data: userOrders, error } = useSWR('/api/user/user-order', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!userOrders) return <div>Loading ...</div>;
    
    const filteredOrders = userOrders.filter((order) => {
        if (userData && userData.email) {
            return order.user_email === userData.email;
        }
        return false;
    });
    const latestOrder = filteredOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date))[0];
    console.log('11111111',latestOrder)

    const handleLogin = () => {
        router.push({
            pathname: "/login",
            query: { redirect: "/my-account" }
        })
    };

    const handleLogout = () => {
        const cookies = new Cookies();
        cookies.remove("token");
        router.reload();
    };

    const handleOrderHistoryPage = () => {
        router.push('/my-account/order-history')
    }

    const handleWishListPage = () => {
        router.push('/my-account/wishlist')
    }

    const handleProfileEditPage = () => {
        router.push('/my-account/profileEdit')
    }

    const handleWriteReview = (orderId) => {
        router.push(`/my-account/myReview/${orderId}`)
    }    
    
    const handleReviewBtn = () => {
        router.push('/my-account/myReview')
    }

    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>マイページ</title>
            </Head>
            
            <Navbar />
            {!userData || userData.length === 0 ? (
                <p className={styles.pleaseLogin}>
                    Please
                        <span onClick={handleLogin} className={styles.login}>
                            Login
                        </span>
                    to see your personal infomaton.
                </p>
            ) : (
                <div className={styles.content}>
                    <div className={styles.memberShip}>
                        <div className={styles.memberTitle}>
                            <p className={styles.titleText}>ニトリメンバーズ　ネット会員</p>
                            <p className={styles.logOut} onClick={handleLogout}>ログアウト</p>
                        </div>
                        <p className={styles.memberAbout}>会員種別について</p>
                        <p className={styles.memberCard}>
                            <span className={styles.memberCardName}>
                                {userData && userData.username}
                            </span>
                            さんの会員証
                        </p>
                        <div className={styles.pointWrapper}>
                            <p className={styles.pointText}>現在のポイント</p>
                            <p className={styles.nowPoint}>
                                <span className={styles.nowPointNum}>88</span>pt
                            </p>
                        </div>
                        <div className={styles.pointWrapper}>
                            <p className={styles.pointText}>今年失効するポイント</p>
                            <p className={styles.point}>
                                <span className={styles.pointNum}>88</span>pt
                            </p>
                        </div>
                        <p className={styles.pointUpdate}>毎日午前9時以降に順次更新されます</p>
                    </div>

                    <div className={styles.infoWrapper}>
                        <div className={styles.infoDetails}>
                            <div className={styles.girdWrapper} onClick={handleOrderHistoryPage}>
                                <Image 
                                    className={styles.gridIcon}
                                    alt=""
                                    height={50}
                                    width={50}
                                    src={orderHistory}
                                />
                                <p className={styles.gridText}>注文履歴</p>
                            </div>
                            <div className={styles.girdWrapper} onClick={handleWishListPage}>
                                <Image 
                                    className={styles.gridIcon}
                                    alt=""
                                    height={50}
                                    width={50}
                                    src={favouriteProduct}
                                />
                                <p className={styles.gridText}>お気に入り商品</p>
                            </div>
                            <div className={styles.girdWrapper}>
                                <Image 
                                    className={styles.gridIcon}
                                    alt=""
                                    height={50}
                                    width={50}
                                    src={favouriteStore}
                                />
                                <p className={styles.gridText}>お気に入り店舗</p>
                            </div>
                            <div className={styles.girdWrapper} onClick={handleProfileEditPage}>
                                <Image 
                                    className={styles.gridIcon}
                                    alt=""
                                    height={50}
                                    width={50}
                                    src={personalInfo}
                                />
                                <p className={styles.gridText}>お客様情報の確認・変更</p>
                            </div>
                            <div className={styles.girdWrapper}>
                                <Image 
                                    className={styles.gridIcon}
                                    alt=""
                                    height={50}
                                    width={50}
                                    src={addressAlter}
                                />
                                <p className={styles.gridText}>配送先住所の変更・登録</p>
                            </div>
                            <div className={styles.girdWrapper}>
                                <Image 
                                    className={styles.gridIcon}
                                    alt=""
                                    height={50}
                                    width={50}
                                    src={creditCardAlter}
                                />
                                <p className={styles.gridText}>クレジットカードの変更・登録</p>
                            </div>
                        </div>

                        <div className={styles.productReviews}>
                            <h1 className={styles.reviewTitle}>マイ商品レビュー</h1>
                            {!latestOrder || latestOrder.length === 0 ? (
                                <p className={styles.noRecords}>No Records Now</p>
                            ) : (                                
                                <div className={styles.latestOrder}>
                                    <Image 
                                        className={styles.orderImg}
                                        src={latestOrder.imgUrl}
                                        alt=""
                                        width={120}
                                        height={120}
                                    />
                                    <div className={styles.reviewWrapper}>
                                        <p className={styles.orderSubname}>{latestOrder.product_subname}</p>
                                        <button 
                                            className={styles.writeReviewBtn}
                                            onClick={() => handleWriteReview(latestOrder.order_id)}
                                        >
                                            商品レビューを書く
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button className={styles.reviewBtn} onClick={handleReviewBtn}>
                                マイ商品レビュー一覧
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 