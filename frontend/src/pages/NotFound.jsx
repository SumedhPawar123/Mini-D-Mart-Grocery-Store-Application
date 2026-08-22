import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center py-24">
    <p className="text-5xl mb-4">404</p>
    <p className="text-gray-500 mb-4">Page not found.</p>
    <Link to="/" className="text-brand font-medium">Go back home</Link>
  </div>
);

export default NotFound;
