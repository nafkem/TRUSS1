import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-4">Page Not Found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-orange-500 text-white rounded hover:opacity-90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
