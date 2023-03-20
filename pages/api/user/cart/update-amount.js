import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function updateAmount(req, res) {
    if (req.method === 'POST') {
        const { data } = req.body
        try {
            const result = await prisma.cart.update({
                where: {
                    user_email_sku_id: {
                        user_email: data.user_email,
                        sku_id: data.sku_id
                    }
                },
                data: {
                    amount: data.amount
                }
            })
            res.status(200).json({ message: 'amount updated successfully' });
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error deleting products' });
        } 
    }
}