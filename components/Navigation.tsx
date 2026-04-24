import Link from 'next/link';
import { Github, Code } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* Left: Logo & Title */}
      <Link href="/" className="flex items-center gap-3">
        <div className="bg-black text-white p-2 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">EdgeFlow API</span>
      </Link>

      {/* Center: Utility Links for Evaluator */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="https://github.com/YOUR_USERNAME/YOUR_REPO" target="_blank" rel="noreferrer" className="hover:text-black transition flex items-center gap-2">
          <Github className="w-4 h-4"/> 
          Source Code
        </a>
        <a href="/api/bfhl" target="_blank" className="hover:text-black transition flex items-center gap-2">
          <Code className="w-4 h-4"/> 
          GET /api/bfhl
        </a>
      </div>

      {/* Right: Author / CTA */}
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold text-gray-500 hidden sm:block">
          Govind Raj • SRMIST
        </div>
        <a 
          href="https://github.com/YOUR_USERNAME/YOUR_REPO" 
          target="_blank" 
          rel="noreferrer" 
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
        >
          View Repository
        </a>
      </div>
    </nav>
  );
}