import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function cartData(req, res) {
    if (req.method === 'POST') {
        const { product_id, user_email, sku_imgUrl, sku_subname, 
            sku_price, sku_id, selection, order_method, amount } = req.body;
            console.log("req.body", req.body)
        try {
            const productExist = await prisma.cart.findUnique({
                where: {
                    user_email_sku_id: {
                        user_email: user_email,
                        sku_id: sku_id
                    }
                }
            });

            if (!productExist) {
                const result = await prisma.cart.create({
                    data: {
                        user_email: user_email,
                        product_id: product_id,
                        sku_id: sku_id,
                        sku_subname: sku_subname,
                        selection: selection,
                        price: sku_price,
                        imgUrl: sku_imgUrl,
                        order_method: order_method,
                        amount: parseInt(amount),
                        status: "カート"
                    }
                })
                res.status(200).json({ message: 'added product successfully' });
            } else {
                const result2 = await prisma.cart.update({
                    where: {
                        user_email_sku_id: {
                            user_email: user_email,
                            sku_id: sku_id
                        }
                    },
                    data: {
                        amount: {
                            increment: parseInt(amount)
                        }
                    }
                })
                res.status(200).json({ message: 'updated product successfully' });
            }
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error posting review' });
        }
    } else {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const useremail = decodedToken.email;
    
        const addedProducts = await prisma.cart.findMany({
            where: {
                user_email: useremail,
            }
        })
        res.json(addedProducts)
    }
}
