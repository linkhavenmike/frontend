import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LinkForm from '../components/LinkForm.jsx';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [savedLinks, setSavedLinks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [linksByCategory, setLinksByCategory] = useState([]);

  // Fetch links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  // Filter links by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setLinksByCategory(savedLinks);
    } else if (selectedCategory === 'Uncategorized') {
      setLinksByCategory(savedLinks.filter((l) => !l.category));
    } else {
      setLinksByCategory(savedLinks.filter((l) => l.category === selectedCategory));
    }
  }, [savedLinks, selectedCategory]);

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
    logout();
    navigate('/login');
  };

  // Build category list with 'Uncategorized' at end
  const uniqueCategories = Array.from(
    new Set(savedLinks.map((l) => l.category).filter(Boolean))
  );
  const categories = ['All', ...uniqueCategories, 'Uncategorized'];

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative">

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 p-4 h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-9 bg-white rounded-lg shadow-sm p-8">
          <div className="relative flex flex-col items-center md:flex-row md:justify-center mb-8">
            <h1 className="text-4xl font-extrabold text-indigo-600">Link Haven</h1>
            <button
              onClick={handleLogout}
              className="mt-2 md:mt-0 md:absolute md:right-0 text-sm text-gray-500 hover:text-gray-700"
            >
              Log out
            </button>
          </div>

          <LinkForm token={token} onLinkSaved={fetchLinks} />

          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Timeline</h2>
            <div className="relative pl-8">
              <div className="absolute top-2 left-4 h-full w-px bg-gray-300"></div>
              <ul className="space-y-8">
                {linksByCategory.map((link) => (
                  <li key={link._id} className="relative">
                    <span className="absolute -left-[3px] top-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm"></span>
                    <div className="pl-8">
                      <div className="text-xs text-gray-600 mb-1" style={{ fontSize: '10pt' }}>
                        {formatDate(link.createdAt || link.date)}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:underline break-words"
                      >
                        {link.url}
                      </a>
                      <div className="text-sm text-gray-500 mt-1 flex space-x-2">
                        <span className="italic">{link.category || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{link.source}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
