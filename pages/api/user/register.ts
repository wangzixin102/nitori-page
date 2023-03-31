import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import * as yup from 'yup';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

async function hashPassword(password: string | Buffer) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const registerSchema = yup.object().shape({
    username: yup.string().required().min(3).max(20),
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
});
 
export default async function RegisterController(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST') {
        cookieParser()(req as any, res as any, () => {});

        const { username, email, password } = await registerSchema.validate(req.body);
        console.log('111111111', req.body);
        
        try {
            const userExists = await prisma.user.findUnique({
                where: { email },
            });

            if (userExists) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        
            const hashedPassword = await hashPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });

            const result = await prisma.favourite_list.create({
                data: {
                    user_email: email,
                    list_name: "お気に入り商品"
                }
            })
            
            const token = jwt.sign(
                { username, email }, 
                "qwertyuiopasdfghjklzxcvbnm1234567890", 
                {expiresIn: '7d'}
            );
            console.log('tokennnn', token);
    
            res.setHeader(
                'Set-Cookie',
                cookie.serialize('token', token, {
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                })
            ); res.status(201).json({
                message: 'User registered successfully',
                user: { user: newUser.username, email: newUser.email },
            });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        } 
    }
}