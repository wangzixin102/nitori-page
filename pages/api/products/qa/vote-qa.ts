import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { user_email, QA_id } = req.body;

        try {
            const voteExist = await prisma.qa_vote_table.findUnique({
                where: {
                    user_email_QA_id: {
                        user_email: user_email,
                        QA_id: QA_id,
                    }
                }
            });

            if (!voteExist) {
                const vote = await prisma.qa_vote_table.create({
                    data: {
                        user_email,
                        QA_id,
                    },
                });
                res.status(200).json(vote);
            } else {
                res.status(400).json({ error: 'User already voted on this QA.' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
}
