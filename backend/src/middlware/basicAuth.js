export default function basicAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    const envUser = process.env.AUTH_USER || '';
    const envPass = process.env.AUTH_PASS || '';

    if (!envUser || !envPass) {
      // If no credentials are configured, deny access for safety
      res.set('WWW-Authenticate', 'Basic realm="Restricted"');
      return res.status(401).json({ success: false, message: 'Authentication not configured on server' });
    }

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.set('WWW-Authenticate', 'Basic realm="Restricted"');
      return res.status(401).json({ success: false, message: 'Missing Authorization header' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [user, pass] = credentials.split(':');

    if (user === envUser && pass === envPass) {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Restricted"');
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Auth middleware error' });
  }
}
