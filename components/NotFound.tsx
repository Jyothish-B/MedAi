import React from 'react';
import { Link } from 'react-router-dom';
import { MedkitIcon } from './Icons';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MedkitIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
          <Link
            to="/prescription"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Try Prescription Assistant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
