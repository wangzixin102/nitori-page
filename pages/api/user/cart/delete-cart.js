import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function deleteList(req, res) {
    if (req.method === "POST") {
        const { user_email, sku_id } = req.body

        try {
            const result = await prisma.cart.delete({
                where: {
                    user_email_sku_id: {
                        user_email: user_email,
                        sku_id: sku_id
                    },
                },
            });
            res.status(200).json({ message: 'products delete successfully' });
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error deleting products' });
        } 
    }
}