import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LinkForm({ token, onLinkSaved }) {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('web');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/links`,
        { url, source, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUrl('');
      setCategory('');
      onLinkSaved(); // refresh dashboard
    } catch (err) {
      console.error('Failed to save link:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log("🚀 LinkForm deployed version!");


  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-10">
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
      <input
  type="text"
  inputMode="url"
  pattern=".*"
  placeholder="⭐Paste a link like google.com⭐"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  required
  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="web">Web</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Link'}
      </button>
    </form>
  );
}
