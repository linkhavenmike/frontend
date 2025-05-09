import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SmsOptIn() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/twilio/opt-in`, { phone });
      setStatus('Successfully opted in for SMS updates!');
    } catch (err) {
      console.error(err);
      setStatus('Failed to opt in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">SMS Opt-In</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? 'Opting in...' : 'Opt In via SMS'}
          </button>
          {status && <p className="text-center text-sm text-gray-600">{status}</p>}
        </form>
      </div>
    </div>
  );
}
