import asyncHandler from 'express-async-handler';
import userDb from '../models/user.js';
import bcrypt from 'bcrypt';
import { sendOTP } from '../config/nodeMailerConfig.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwtConfig.js';




  // Function to add new user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const userAvailable = await userDb.findOne({ email });
  if (userAvailable) {
    return res.status(400).json({ error: 'User already exists. Please change the email.' });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  
  // Save the user without OTP
  const userdata = await userDb.create({
    email,
    password: hashPassword,
    firstname,
    lastname,
  });

  const accessToken = generateAccessToken({ id: userdata._id });
  const refreshToken = generateRefreshToken({ id: userdata._id });

  res.setHeader('Set-Cookie', [
    `accessToken=${accessToken}; SameSite=Lax; Path=/; Max-Age=3600`,
    `refreshToken=${refreshToken}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
  ]);

  res.status(200).json({ message: 'User registered successfully', userdata });
});




  //function to login in the user

  const loginuser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userDb.findOne({ email });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        console.log('User not found')
        return;
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });
  
        res.cookie('accessToken', accessToken, {
          
          secure: true, // Change to true in production with HTTPS
          sameSite: 'None', // Change to 'None' if cross-site cookies are needed
          maxAge: 3600 * 1000, // Correcting to milliseconds (1 hour)
          domain:'',
          path: '/',
          expires: new Date(Date.now() + 900000)
        });
        
      
        res.cookie('refreshToken', refreshToken, {
          secure: true, // Change to true in production with HTTPS
          sameSite: 'None', // Change to 'None' if cross-site cookies are needed
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Correcting to a valid date object
          domain:'',
          path: '/',
          expires:new Date(Date.now() + 900000),
        });
  
        res.cookie('myCookie', 'cookieValue', {
          httpOnly: true,
          secure: false, // set to true if your site is served over HTTPS
          sameSite: 'None', // set to 'Lax' or 'Strict' as per your needs
          domain: '', // use your domain
          path: '/',
          expires: new Date(Date.now() + 900000) // expires in 15 minutes
        });
  
        res.status(200).json({ 
          token:accessToken,
          message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Wrong password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error during login' });
    }
  });

  

  export  { registerUser,  loginuser};