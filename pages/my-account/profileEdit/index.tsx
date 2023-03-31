import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";

import getUserData from "../../../lib/userData";

import logo from '../../../public/image/logo.jpeg';
import support from '../../../public/icon/support.svg';
import cart from '../../../public/icon/shopping-cart.svg';
import styles from '../../../styles/profileEdit.module.css'

type UserData = {
    [x: string]: any;
    email: string;
};

export default function profileEdit () {
    const router = useRouter();
    const { userData } = getUserData() as unknown as { userData: UserData };
    const [addedProductsAmount, setAddedProductsAmount] = useState(0);
    
    useEffect(() => {
        if (userData && userData.email) {
            const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
            const getAddedProducts = async () => {
                const addedProducts = await fetcher('/api/user/cart/cart');
                const filteredProducts = addedProducts.filter(
                    (item: { status: string; }) => item.status === "カート"
                );
                const totalAmount = filteredProducts.reduce(
                    (acc: number, item: { amount: number; }) => acc + item.amount, 0
                );
                setAddedProductsAmount(totalAmount);
            }
            getAddedProducts();
        } else {
            setAddedProductsAmount(0);
        }
    }, [userData]);

    const handleOnClickHome = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        router.push("/")
    };

    const handleCartPage = () => {
        router.push('/cart')
    }

    const handleChangeEmailPage = () => {
        router.push('/my-account/profileEdit/update-email')
    }

    const handleChangeOtherPage = () => {
        router.push('/my-account/profileEdit/update-info')
    }

    return (
        <div className={styles.mainContainer}> 
            <Head>
                <title>会員情報変更項目選択</title>
            </Head>

            <div className={styles.mainContent}>
                <div className={styles.navigation}>
                    <div className={styles.navHome}>
                        <Image
                            className={styles.logoImg}
                            alt=""
                            src={logo}
                            width={90}
                            height={55} 
                            onClick={handleOnClickHome}
                        />
                        <div className={styles.title} onClick={handleOnClickHome}>
                            <p className={styles.webtitle}>ニトリ公式通販</p>
                            <p className={styles.webname}>ニトリネット</p>
                        </div>
                    </div>
                    <div className={styles.navFunction}>
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
                <div className={styles.bodyContainer}>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.pageTitle}>変更項目選択</h1>
                        <p className={styles.introText}>
                            メールアドレス、またはメールアドレス以外のご登録情報から変更したい項目を、以下から選択してください。
                        </p>
                    </div>
                    <div className={styles.buttonWrapper}>
                        <button className={styles.changeProfileBtn} onClick={handleChangeEmailPage}>
                            メールアドレスの変更
                        </button>
                        <button className={styles.changeProfileBtn} onClick={handleChangeOtherPage}>
                            メールアドレス以外の変更
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}