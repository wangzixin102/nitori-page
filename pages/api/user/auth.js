import login from './login';
import verifyToken from './verifyToken';

export default async function Auth(req, res) {
  if (req.method === 'POST' && req.url === '/api/user/login') {
    await login(req, res);
  } else if (req.method === 'GET' && req.url === '/api/user/verifyToken') {
    await verifyToken(req, res);
  } else {
    res.status(404).end();
  }
}
