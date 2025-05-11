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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load & filter
  useEffect(() => { fetchLinks(); }, []);
  useEffect(() => {
    if (selectedCategory === 'All') setLinksByCategory(savedLinks);
    else if (selectedCategory === 'Uncategorized')
      setLinksByCategory(savedLinks.filter(l => !l.category));
    else
      setLinksByCategory(savedLinks.filter(l => l.category === selectedCategory));
  }, [savedLinks, selectedCategory]);

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedLinks(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const uniqueCats = Array.from(
    new Set(savedLinks.map(l => l.category).filter(Boolean))
  );
  const categories = ['All', ...uniqueCats, 'Uncategorized'];

  const formatDate = iso =>
    new Date(iso).toLocaleDateString('en-US');

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8">
          <button
            className="absolute left-0 md:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-gray-600 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-600 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-600" />
          </button>

          <h1 className="text-4xl font-extrabold text-indigo-600">Link Haven</h1>

          <button
            onClick={handleLogout}
            className="absolute right-0 text-sm text-gray-500 hover:text-gray-700"
          >
            Log out
          </button>
        </div>

        {/* Categories + Form wrapper */}
        <div className="relative mb-12">
          {/* Categories – absolutely removed from flow */}
          <aside
            className={`absolute inset-y-0 left-0 w-1/2 max-w-xs p-4 bg-white overflow-y-auto z-50 transform transition-transform ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 md:w-[15%] md:max-w-none md:bg-transparent md:overflow-visible`}
          >
            <div className="flex items-center justify-between mb-4 md:block">
              <h2 className="text-lg font-semibold text-gray-700">Categories</h2>
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileMenuOpen(false);
                    }}
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
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Form – in normal flow, centered in parent */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-sm pt-8 pb-4 px-6 w-full md:w-2/3">
              <LinkForm token={token} onLinkSaved={fetchLinks} />
            </div>
          </div>
        </div>

        {/* Timeline – directly under the form, same centering */}
        <div className="w-full md:w-2/3 mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Timeline</h2>
          <div className="relative pl-8">
            <div className="absolute top-2 left-4 h-full w-px bg-gray-300" />
            <ul className="space-y-8">
              {linksByCategory.map(link => (
                <li key={link._id} className="relative">
                  <span className="absolute -left-[3px] top-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm" />
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
      </div>
    </div>
  );
}
