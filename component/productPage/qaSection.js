import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

import getUserData from '@/lib/userData';

import voteIcon from '../../public/icon/advice-vote.svg';
import styles from './qaSection.module.css';

export default function QA () {
    const router = useRouter();
    const productId = router.query.id;
    const {userData, isLoggedIn} = getUserData();
    const [QADatas, setQADatas] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState();
    const [orderBy, setOrderBy] = useState();
    const [question, setQuestion] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (router.query.id) {
                    const { data } = await axios.get(
                        `/api/products/qa/${router.query.id}?page=${currentPage}${orderBy ? `&orderBy=${orderBy}` : ''}`
                    );
                    setQADatas(data.QADatas);
                    setTotalPages(data.totalPages);
                    setTotalRecords(data.count)
                }
            } catch (error) {}
        };
        fetchData();
    }, [currentPage, orderBy]);
    
    const handleVoteClick = async (QA_id) => {
        try {
            const response = await axios.post('/api/products/qa/vote-qa', {
                user_email: userData.email,
                QA_id: QA_id
            });
            console.log(response)
        } catch (error) {
            console.log(error);
        }
        const updatedQADatas = QADatas.map((qa) =>
            qa.QA_id === QA_id ? { ...qa, voted: true } : qa
        );
        setQADatas(updatedQADatas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question) return;
    
        try {
            const response = await axios.post('/api/products/qa/[id]', {
                product_id: productId,
                question: question,
                question_use_email: userData.email,
            });
            console.log(response.data);
            setQuestion('');
        } catch (error) {
            console.error(error);
        }
    };
      
    const handlePrePageClick = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextPageClick = () => {
        setCurrentPage(currentPage + 1);
    };

    const handleSelectChange = (e) => {
        setOrderBy(e.target.value);
        setCurrentPage(1);
    };

  return (
    <div className={styles.mainContainer}>
        <h3 className={styles.title}>商品 Q&A</h3>
        <div className={styles.navWrapper}>
            <div className={styles.totalPages}>
                <p className={styles.totalPagesText}>
                    全{totalRecords}件
                </p>
            </div>

            <div className={styles.pageNavContainer}>
                {QADatas && QADatas.length > 0 && (
                    <nav className={styles.pageNav}>
                        {currentPage > 1 && (
                            <a className={styles.leftArrow} onClick={handlePrePageClick}>
                                &lt;
                            </a>
                        )}
                        <p className={styles.pageNum}>ページ{currentPage}/{totalPages}</p>
                        {currentPage < totalPages && (
                            <a className={styles.rightArrow} onClick={handleNextPageClick}>
                                &gt;
                            </a>
                        )}
                    </nav>
                )}     
            </div>

            <div className={styles.sortSelection}>
                <select id="orderBy" value={orderBy} onChange={handleSelectChange}>
                    <option value="question_date">新しい順</option>
                    <option value="helpful_count">トップ評価</option>
                </select>
            </div>
        </div>
 
        <div className={styles.qaContainer}>
            {QADatas && QADatas.length > 0 ? (
                QADatas.map((qaData) => (
                    <li className={styles.qaList} key={qaData.id}>
                        <p className={styles.qaData}>Q.{qaData.question}</p>
                        <p className={styles.qaDate}>
                            投稿日 {new Date(Date.parse(qaData.question_date))
                                .toISOString()
                                .slice(0, 10)
                                .replace(/-/g, '/')
                                .replace(/^(\d{4})\/(\d{2})\/(\d{2})$/, '$1年$2月$3日')
                            }
                        </p>
                        <div className={styles.answer}>
                            <p className={styles.qaAnsData}><span className={styles.letterA}>A.</span>{qaData.answer}</p>
                            <p className={styles.qaDate}>
                                回答日 {new Date(Date.parse(qaData.answer_date))
                                    .toISOString()
                                    .slice(0, 10)
                                    .replace(/-/g, '/')
                                    .replace(/^(\d{4})\/(\d{2})\/(\d{2})$/, '$1年$2月$3日')
                                }
                            </p>  
                            {qaData.voted ? (
                                <p>フィードバックありがとうございます</p>
                            ) : (
                                <div className={styles.helpfulContainer} onClick={() => handleVoteClick(qaData.QA_id)}>
                                    <Image
                                        className={styles.voteIcon}
                                        src={voteIcon}
                                        alt=""
                                        width={22}
                                        height={22}
                                    />
                                    <p className={styles.helpfulCount}>
                                        参考になった ({qaData.helpful_count ? qaData.helpful_count : 0}人)
                                    </p> 
                                </div>
                            )}
                        </div>
                    </li>
                ))
            ) : (
                <p>まだ商品Q&Aがありません</p>
            )}
        </div>

        <div className={styles.navWrapper}>
            <div className={styles.totalPages}>
                <p className={styles.totalPagesText}>
                    全{totalRecords}件
                </p>
            </div>

            <div className={styles.pageNavContainer}>
                {QADatas && QADatas.length > 0 && (
                    <nav className={styles.pageNav}>
                        {currentPage > 1 && (
                            <a className={styles.leftArrow} onClick={handlePrePageClick}>
                                &lt;
                            </a>
                        )}
                        <p className={styles.pageNum}>ページ{currentPage}/{totalPages}</p>
                        {currentPage < totalPages && (
                            <a className={styles.rightArrow} onClick={handleNextPageClick}>
                                &gt;
                            </a>
                        )}
                    </nav>
                )}     
            </div>
        </div>

        <div className={styles.notion}>
            <h4 className={styles.notionTitle}>ご注意ください</h4>
            <ul className={styles.notionList}>
                <li className={styles.notionItem}>
                    <p className={styles.notionText}>
                        「ニトリ商品Q&A」は、お客様のご質問とニトリの回答を、他のお客様に参考にしていただくためのサービスです。
                    </p>
                </li>
                <li className={styles.notionItem}>
                    <p className={styles.notionText}>
                        ニトリが不適切と判断した際、後日投稿を削除する場合がございます。詳細はご利用ガイドの
                        <Link 
                            className={styles.notionLink}
                            href='/'
                        >
                            ニトリ商品Q&Aについて
                        </Link>
                        をご確認ください。
                    </p>
                </li>
            </ul>
        </div>

        <form onSubmit={handleSubmit}>
            <div className={styles.askQuestion}>
                <input
                    className={styles.questionInput}
                    placeholder='不明な点を質問（例：この製品には耐久性がありますか？）'
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button 
                    type="submit"
                    className={styles.questionBtn}
                >
                    質問を投稿
                </button>
            </div>
        </form>
    </div>
  );
};