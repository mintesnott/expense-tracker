import User from '../models/User.js'
import crypto from 'crypto';

import sendEmail from '../utils/sendEmail.js';

import { StatusCodes } from 'http-status-codes';
import {
      CustomAPIError,
      BadRequestError,
      UnauthenticatedError,
} from '../errors/index.js'

//verify email
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        throw new BadRequestError('Verification token is required');
    }

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
        throw new BadRequestError(
            'Invalid or expired verification link'
        );
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Email verified successfully. You can now log in.',
    });
};

const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new BadRequestError('Please provide your email address');
    }

    const user = await User.findOne({ email });

    // Don't reveal whether an email exists
    if (!user) {
        return res.status(StatusCodes.OK).json({
            msg: 'If an account exists with this email, a verification email has been sent.',
        });
    }

    // Already verified
    if (user.isVerified) {
        return res.status(StatusCodes.OK).json({
            msg: 'An email is already Verified.',
        });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires =new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save();

    const verificationLink =
        `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
        to: user.email,
        subject: 'Verify your Expense Tracker account',
        html: `
            <h2>Welcome, ${user.fullName}!</h2>

            <p>
                Here is your new email verification link.
            </p>

            <p>
                <a
                    href="${verificationLink}"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background-color: #7c3aed;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                    "
                >
                    Verify Email
                </a>
            </p>

            <p>
                This link will expire in 24 hours.
            </p>
        `,
    });

    res.status(StatusCodes.OK).json({
        msg: 'If an account exists with this email, a verification email has been sent.',
    });
};

//Register User
const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

     const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
        throw new BadRequestError('Email is already registered');
    } 
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!passwordRegex.test(password)) {
            throw new BadRequestError(
                'Password must be at least 8 characters and contain at least one uppercase letter, one number, and one special character'
            );
        }
      //Let mongoose create the user if it's not found a
    let user = existingUser;

    if (!user) {
        user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });
    } else {
        user.fullName = fullName;
        user.password = password;
        user.profileImageUrl = profileImageUrl;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verificationLink = 
         `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    await sendEmail({
        to: user.email,
        subject: 'Verify your Expense Tracker account',
        html: `
            <h2>Welcome, ${user.fullName}!</h2>

            <p>
                Thank you for creating an account with Expense Tracker.
            </p>

            <p>
                Please verify your email address by clicking the button below:
            </p>

            <p>
                <a
                    href="${verificationLink}"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background-color: #7c3aed;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                    "
                >
                    Verify Email
                </a>
            </p>

            <p>
                This verification link will expire in 24 hours.
            </p>

            <p>
                If you did not create this account, you can safely ignore this email.
            </p>
        `,
    });

    // 3. Send successful response
    res.status(StatusCodes.CREATED).json({
        msg: 'Registration successful. Please check your email to verify your account.',
    });

};

//Login User
const loginUser =  async (req, res) => { 
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email });

    if(!user) {
        throw new UnauthenticatedError('It seems you are not registered yet');
    }
    if (!user.isVerified) {
    throw new UnauthenticatedError(
        'Please verify your email before logging in'
    );
}

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Incorrect Password');
    }

    //response
    const token = user.createJWT();
    res
       .status(StatusCodes.OK)
       .json({
        id: user._id,
        user,
        token,
       })
};

//Get user's info
const getUserInfo = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if(!user) {
        const error = new Error('There is no user with the given Id');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
    }

    res.status(StatusCodes.OK).json(user); 
};

//update profile
const updateUser = async (req, res) => {
    const { fullName, email, profileImageUrl } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new BadRequestError('User not found');
    }

    if (fullName !== undefined) {
        user.fullName = fullName;
    }

    if (profileImageUrl !== undefined) {
        user.profileImageUrl = profileImageUrl;
    }

    // Email change
    let emailChanged = false;
    if (email !== undefined && email !== user.email) {
        emailChanged = true;
        const existingUser = await User.findOne({
            email,
            _id: { $ne: user._id }
        });

        if (existingUser) {
            throw new BadRequestError(
                'This email is already registered'
            );
        }

        user.email = email;
        user.isVerified = false;

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpires =
            new Date(Date.now() + 24 * 60 * 60 * 1000);

        const verificationLink =
            `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        await sendEmail({
            to: email,
            subject: 'Verify your new email address',
            html: `
                <h2>Email Address Changed</h2>

                <p>Hello ${user.fullName},</p>

                <p>
                    You changed the email address associated with
                    your Expense Tracker account.
                </p>

                <p>
                    Please verify your new email address:
                </p>

                <p>
                    <a
                        href="${verificationLink}"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background-color: #7c3aed;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                        "
                    >
                        Verify New Email
                    </a>
                </p>

                <p>
                    This verification link will expire in 24 hours.
                </p>
            `,
        });
    }

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: emailChanged
            ? 'Profile updated. Please verify your new email address.'
            : 'Profile updated successfully.',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            isVerified: user.isVerified,
        }
    });
};

//change Password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new BadRequestError(
            'Please provide your current and new password'
        );
    }

    // At least 8 characters, 1 uppercase, 1 number, 1 special character
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        throw new BadRequestError(
            'New password must be at least 8 characters and contain at least one uppercase letter, one number, and one special character'
        );
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new UnauthenticatedError('User not found');
    }

    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordCorrect) {
        throw new BadRequestError('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
        throw new BadRequestError(
            'New password must be different from your current password'
        );
    }

    user.password = newPassword;
    user.tokenVersion += 1;

    await user.save();

    res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Password changed successfully',
    });
};

//change profile picture
const updateProfileImage = async (req, res) => {
    if (!req.file) {
        throw new BadRequestError('Please upload an image');
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new UnauthenticatedError('User not found');
    }

    const imageUrl =
        `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    user.profileImageUrl = imageUrl;

    await user.save();

    res.status(StatusCodes.OK).json({
        msg: 'Profile picture updated successfully',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            isVerified: user.isVerified,
        }
    });
};

export {
    registerUser,
    loginUser,
    getUserInfo,
    verifyEmail,
    resendVerificationEmail,
    updateUser,
    changePassword,
    updateProfileImage
}


