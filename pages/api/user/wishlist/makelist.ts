import jwt,{ JwtPayload } from 'jsonwebtoken';
import cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface DecodedToken extends JwtPayload {
    email: string;
}
  
export default async function makeList(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { user_email, list_name } = req.body

        try {
            const listExist = await prisma.favourite_list.findUnique({
                where: {
                    user_email_list_name: {
                        user_email: user_email,
                        list_name: list_name
                    }
                }
            });

            if (!listExist) {
                const result = await prisma.favourite_list.create({
                    data: {
                        user_email: user_email,
                        list_name: list_name
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
    } else {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
        const useremail = decodedToken.email;
        
        const likedLists = await prisma.favourite_list.findMany({
            where: {
                user_email: useremail,
            }
        })
        res.json(likedLists)
    }
}
