import jwt, { JwtPayload } from 'jsonwebtoken';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

interface DecodedToken extends JwtPayload {
  email: string;
  username: string;
}

export default async function verifyToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, "qwertyuiopasdfghjklzxcvbnm1234567890") as DecodedToken;
    const user = { email: decodedToken.email, username: decodedToken.username };

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
