import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthConfirm = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') || '/';

      console.log('Auth confirmation params:', { token_hash: token_hash?.substring(0, 10), type, next });

      if (!token_hash || !type) {
        console.error('Missing required parameters for auth confirmation');
        setStatus('error');
        setMessage('Invalid confirmation link. Missing required parameters.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          console.error('Auth confirmation error:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to confirm email. Please try again.');
          return;
        }

        console.log('Auth confirmation successful:', data);
        setStatus('success');
        setMessage('Email confirmed successfully! Redirecting...');

        setTimeout(() => {
          navigate(next, { replace: true });
        }, 2000);

      } catch (err) {
        console.error('Unexpected error during auth confirmation:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthConfirm();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <main className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Confirming your email...</h1>
          <p className="text-gray-600">Please wait while we verify your email address.</p>
        </div>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-700">Email Confirmed!</h1>
          <p className="text-gray-600">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16 max-w-lg mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-700">Confirmation Failed</h1>
        <p className="text-gray-600">{message}</p>
        <button 
          onClick={() => navigate('/register')} 
          className="btn bg-red-600 hover:bg-red-700 text-white"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
