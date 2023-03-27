import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Head from "next/head";
import Image from "next/image";

import getUserData from "../../../lib/userData";

import logo from '../../../public/image/logo.jpeg';
import support from '../../../public/icon/support.svg';
import cart from '../../../public/icon/shopping-cart.svg';
import styles from '../../../styles/updateEmail.module.css'

const emailSchema = yup.object().shape({
    emailInput: yup.string()
        .required('入力必須項目です。')
        .email('メールアドレスの形式が正しくありません。'),
    emailConfirm: yup.string()
        .required('入力必須項目です。')
        .email('メールアドレスの形式が正しくありません。')
        .oneOf([yup.ref('emailInput')], '入力されたメールアドレスが一致していません。'),
});

const cookie = new Cookies();

export default function profileEdit () {
    const router = useRouter();
    const token = cookie.get('token')
    const { userData } = getUserData();
    const [addedProductsAmount, setAddedProductsAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    
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

    const handleOnClickHome = (e) => {
        e.preventDefault();
        router.push("/")
    };

    const handleCartPage = () => {
        router.push('/cart')
    }

    const handleBackProfileEdit = () => {
        router.push('/my-account/profileEdit')
    }

    const handleSubmit = async (values: { emailInput: string; emailConfirm: string; }) => {
        const { emailInput, emailConfirm } = values;
        if (emailInput === emailConfirm) {
            try {
                const response = await axios.post('/api/user/updateEmail', {
                    old_user_email: userData.email,
                    new_user_email: emailInput
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });                
                console.log(response.data);
                router.reload();
            } catch (error) {
                setErrorMessage(error.response.data.error);
            }    
        }
    }

    return (
        <div className={styles.mainContainer}> 
            <Head>
                <title>会員登録メールアドレス入力</title>
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
                        <h1 className={styles.pageTitle}>変更後メールアドレス入力</h1>
                        <p className={styles.introText}>
                            変更したいメールアドレスを入力のうえ、送信してください。
                        </p>
                        <p className={styles.introText}>
                        ご入力いただいたメールアドレス宛にニトリネットから送信される確認メールをご確認ください。
                        </p>
                    </div>
                    <Formik
                        initialValues={{ emailInput: '', emailConfirm: '' }}
                        validationSchema={emailSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form className={styles.changeEmailContainer}>
                            <div className={styles.changeEmailWrapper}>
                                <div className={styles.changeEmailInput}>
                                    <label className={styles.emailText}>
                                        メールアドレス
                                        <span className={styles.necessaryTag}>必須</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <Field 
                                            className={styles.emailInput}
                                            type='text'
                                            placeholder="nitoritarou@nitori.jp"
                                            name='emailInput'
                                        />
                                        <ErrorMessage 
                                            name="emailInput" className={styles.errorMsg}
                                            render={msg => <div className={styles.errorMsg}>{msg}</div>}
                                        />
                                    </div>
                                </div>
                                <div className={styles.changeEmailInput}>
                                    <label className={styles.emailText}>
                                        メールアドレス
                                        <span className={styles.confirmTag}>（確認用）</span>
                                        <span className={styles.necessaryTag}>必須</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <p className={styles.comfirmNotion}>
                                            コピー・貼り付けはせずに入力してください。
                                        </p>
                                        <Field
                                            className={styles.emailInput}
                                            type='text'
                                            placeholder="nitoritarou@nitori.jp"
                                            name='emailConfirm'
                                        />
                                        <ErrorMessage 
                                            name="emailConfirm"  
                                            render={msg => <div className={styles.errorMsg}>{msg}</div>}
                                        />
                                    </div>
                                </div>
                                {errorMessage && (<p className={styles.serverErrMsg}>{errorMessage}</p>)}
                            </div>
                            <div className={styles.buttonWrapper}>
                                <button className={styles.backBtn} onClick={handleBackProfileEdit}>
                                    戻る
                                </button>
                                <button className={styles.updateEmailBtn} type='submit'>
                                    送信する
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}