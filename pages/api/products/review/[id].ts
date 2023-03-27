import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getReview(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { productData, reviewScore, nickname, title, reviewText } = req.body;
        const date = new Date();

        const reviews = await prisma.review.findMany({
            where: {
                product_id: productData.product_id,
            },
        });
        const review_id = `rv${productData.product_id}-${reviews.length + 1}`;
      
        try {
            const reviewExist = await prisma.review.findUnique({
                where: {
                    user_email_order_id: {
                        user_email: productData.user_email,
                        order_id: productData.order_id,
                    }
                }
            });

            if (!reviewExist) {
                const result = await prisma.review.create({
                    data: {
                        product_id: productData.product_id,
                        review_id: review_id,
                        nickname: nickname,
                        user_email: productData.user_email,
                        review_date: date,
                        review_score: reviewScore,
                        product_subname: productData.product_subname,
                        review_title: title,
                        review_text: reviewText,
                        order_id: productData.order_id,
                        show_on_page: 0,
                    },
                });
                res.status(200).json({ message: 'Review posted successfully' });
            }
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error posting review' });
        }      
    } else {
        const productId = req.query.id as string;

        const reviews = await prisma.review.findMany({
            where: {
                product_id: productId,
                show_on_page: 0
            },
            orderBy: [{
                review_score: "desc",
            },{
                helpful_count: "desc",
            }],
            include: {
                review_image: {
                    select: {
                        imgUrl: true,
                    },
                },
            },
        })
    
        const totalReviewCounts = await prisma.review.count({
            where: {
                product_id: productId,
                show_on_page: 0,
                review_text: {
                    not: null,
                },
            },
        })
    
        const totalRankCounts = await prisma.review.count({
            where: {
                product_id: productId,
                show_on_page: 0,
                review_score: {
                    not: null,
                },
            },
        })
    
        const counts = await prisma.review.groupBy({
            by: ['review_score'],
            _count: {
                review_score: true,
            },
            where: {
                product_id: productId,
                show_on_page: 0
            },  
        })
    
        const averageRankData = await prisma.review.aggregate({
            _avg: {
                review_score: true,
            },
            where: {
                product_id: productId,
                show_on_page: 0
            }
        });
    
        const averageRank = averageRankData._avg.review_score.toFixed(1);
    
        const allScores = [5, 4, 3, 2, 1];
        const countData = allScores.map((score) => {
            const group = counts.find((c) => c.review_score === score);
            const count = group?._count?.review_score ?? 0;
            const percentage = totalRankCounts > 0 ? (count / totalRankCounts) * 100 : 0;
            return { review_score: score, _count: count, countPercent: percentage };
        });
        res.json({reviews, totalReviewCounts, totalRankCounts, countData, averageRank})
    }
}