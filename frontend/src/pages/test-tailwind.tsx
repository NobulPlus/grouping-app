import React from 'react';

export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          TailwindCSS Test Page
        </h1>
        
        {/* Test Basic Colors */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Basic Colors Test</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-20 bg-red-500 rounded-lg"></div>
            <div className="h-20 bg-blue-500 rounded-lg"></div>
            <div className="h-20 bg-green-500 rounded-lg"></div>
            <div className="h-20 bg-yellow-500 rounded-lg"></div>
          </div>
        </div>

        {/* Test Custom Colors */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Custom Group Colors Test</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-20 bg-group-orange rounded-lg flex items-center justify-center text-white font-bold">Orange</div>
            <div className="h-20 bg-group-blue rounded-lg flex items-center justify-center text-white font-bold">Blue</div>
            <div className="h-20 bg-group-green rounded-lg flex items-center justify-center text-white font-bold">Green</div>
            <div className="h-20 bg-group-purple rounded-lg flex items-center justify-center text-white font-bold">Black</div>
          </div>
        </div>

        {/* Test Gradients */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Gradient Test</h2>
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg mb-4"></div>
          <div className="h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg"></div>
        </div>

        {/* Test Hover Effects */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hover Effects Test</h2>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl">
            Hover Me!
          </button>
        </div>

        {/* Test Animations */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Animation Test</h2>
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-20 h-20 bg-purple-500 rounded-full animate-spin"></div>
            <div className="w-20 h-20 bg-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Test Responsive */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Responsive Test</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="h-20 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
            <div className="h-20 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
            <div className="h-20 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">3</div>
            <div className="h-20 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">4</div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 bg-green-500 text-white rounded-2xl p-6 text-center">
          <p className="text-2xl font-bold">✅ If you can see all the colors, gradients, and animations above, TailwindCSS is working perfectly!</p>
        </div>
      </div>
    </div>
  );
}
