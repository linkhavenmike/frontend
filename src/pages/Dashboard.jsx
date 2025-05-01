import LinkForm from '../components/LinkForm';

export default function Dashboard({ token, links, refreshLinks, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex items-start justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Link Haven</h1>
          <button
            onClick={onLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
          >
            Log out
          </button>
        </div>

        <LinkForm token={token} links={links} refreshLinks={refreshLinks} />
      </div>
    </div>
  );
}
