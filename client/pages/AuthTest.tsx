import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function testSignUp() {
    setLoading(true);
    setMessage('');
    
    console.log('🔍 Testing signup with:', { email, password });
    console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔑 API Key preview:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('❌ Signup error:', error);
        setMessage(`Error: ${error.message} (${error.status})`);
      } else {
        console.log('✅ Signup success:', data);
        setMessage(`Success: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err);
      setMessage(`Unexpected error: ${err.message}`);
    }
    
    setLoading(false);
  }

  async function testGetSession() {
    setLoading(true);
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setMessage(`Session error: ${error.message}`);
      } else {
        setMessage(`Session: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setMessage(`Session test error: ${err.message}`);
    }
    
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Auth Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <button
            onClick={testSignUp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Sign Up'}
          </button>
          
          <button
            onClick={testGetSession}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Test Get Session
          </button>
        </div>
        
        {message && (
          <div className="p-3 bg-gray-100 rounded-md">
            <pre className="text-xs whitespace-pre-wrap">{message}</pre>
          </div>
        )}
      </div>
    </div>
  );
}