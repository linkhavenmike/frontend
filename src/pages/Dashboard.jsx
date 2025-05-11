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

  useEffect(() => {
    fetchLinks();
  }, []);

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

  // derive unique categories
  const categories = ['All', ...Array.from(new Set(savedLinks.map(link => link.category || 'Uncategorized')))];

  // filter links by category
  const filteredLinks = selectedCategory === 'All'
    ? savedLinks
    : savedLinks.filter(link => (link.category || 'Uncategorized') === selectedCategory);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r overflow-y-auto">        
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-indigo-600">Categories</h2>
        </div>
        <nav className="px-2 pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-4 py-2 rounded-md mb-1 focus:outline-none hover:bg-indigo-50 transition 
                ${selectedCategory === cat ? 'bg-indigo-100 font-semibold' : 'text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 text-sm text-gray-500 hover:text-gray-700"
        >
          Log out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">Link Haven</h1>

        <div className="mb-8">
          <LinkForm token={token} onLinkSaved={fetchLinks} />
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Timeline</h2>
          <ul className="relative border-l-2 border-gray-200">
            {filteredLinks.map(link => (
              <li key={link._id} className="mb-8 ml-6">
                <span className="absolute -left-3 top-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span>
                <div className="bg-white p-4 rounded-lg shadow-sm">
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
        </section>
      </main>
    </div>
  );
}
