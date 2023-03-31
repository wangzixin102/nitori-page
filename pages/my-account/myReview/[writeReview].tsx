import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import axios from 'axios';
import Head from "next/head";
import Image from "next/image";
import { Rating } from '@mui/material';

import Navbar from "../../../component/nav/navbar";

import styles from '../../../styles/writeReview.module.css';

export default function WritingReview () {
    const router = useRouter();
    const path = router.asPath;
    const orderId = path.split('/').pop();
    const [reviewScore, setReviewScore] = useState(0);
    const [nickname, setNickname] = useState('');
    const [title, setTitle] = useState('');
    const [reviewText, setReviewText] = useState('');

    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data: userOrders, error } = useSWR('/api/user/user-order', fetcher);
    if (error) return <div>An error occured.</div>;
    if (!userOrders) return <div>Loading ...</div>;

    const filteredOrders = userOrders.filter((order: { order_id: string; }) => order.order_id === orderId)[0];

    const handleReviewScoreChange = (event: React.SyntheticEvent<Element, Event>, value: number | null) => {
        if (value !== null) {
            setReviewScore(value);
        }
    };
      
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/products/review/[id]', {
                productData: filteredOrders,
                reviewScore: reviewScore,
                nickname: nickname,
                title:title,
                reviewText: reviewText
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBackBtn = () => {
        router.push('/my-account/myReview')
    }

    const handleNextBtn = () => {
        router.push('/my-account')
    }


    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>Writing Review</title>
            </Head>

            <Navbar />
            {}
            <div className={styles.contentContainer}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>商品レビュー</h1>
                    <p className={styles.titleText}>商品レビューを入力してください。</p>
                </div>

                {filteredOrders &&
                    <div className={styles.productIfo}>
                        <Image 
                            className={styles.productImg}
                            src={filteredOrders.imgUrl}
                            alt=""
                            width={140}
                            height={140}
                        />
                        <div className={styles.productText}>
                            <p className={styles.subname}>{filteredOrders.product_subname}</p>
                            <p className={styles.selection}>{filteredOrders.selection}</p>
                        </div>
                    </div>
                }

                <div className={styles.reviewContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formValue}>
                            <label htmlFor="reviewScore" className={styles.labelName}> 
                                評価
                                <span className={styles.labelRequired}>必須</span>
                            </label>
                            <div className={styles.ratingBar}>
                                <p className={styles.ratingText}>不満</p>
                                <Rating
                                    className={styles.ratingStar}
                                    size="large"
                                    value={reviewScore}
                                    onChange={handleReviewScoreChange}
                                />
                                <p className={styles.ratingText}>満足</p>
                            </div>
                        </div>

                        <div className={styles.formValue}>
                            <label htmlFor="nickname" className={styles.labelName}>
                                ニックネーム
                            </label>
                            <div className={styles.inputWrapper}>
                                <p className={styles.inputRequired}>
                                    10文字以内で入力してください。
                                </p>
                                <input 
                                    className={styles.input}
                                    type="text" 
                                    id="nickname" 
                                    value={nickname} 
                                    onChange={(event) => setNickname(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.formValue}>
                            <label htmlFor="title" className={styles.labelName}>
                                タイトル
                            </label>
                            <div className={styles.inputWrapper}>
                                <p className={styles.inputRequired}>
                                    20文字以内で入力してください。
                                </p>
                                <input
                                    className={styles.input}
                                    type="text" 
                                    id="title" 
                                    value={title} 
                                    onChange={(event) => setTitle(event.target.value)} 
                                />
                            </div>
                        </div>

                        <div className={styles.formValue}>
                            <label htmlFor="reviewText" className={styles.labelName}>
                                レビュー本文
                            </label>
                            <div className={styles.inputWrapper}>
                                <p className={styles.inputRequired}>
                                    500文字以内で入力してください。
                                </p>
                                <textarea 
                                    className={styles.textArea}
                                    id="reviewText" 
                                    value={reviewText} 
                                    onChange={(event) => setReviewText(event.target.value)} 
                                />
                                <p className={styles.inputOnchange}>
                                    あと
                                        <span className={styles.onchangeNum}></span>
                                    文字入力できます。
                                </p>
                            </div>
                        </div>

                        <div className={styles.formValue}>
                            <label htmlFor="reviewText" className={styles.labelName}>
                                写真（最大5枚）
                            </label>
                            <div className={styles.inputWrapper}>
                                <button className={styles.imgBtn}>写真を選択</button>
                                <ul className={styles.notionList}>
                                    <li className={styles.notionItem}>
                                        すでに写真を5枚選択している場合は、選択している写真を削除してから新しい写真を選択してください。
                                    </li>
                                    <li className={styles.notionItem}>
                                        写真は、GIF・JPEG・PNG形式に対応しています。
                                    </li>
                                    <li className={styles.notionItem}>
                                        アップロードできる画像サイズは１枚当たり5MBまでとなります。
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.btnWrapper}>
                            <button className={styles.backBtn} onClick={() => handleBackBtn()}>
                                戻る
                            </button>
                            <button 
                                type="submit" 
                                className={styles.nextBtn}
                                onClick={() => handleNextBtn()}
                            >
                                次へ
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}