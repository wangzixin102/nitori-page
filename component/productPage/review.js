import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Rating } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

import getUserData from '@/lib/userData';
// import ReviewModal from './reviewModal';

import voteIcon from '../../public/icon/advice-vote.svg';
import styles from './review.module.css';

export default function Review() {
    const router = useRouter();
    const { userData, isLoggedIn } = getUserData();   
    // const [modalOpen, setModalOpen] = useState(false);
    const [orderBy, setOrderBy] = useState();
    const [reviews, setReviews] = useState();
    const [totalReviewCounts, setTotalReviewCounts] = useState();
    const [totalRankCounts, setTotalRankCounts] = useState();
    const [countData, setCountData] = useState();
    const [averageRank, setAverageRank] = useState();
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [selectedRank, setSelectedRank] = useState(null);
    const maxReviews = 3;
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (router.query.id) {
                    const { data } = await axios.get(
                        `/api/products/review/${router.query.id}`
                    );
                    setReviews(data.reviews);
                    setTotalReviewCounts(data.totalReviewCounts);
                    setTotalRankCounts(data.totalRankCounts);
                    setCountData(data.countData);
                    setAverageRank(data.averageRank)
                }
            } catch (error) {}
        };
        fetchData();
    }, [orderBy]);

    const handleVoteClick = async (review_id) => {
        try {
            const response = await axios.post('/api/products/review/vote-review', {
                user_email: userData.email,
                review_id: review_id
            });
            console.log(response)
        } catch (error) {
            console.log(error);
        }
        const updatedReviews = reviews.map((rv) =>
            rv.review_id === review_id ? { ...rv, voted: true } : rv
        );
        setReviews(updatedReviews);
    };

    const handleAllRank = () => {
        setSelectedRank(null)
    }

    const handleRankReview = (review_score) => {
        setSelectedRank(review_score)
    };

    const handleToggleReviews = () => {
        setShowAllReviews(!showAllReviews);
    };

    const handleReviewPage = () => {
        if (isLoggedIn === true) {
            router.push("/my-account/myReview")
        } else {
            router.push({
                pathname: "/login",
                query: { redirect: "/my-account/myReview" }
            })
        }
    }

    return (
        <div className={styles.reviewContainer}>
            <h3 className={styles.title}>レビュー</h3>
            <div className={styles.rankingContainer}>
                <div className={styles.overallRank}>
                    <p className={styles.overallRankText}>総合評価</p>
                    <p className={styles.overallRankScore}>
                        {averageRank}
                    </p>
                    <Rating 
                        className={styles.overallRating} 
                        value={Number(averageRank)}
                        size='small'
                        precision={0.1}
                        readOnly 
                    />
                    <p className={styles.rankCount} onClick={() => handleAllRank()}>
                        ({totalRankCounts})
                    </p>
                </div>

                <div className={styles.rankDetail}>
                    {countData && countData.map((count) =>
                        <div className={styles.rankWrapper} key={count.review_score}>
                            <Rating 
                                className={styles.branchRank} 
                                value={count.review_score}
                                size='small'
                                readOnly 
                            />
                            <LinearProgress  
                                classes={{ bar: "progressBar" }}
                                className={styles.countPercent}
                                variant="determinate"
                                value={count.countPercent} 
                                style={{ backgroundColor: '#dbdbdb' }}
                            />
                            <p 
                                className={styles.branchCount} 
                                onClick={count._count !== 0 ? () => handleRankReview(count.review_score) : undefined}
                                style={count._count === 0 ? { 
                                    pointerEvents: 'none',
                                    textDecoration: "none",
                                    color: "#dbdbdb"
                                } : undefined}
                            >
                                {count._count}人
                            </p>
                        </div>
                    )}
                </div>

                <div className={styles.reviewSum}>
                    <p className={styles.summaryText}>
                        {totalRankCounts}評価  {totalReviewCounts}商品レビュー
                    </p>
                    <button className={styles.reviewBtn} onClick={() => handleReviewPage()}>
                        商品レビューを書く
                    </button>   
                </div>
            </div>

            <div className={styles.reviewContainer}>
                {reviews && reviews.length > 0 ? (
                    reviews.slice(0, showAllReviews ? reviews.length : maxReviews).map((rv) => (
                        (selectedRank === null || rv.review_score === selectedRank) && (
                            <li className={styles.reviewList} key={rv.id}>
                                <div className={styles.reviewInfo}>
                                    <Rating 
                                        className={styles.userRating} 
                                        value={rv.review_score} 
                                        size='small'
                                        readOnly 
                                    />
                                    <p className={styles.username}>
                                        <span className={styles.usernameText}>
                                            {rv.nickname}
                                        </span>さん
                                    </p>
                                    <p className={styles.reviewDate}>
                                        {new Date(Date.parse(rv.review_date))
                                            .toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, '/')
                                        }
                                    </p>
                                </div>

                                <p className={styles.reviewProduct}>購入商品: {rv.product_subname}</p>
                                <p className={styles.reviewTitle}>{rv.review_title}</p>
                                <p className={styles.reviewText}>{rv.review_text}</p>
                                {rv.review_image && rv.review_image.length > 0 ? (
                                    <Image
                                        className={styles.reviewImg}
                                        alt=""
                                        src={rv.review_image.length > 0 ? rv.review_image[0].imgUrl : ''}
                                        width={80}
                                        height={80 * (3 / 4)}
                                        // onClick={() => setModalOpen(!modalOpen)}
                                    />
                                ) : (
                                    <p></p>
                                )}
                                {/* <ReviewModal 
                                    isOpen={modalOpen} 
                                    onClose={() => setModalOpen(false)}
                                    className={styles.modalContainer}
                                /> */}

                                {rv.voted ? (
                                    <p>フィードバックありがとうございます</p>
                                ) : (
                                    <div className={styles.helpfulContainer} onClick={() => handleVoteClick(rv.review_id)}>
                                        <Image
                                            className={styles.voteIcon}
                                            src={voteIcon}
                                            alt=""
                                            width={22}
                                            height={22}
                                        />
                                        <p className={styles.helpfulCount}>
                                            参考になった ({rv.helpful_count ? rv.helpful_count : 0}人)
                                        </p> 
                                    </div>
                                )}
                            </li>
                        )
                    ))
                ) : (
                    <p>まだレビューがありません</p>
                )}
                {reviews && ((reviews.length > maxReviews && selectedRank === null) 
                || (reviews.filter((rv) => rv.review_score === selectedRank).length > maxReviews)) && (                
                    <div className={styles.reviewDropdpwn} onClick={handleToggleReviews}>
                        <p className={styles.dropdownText}>
                            {showAllReviews 
                                ? '閉じる' 
                                : `レビューをもっと見る ${maxReviews}/${totalReviewCounts}`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}