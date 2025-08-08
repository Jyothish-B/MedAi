import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MedkitIcon, 
  SparklesIcon, 
  UploadCloudIcon, 
  CameraIcon 
} from './Icons';

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MedkitIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-800">
              Med<span className="text-blue-600">AI</span>
            </span>
          </div>
          <Link
            to="/prescription"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4 mr-2" />
            AI-Powered Prescription Analysis
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Understand Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Prescriptions{" "}
            </span>
            Instantly
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Upload a photo of your prescription and get instant, easy-to-understand explanations 
            in any language. Powered by advanced AI technology for accurate medical interpretation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/prescription"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
            >
              <UploadCloudIcon className="w-6 h-6" />
              Try Prescription Assistant
            </Link>
            <button className="text-slate-600 hover:text-slate-800 px-8 py-4 font-medium flex items-center gap-2 transition-colors">
              <CameraIcon className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

  {/* Features Grid */}
  <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <UploadCloudIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Easy Upload</h3>
            <p className="text-slate-600 leading-relaxed">
              Simply drag and drop or click to upload your prescription image. 
              Supports all common image formats.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <SparklesIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">AI Analysis</h3>
            <p className="text-slate-600 leading-relaxed">
              Advanced AI powered by Google Gemini analyzes your prescription 
              and provides accurate, detailed explanations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Multi-Language</h3>
            <p className="text-slate-600 leading-relaxed">
              Get explanations in your preferred language, including support 
              for sign language text conversion.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Upload Image</h3>
              <p className="text-slate-600">
                Take a photo or upload an image of your prescription
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Ask Questions</h3>
              <p className="text-slate-600">
                Type what you want to know about your medication
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Get Answers</h3>
              <p className="text-slate-600">
                Receive clear, easy-to-understand explanations instantly
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Understand Your Prescriptions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust MedAI for prescription clarity
          </p>
          <Link
            to="/prescription"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-3"
          >
            <MedkitIcon className="w-6 h-6" />
            Start Analyzing Now
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MedkitIcon className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">
              Med<span className="text-blue-600">AI</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} MedAI. For informational purposes only. 
            Always consult with healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
