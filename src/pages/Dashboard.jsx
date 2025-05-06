import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkForm from '../components/LinkForm.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [savedLinks, setSavedLinks] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchLinks();
    }
  }, [token]);

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSavedLinks(data);
    } catch (err) {
      console.error('Failed to load links:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans px-4 py-12">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">Link Haven</h1>

        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 text-sm text-gray-500 hover:text-gray-700"
        >
          Log out
        </button>

        {/* 🔁 Use shared LinkForm here */}
        <LinkForm token={token} onLinkSaved={fetchLinks} />

        {/* ✅ Display saved links */}
        {savedLinks.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Links</h2>
            <ul className="space-y-3">
              {savedLinks.map((link) => (
                <li
                  key={link._id}
                  className="bg-gray-100 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-start"
                >
                  <div className="w-full">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-medium hover:underline break-words"
                    >
                      {link.url}
                    </a>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="italic">{link.category || 'Uncategorized'}</span> • {link.source}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
