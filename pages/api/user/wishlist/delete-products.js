import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function deleteProdut(req, res) {
    if (req.method === "POST") {
        const { data, user_email } = req.body
        const skuIds = data.map((product) => product.sku_id);

        try {
            const result = await prisma.favourite_products.deleteMany({
                where: {
                    user_email: user_email,
                    sku_id: { in: skuIds }
                }
            });
            res.status(200).json({ message: 'products delete successfully' });
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error deleting products' });
        } 
    }
}