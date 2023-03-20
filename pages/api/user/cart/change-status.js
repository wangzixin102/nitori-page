import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function changeStatus(req, res) {
    if (req.method === 'POST') {
        const { user_email, sku_id, status} = req.body

        try {
            const result = await prisma.cart.update({
                where: {
                    user_email_sku_id: {
                        user_email: user_email,
                        sku_id: sku_id
                    }
                },
                data: {
                    status: status
                }
            })
            res.status(200).json({ message: 'status changed successfully' });
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error deleting products' });
        } 
    }
}