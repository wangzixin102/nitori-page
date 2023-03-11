import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function verifyToken(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = { email: decodedToken.email, username: decodedToken.username };

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
