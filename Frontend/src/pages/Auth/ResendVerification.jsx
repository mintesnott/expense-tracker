import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { validateEmail, getEmailValidationError } from '../../utils/helper';

const ResendVerification = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleResendVerification = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (!validateEmail(email)) {
            setError(getEmailValidationError(email));
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post(
                API_PATHS.AUTH.RESEND_VERIFICATION,
                { email }
            );

            setMessage(response.data?.msg);
            setCooldown(60);
        } catch (err) {
            setError(
                err.backendMessage ||
                'Unable to send verification email. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">

                <h3 className="text-xl font-semibold text-black">
                    Verify Your Email
                </h3>

                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Enter your email address and we'll send you a new
                    verification link.
                </p>

                <form onSubmit={handleResendVerification}>

                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="melos@example.com.et"
                        type="text"
                    />

                    {error && (
                        <p className="text-red-500 text-xs pb-2.5">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="text-green-600 text-xs pb-2.5">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || cooldown > 0}
                    >
                       {loading
                            ? 'Sending...'
                            : cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : 'RESEND VERIFICATION EMAIL'
                        }
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Remember your password?{" "}
                        <Link
                            className="font-medium text-primary underline"
                            to="/login"
                        >
                            Login
                        </Link>
                    </p>

                    <p className="text-[13px] text-slate-800 mt-2">
                        Don't have an account?{" "}
                        <Link
                            className="font-medium text-primary underline"
                            to="/signup"
                        >
                            SignUp
                        </Link>
                    </p>

                </form>
            </div>
        </AuthLayout>
    );
};

export default ResendVerification;