import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function deleteList(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { user_email, list_name } = req.body

        try {
            const result = await prisma.favourite_list.delete({
                where: {
                    user_email_list_name: {
                        user_email: user_email,
                        list_name: list_name
                    },
                },
            });

            const result2 = await prisma.favourite_products.deleteMany({
                where: {
                    user_email:user_email,
                    list_name: list_name                
                }
            });
            res.status(200).json({ message: 'products delete successfully' });
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error deleting products' });
        } 
    }
}