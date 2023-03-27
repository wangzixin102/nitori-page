import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function updateEmail(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { old_user_email, new_user_email } = req.body

        try {
            const currentEmail = await prisma.user.findUnique({
                where: {
                    email: old_user_email
                }
            })

            const emailExist = await prisma.user.findUnique({
                where: {
                    email: new_user_email
                }
            })
            
            if (!emailExist && !currentEmail) {
                const result = await prisma.user.update({
                    where: {
                        email: old_user_email
                    },
                    data: {
                        email: new_user_email
                    }
                })
                res.status(200).json({ message: 'email updated successfully' });
            } else {
                res.status(400).json({ error: '入力されたメールアドレスは既に存在します。別のメールアドレスを入力してください。'});
            }
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error posting making list' });
        } 
    }
}