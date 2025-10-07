
import React, { useState } from 'react';
import { SearchIcon, SparklesIcon, TrendingUpIcon, TargetIcon, ChevronRightIcon, AlertCircleIcon, LoadingSpinner } from './icons/Icon';
import { analyzeCompanyWebsite } from '../services/geminiService';
import type { View, Company, AnalysisResult, Industry } from '../types';

interface DiscoveryProps {
  onAnalyzeComplete: (company: Company, analysis: AnalysisResult) => void;
  setView: (view: View) => void;
}

export const Discovery: React.FC<DiscoveryProps> = ({ onAnalyzeComplete, setView }) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = 'https://' + formattedUrl;
        }
        const hostname = new URL(formattedUrl).hostname.replace('www.', '');
        const tempCompany: Company = {
            id: Date.now(),
            name: hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1),
            website: hostname,
            industry: 'Technology' as Industry,
            location: 'Online',
            contact: `info@${hostname}`
        };
        const analysisResult = await analyzeCompanyWebsite(tempCompany);
        setProgress(100);
      
      setTimeout(() => {
        onAnalyzeComplete(tempCompany, analysisResult);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      // Keep isAnalyzing true until navigation happens via callback
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url && !isAnalyzing) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 relative overflow-hidden text-gray-100">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 border border-pink-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Gaen Technologies" 
              className="w-12 h-12 rounded-xl shadow-lg shadow-purple-500/50"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Gaen Technologies</h1>
              <p className="text-sm text-cyan-400">Simplify Life</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setView('dashboard')}
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('leads')}
              className="px-4 py-2 text-white font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Leads
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="text-cyan-400 font-semibold">DISCOVER</span>
            </div>
            <ChevronRightIcon className="text-gray-600" />
            <div className="flex items-center gap-2 opacity-50"><div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold">2</div><span className="text-gray-500">ANALYZE</span></div>
            <ChevronRightIcon className="text-gray-600" />
            <div className="flex items-center gap-2 opacity-50"><div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold">3</div><span className="text-gray-500">QUALIFY</span></div>
          </div>
        </div>

        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered ROI Discovery
          </h2>
          <p className="text-xl text-gray-300">
            From Website Analysis to Proposal in Minutes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Company Discovery</h3>
              <p className="text-gray-400">Enter a company website URL to begin AI-powered analysis</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  disabled={isAnalyzing}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
                  <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!url || isAnalyzing}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner className="w-5 h-5" />
                    Analyzing... {progress}%
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Start AI Analysis
                  </>
                )}
              </button>
            </div>

            {isAnalyzing && (
              <div className="mt-6 space-y-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <SearchIcon className="w-6 h-6 text-cyan-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-gray-400">Scanning Website</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <TargetIcon className="w-6 h-6 text-purple-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-gray-400">Finding Opportunities</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <TrendingUpIcon className="w-6 h-6 text-pink-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-gray-400">Calculating ROI</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
