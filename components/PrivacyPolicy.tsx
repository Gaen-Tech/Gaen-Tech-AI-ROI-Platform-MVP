import React from 'react';
import { FileTextIcon } from './icons/Icon';
import { View } from '../types';

interface PrivacyPolicyProps {
    setView: (view: View) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setView }) => {
  return (
    <div className="bg-slate-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileTextIcon className="w-16 h-16 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last Updated: October 13, 2025
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-8 space-y-8">
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Our Commitment to Privacy</h2>
                <p className="text-gray-300 mb-4">
                    Your privacy is critically important to us. At Gaen Technologies, we have a few fundamental principles:
                </p>
                <ul className="space-y-2 text-gray-300 ml-6 list-disc">
                    <li>We are thoughtful about the personal information we ask you to provide and the personal information that we collect about you through the operation of our services.</li>
                    <li>We store personal information for only as long as we have a reason to keep it.</li>
                    <li>We aim for full transparency on how we gather, use, and share your personal information.</li>
                    <li>We do not store your analysis data on our servers. All lead data is stored locally in your browser.</li>
                </ul>
            </section>
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                <p className="text-gray-300 mb-4">
                    This is a client-side application. We do not have a backend server that collects user data. The only data stored is within your own browser's local storage, which includes your generated leads and custom AI persona configurations.
                </p>
            </section>
            <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Data Sent to Third Parties</h2>
                <p className="text-gray-300 mb-4">
                    When you perform an analysis, the company URL you provide is sent to the Google Gemini API along with your API key. Google's API terms and privacy policy apply to this data. We do not send any other personal information to Google.
                </p>
            </section>
             <section className="border-t border-slate-700 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <p className="text-gray-300">
                  If you have questions about this Privacy Policy, please see our <a href="#" onClick={(e) => { e.preventDefault(); setView('terms'); }} className="text-cyan-400 hover:text-cyan-300 font-medium">Terms of Service</a> for contact information.
                </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;