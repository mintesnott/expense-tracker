
import express from 'express'

import { protect } from '../middleware/authMiddleware.js'

import upload from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/imageController.js';


import {
    registerUser,
    loginUser,
    getUserInfo,
    verifyEmail,
    resendVerificationEmail,
    updateUser,
    changePassword,
    updateProfileImage,
} from '../controllers/authController.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/resend-verification', resendVerificationEmail);
router.post('/upload-image', upload.single('image'), uploadImage);

router.get('/verify-email', verifyEmail);
router.get('/get-user', protect, getUserInfo);

router.patch('/update-profile', protect, updateUser);
router.patch('/change-password', protect, changePassword);
router.patch('/update-profile-image',protect,upload.single('image'), updateProfileImage );







export default router;
//authRoutes