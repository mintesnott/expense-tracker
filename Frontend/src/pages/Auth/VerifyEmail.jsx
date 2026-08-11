import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let isMounted = true;
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing.');
                return;
            }

            try {
                const response = await axiosInstance.get(
                    `${API_PATHS.AUTH.VERIFY_EMAIL(token)}`
                );

                if (!isMounted) return;
                setStatus('success');
                setMessage(
                    response.data?.msg ||
                    'Email verified successfully. You can now log in.'
                );
            } catch (err) {

                if (!isMounted) return;
                setStatus('error');
                setMessage(
                    err.backendMessage ||
                    'This verification link is invalid or has expired.'
                );
            }
        };

        verifyEmail();

         return () => {
            isMounted = false;
        };
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">

                {status === 'verifying' && (
                    <>
                        <h2 className="text-2xl font-semibold mb-3">
                            Verifying your email...
                        </h2>

                        <p className="text-gray-500">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h2 className="text-2xl font-semibold text-green-600 mb-3">
                            Email Verified!
                        </h2>

                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                        >
                            Go to Login
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-2xl font-semibold text-red-500 mb-3">
                            Verification Failed
                        </h2>

                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                        >
                            Go to Login
                        </button>
                    </>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;