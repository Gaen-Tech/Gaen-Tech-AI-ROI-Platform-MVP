import React, { useState, useEffect } from 'react';
import { View } from '../types';

interface CookieConsentProps {
  setView: (view: View) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ setView }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('privacy');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-4 md:mb-0 text-center md:text-left">
          We use local storage to enhance your experience. By using our site, you agree to our{' '}
          <a href="#" onClick={handlePrivacyClick} className="underline text-cyan-400 hover:text-cyan-300">
            Privacy Policy
          </a>.
        </p>
        <button
          onClick={acceptCookies}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-semibold transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
