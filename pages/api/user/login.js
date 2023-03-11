import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import * as yup from 'yup';

const prisma = new PrismaClient();

const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
});

export default async function Login(req, res) {
    if (req.method === 'POST') {
        cookieParser()(req, res, () => {});
        
        const { email, password } = await loginSchema.validate(req.body);
                
        try {
            const user = await prisma.user.findUnique({
                where: {email}
            });

            if (!user) {
                return res.status(401).json({ message: 'Invalid user' })
            };
            try {
                const passwordMatch = await bcrypt.compare(password,user.password);
                console.log ("result", passwordMatch)
                if (!passwordMatch) {
                    res.status(401).json({ message: 'Invalid login credentials' });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Server error' });
            }
            
            const token = jwt.sign(
                { email: user.email, username: user.username }, 
                process.env.JWT_SECRET, 
                {expiresIn: '7d'}
            );
            
            res.setHeader(
                'Set-Cookie',
                cookie.serialize('token', token, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'development',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                })
            );
            console.log('Set-Cookie header:', res.getHeader('Set-Cookie'));

            res.status(200).json({ user: { username: user.username, email: user.email }, token });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    } else if (req.method === 'GET' && req.url === '/api/user/login') {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;
      
        if (!token) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
      
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          const user = { email: decodedToken.email, username: decodedToken.username };
          res.status(200).json({ user });
        } catch (error) {
          res.status(401).json({ message: 'Unauthorized' });
        }
    }
}
