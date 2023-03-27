import jwt,{ JwtPayload } from 'jsonwebtoken';
import cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface DecodedToken extends JwtPayload {
    email: string;
}

export default async function getLikedData(req: NextApiRequest, res: NextApiResponse) {    
    if (req.method === 'POST') {
        const { product_id, user_email, sku_imgUrl, sku_subname, sku_price, sku_id, selection } = req.body;
        try {
            const likedExist = await prisma.favourite_products.findUnique({
                where: {
                    user_email_sku_id: {
                        user_email: user_email,
                        sku_id: sku_id,
                    }
                }
            });

            if (!likedExist) {
                const result = await prisma.favourite_products.create({
                    data: {
                        product_id: product_id,
                        user_email: user_email,
                        sku_imgUrl: sku_imgUrl.imgUrl,
                        sku_subname: sku_subname,
                        sku_price: sku_price,
                        sku_id: sku_id,
                        selection: selection,
                        list_name: "お気に入り商品"
                    },
                });
                res.status(200).json({ message: 'liked successfully' });
            }
        } catch (error) {
            console.log('aaaaaaa', error)
            res.status(500).json({ message: 'Error posting review' });
        } 
    } else {
        const productId = req.query.id as string;

        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
        const useremail = decodedToken.email;
    
        const likedProducts = await prisma.favourite_products.findMany({
            where: {
                user_email: useremail,
                product_id: productId
            }
        })
        res.json(likedProducts)
    }
}
