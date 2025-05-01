import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE in prod:', API_BASE);


function App() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('web');
  const [category, setCategory] = useState('');
  const [response, setResponse] = useState(null);
  const [savedLinks, setSavedLinks] = useState([]);

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/links`);
      const data = await res.json();
      setSavedLinks(data);
    } catch (err) {
      console.error('Failed to load links:', err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, source, category }),
      });
      const data = await res.json();
      setResponse(data);
      setUrl('');
      setCategory('');
      await fetchLinks(); // ✅ refresh list after submit
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans px-4 py-12">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">Link Haven</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="web">Web</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
            <input
              type="text"
              placeholder="e.g. inspiration, AI, news"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Link
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
            <p className="mb-2 font-semibold text-green-600">Link Saved ✅</p>
            <pre className="whitespace-pre-wrap break-all text-green-800">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

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

export default App;
