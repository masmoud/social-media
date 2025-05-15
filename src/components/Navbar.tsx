import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGitHub, signOut } = useAuth();
  const displayName =
    user?.user_metadata.user_name.charAt(0).toUpperCase() +
      user?.user_metadata.user_name.slice(1) || user?.email;
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={"/"} className="font-mono text-xl font-bold text-white" onClick={closeMenu}>
            social<span className="text-purple-500">.media</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center space-x-6">
            {["/", "/create", "/communities", "/community/create"].map((path, index) => (
              <Link
                key={index}
                to={path}
                className={`text-gray-300 hover:text-white transition-colors ${
                  location.pathname === path ? "text-white font-semibold" : ""
                }`}>
                {path === "/"
                  ? "Home"
                  : path
                      .split("/")[1]
                      .replace("-", " ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <>
                {user.user_metadata.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={signOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                onClick={signInWithGitHub}>
                Sign In With GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((prev) => !prev)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden bg-[rgba(10,10,10,0.95)] px-4 pb-4 rounded-b-lg">
            <div className="pt-2 space-y-2">
              {["/", "/create", "/communities", "/community/create"].map((path, index) => (
                <Link
                  key={index}
                  to={path}
                  onClick={closeMenu}
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors">
                  {path === "/"
                    ? "Home"
                    : path
                        .split("/")[1]
                        .replace("-", " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                </Link>
              ))}

              <div className="pt-2 border-t border-white/10">
                {user ? (
                  <div className="flex items-center space-x-3 pt-3">
                    {user.user_metadata.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-gray-300">{displayName}</span>
                    <button
                      className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                    onClick={() => {
                      signInWithGitHub();
                      closeMenu();
                    }}>
                    Sign In With GitHub
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
