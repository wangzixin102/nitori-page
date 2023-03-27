import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function makeOrders(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { productData, user_email } = req.body
        const amount = Number(productData.amount);
        const price = Number(productData.sku_price);
        const priceResult = Number.isNaN(amount) || Number.isNaN(price) ? null : amount * price;

        try {

            const result = await prisma.user_order_table.create({
                data: {
                    user_email: user_email,
                    product_id: productData.product_id,
                    product_subname: productData.product_subname,
                    selection: productData.selection,
                    order_date: productData.order_date,
                    imgUrl: productData.sku_imgUrl,
                    order_id: productData.order_id,
                    status: "受注済",
                    amount: productData.amount,
                    set_up: 1,
                    pick_up: 1,
                    price: priceResult
                }
            })

            const result2 = await prisma.cart.deleteMany({
                where: {
                    user_email: user_email,
                    sku_id: productData.sku_id
                }
            });
            res.status(200).json({ message: 'added product successfully' });
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error deleting products' });
        } 
    }
}