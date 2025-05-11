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

  // Fetch & filter
  useEffect(() => { fetchLinks(); }, []);
  useEffect(() => {
    let filtered = savedLinks;
    if (selectedCategory === 'Uncategorized') {
      filtered = savedLinks.filter((l) => !l.category);
    } else if (selectedCategory !== 'All') {
      filtered = savedLinks.filter((l) => l.category === selectedCategory);
    }
    setLinksByCategory(filtered);
  }, [savedLinks, selectedCategory]);

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedLinks(await res.json());
    } catch (err) {
      console.error('Failed to load links:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const uniqueCats = Array.from(
    new Set(savedLinks.map((l) => l.category).filter(Boolean))
  );
  const categories = ['All', ...uniqueCats, 'Uncategorized'];

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US');

  // Group links by date
  const groupedLinks = linksByCategory.reduce((acc, link) => {
    const d = formatDate(link.createdAt || link.date);
    if (!acc[d]) acc[d] = [];
    acc[d].push(link);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          className="relative flex items-center justify-center mb-8
                     w-full md:w-[85%] md:ml-[15%]"
        >
          <button
            className="absolute left-0 md:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="block w-6 h-0.5 bg-gray-600 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-600 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-600" />
          </button>

          <h1 className="text-4xl font-extrabold text-indigo-600">
            Link Haven
          </h1>

          <button
            onClick={handleLogout}
            className="absolute right-0 text-sm text-gray-500 hover:text-gray-700"
          >
            Log out
          </button>
        </div>

        {/* Main */}
        <div className="relative mb-12 md:flex md:items-start">
          {/* Sidebar */}
          <aside
            className={
              `fixed inset-y-0 left-0 w-1/2 h-full p-4 bg-white overflow-y-auto z-50
               transform transition-transform ` +
              (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') +
              ` md:relative md:translate-x-0 md:inset-auto md:left-auto
                 md:w-[15%] md:h-auto md:bg-transparent md:overflow-visible
                 md:transform-none`
            }
          >
            <div className="flex items-center justify-between mb-4 md:block">
              <h2 className="text-lg font-semibold text-gray-700">
                Categories
              </h2>
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2">
              {categories.map((cat) => (
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
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Content column */}
          <div className="md:flex-1 flex flex-col items-center">
            {/* Form */}
            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-lg shadow-sm pt-8 pb-4 px-6">
                <LinkForm token={token} onLinkSaved={fetchLinks} />
              </div>
            </div>

            {/* Timeline */}
            <div className="w-full md:w-2/3 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Timeline
              </h2>
              <div className="space-y-8">
                {Object.entries(groupedLinks).map(([date, links]) => (
                  <div key={date} className="space-y-4">
                    {links.map((link, idx) => (
                      <div key={link._id} className="flex items-center">
                        {/* Date only on first entry */}
                        <div className="w-24 text-sm font-semibold text-gray-600">
                          {idx === 0 ? date : ''}
                        </div>

                        {/* Vertical line segment */}
                        <div className="w-px h-5 bg-gray-300 mx-4" />

                        {/* Dot */}
                        <div className="w-4 h-4 bg-indigo-600 rounded-full mr-4 flex-shrink-0" />

                        {/* Link */}
                        <div className="flex-1">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-indigo-600 hover:underline break-words"
                          >
                            {new URL(link.url).hostname}
                          </a>
                          <div className="text-sm text-gray-500 mt-1 flex space-x-2">
                            <span className="italic">
                              {link.category || 'Uncategorized'}
                            </span>
                            <span>•</span>
                            <span>{link.source}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
