import crypto from 'crypto'; 
import bcrypt from 'bcrypt'; 
import User from './../model/user.model.js'; 
import sendEmail from '../utils/sendEmail.js'; 

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Use environment variable here
        const resetUrl = `${process.env.FRONTEND_URL}/ResetPassword/${resetToken}`;
        
        const message = `
            You requested a password reset. Click the link below to reset your password:
            ${resetUrl}
            If you did not request this, please ignore this email.
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message,
            });

            res.status(200).json({ success: true, message: 'Reset link sent to your email.' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, message: 'Failed to send email. Try again later.' });
        }
    } catch (error) {
        console.error('Forgot Password Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error. Try again later.' });
    }
};
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful.' });
    } catch (error) {
        console.error('Reset Password Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error. Try again later.' });
    }
};
