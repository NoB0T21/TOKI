import jwt from 'jsonwebtoken'
import {OAuth2Client} from 'google-auth-library'
import { NextFunction, Request, Response } from 'express'
import { findUser } from '../services/user.service';

const client = new OAuth2Client(process.env.GOOGLE_ID)

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Access Token required' });
    return;
  }
  const authHeader1 = req.headers.cookie
  let accessToken = authHeader.split(' ')[1];
  if(authHeader1 && !accessToken){
    accessToken = authHeader1.split('=')[1].split(';')[0]
  }
  try {
    const user = jwt.verify(accessToken, process.env.SECRET_KEY || 'default');
    req.user = user;
    next();
  } catch (err) {
    try {
      const googleInfo = await client.getTokenInfo(accessToken);
      const existingUsers = await findUser({email:googleInfo.email})
      req.user = existingUsers;
      next();
    } catch (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  }
};
export default middleware;