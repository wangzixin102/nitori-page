import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user_email, review_id } = req.body;

        try {
            const voteExist = await prisma.review_vote_table.findUnique({
                where: {
                    user_email_review_id: {
                        user_email: user_email,
                        review_id: review_id,
                    }
                }
            });

            if (!voteExist) {
                const vote = await prisma.review_vote_table.create({
                    data: {
                        user_email,
                        review_id,
                    },
                });
                res.status(200).json(vote);
            } else {
                res.status(400).json({ error: 'User already voted on this review.' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
}
