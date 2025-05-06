import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans px-4 py-12">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
          Welcome to Link Haven
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline"
          >
            Don’t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
