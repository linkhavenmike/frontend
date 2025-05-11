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
      filtered = savedLinks.filter(l => !l.category);
    } else if (selectedCategory !== 'All') {
      filtered = savedLinks.filter(l => l.category === selectedCategory);
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
    new Set(savedLinks.map(l => l.category).filter(Boolean))
  );
  const categories = ['All', ...uniqueCats, 'Uncategorized'];

  const formatDate = iso =>
    new Date(iso).toLocaleDateString('en-US');

  // Group by date
  const groupedLinks = linksByCategory.reduce((acc, link) => {
    const d = formatDate(link.createdAt || link.date);
    if (!acc[d]) acc[d] = [];
    acc[d].push(link);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto relative">
        {/* …header & sidebar omitted for brevity… */}

        {/* Content column */}
        <div className="md:flex-1 flex flex-col items-center">
          {/* …form omitted… */}

          {/* Timeline */}
          <div className="w-full md:w-2/3 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Timeline
            </h2>
            <div className="relative">
              {/* continuous vertical line */}
              <div className="absolute left-24 top-0 bottom-0 w-px bg-gray-300" />

              <div className="space-y-6">
                {Object.entries(groupedLinks).map(([date, links]) =>
                  links.map((link, idx) => (
                    <div key={link._id} className="space-y-1">
                      {/* Row: date, dot, link on same baseline */}
                      <div className="flex items-center">
                        <div className="w-24 text-sm font-semibold text-gray-600">
                          {idx === 0 ? date : ''}
                        </div>
                        <span className="w-4 h-4 bg-indigo-600 rounded-full flex-shrink-0 mx-4" />
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:underline break-words"
                        >
                          {new URL(link.url).hostname}
                        </a>
                      </div>

                      {/* Category & source, indented under the link */}
                      <div className="flex items-center text-sm text-gray-500 space-x-2 ml-28">
                        <span className="italic">
                          {link.category || 'Uncategorized'}
                        </span>
                        <span>•</span>
                        <span>{link.source}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
