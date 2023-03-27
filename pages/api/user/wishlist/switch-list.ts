import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function changeListName(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { user_email, old_list_name, new_list_name } = req.body

        try {
            const listExist = await prisma.favourite_list.findUnique({
                where: {
                    user_email_list_name: {
                        user_email: user_email,
                        list_name: new_list_name
                    }
                }
            });

            if (!listExist) {
                const result = await prisma.favourite_list.update({
                    where: {
                        user_email_list_name: {
                            user_email: user_email,
                            list_name: old_list_name    
                        }
                    },
                    data: {
                        user_email: user_email,
                        list_name: new_list_name
                    },
                });

                const result2 = await prisma.favourite_products.updateMany({
                    where: {
                        user_email: user_email,
                        list_name: old_list_name    
                    },
                    data: {
                        user_email: user_email,
                        list_name: new_list_name
                    },
                });
                res.status(200).json({ message: 'list changed successfully' });
            } else {
                res.status(400).json({ error: '入力された名前のお気に入り商品リストは既に存在します。別の名前を入力してください。'});
            }
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error posting making list' });
        } 
    }
}