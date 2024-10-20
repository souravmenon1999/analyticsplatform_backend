import express from 'express';
import {verifyUser} from '../middlewares/authMiddleware.js';
import { fetchData } from '../controller/dataController.js';

const router = express.Router();

// Define the GET route for fetching data
router.get('/',verifyUser,fetchData);

export default router;
