import type { Request, Response, NextFunction  } from 'express';
import jwt from 'jsonwebtoken';

// Create a middleware function to verify JWT tokens
function authorize(req: Request, res: Response, next: NextFunction) {
  // make sure there is an authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    // get the token from the header
    const token = authHeader.split(' ')[1] || "";
    // check for validity
    // @ts-ignore
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          //stop the request if the token is invalid
          return res.status(403).json({ message: 'Forbidden' });
        }
        // set a copy of the user info from the token into locals so we can see it in the app.
        res.locals.user = user;
        next();
     
    } );
  } else {
    // stop the request if the token is missing
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export default authorize;