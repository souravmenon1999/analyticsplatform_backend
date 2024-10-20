import jwt from 'jsonwebtoken';
import expressAsyncHandler from "express-async-handler";

export const verifyUser = expressAsyncHandler(async (req, res, next) => {
    const cookieString = req.headers.cookie; // Corrected 'cookies' to 'cookie'
    const cookieArray = cookieString.split('; ');
    const cookieObject = {};
    
  
    cookieArray.forEach(cookie => {
      const [key, value] = cookie.split('=');
      cookieObject[key] = value;
    });


       const token = cookieObject.accessToken;

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      

      // Verify the token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        
        next();
      });
    
});

 // Use named export for easier imports

 